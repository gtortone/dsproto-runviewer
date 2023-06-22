#!/usr/bin/env python3

import os
import re
import sys
import time
import socket
import datetime
import argparse
import midas.client
import midas.file_reader
import json
from dotenv import load_dotenv

from config.frontend import getSummary
from db.rundb import RunDb

load_dotenv()

parser = argparse.ArgumentParser(description="DS Proto MIDAS RunViewer information provider")
parser.add_argument('--dump', action='store_true', help='dump json to screen without store it on database')
parser.add_argument('--sync', action='store_true', help='synchronize with state transition')
parser.add_argument('--rundir', action='store', type=str, help='run base directory')
parser.add_argument('--run', action='store', type=int, help='run number')
parser.add_argument('--force', action='store_true', help='force delete of run in database before insert')
parser.add_argument('--host', action='store', type=str, help='MIDAS hostname')
parser.add_argument('--expt', action='store', type=str, help='MIDAS experiment name')
parser.add_argument('--verbose', action='store_true', help='print additional info on screen')
args = parser.parse_args()

sys.dont_write_bytecode = True

# fetch whole ODB tree from file or online ODB
if args.run:
    if args.rundir is None:
        print('E: missing rundir option')
        sys.exit(-1)
    run = str(args.run).zfill(int(os.getenv('RUNNUMWIDTH')))
    rundir = f'{args.rundir}/run{run}'
    print('I: fetch ODB from run file')
    try:
        flist = os.listdir(rundir)
    except:
        print(f'E: directory {rundir} does not exist')
        sys.exit(-1)

    if len(flist) == 0:
        print(f'E: directory {rundir} is empty')
        sys.exit(-1)

    startFile = stopFile = None
    fdict = {}      # key is subrun
    for f in flist:
        if f.startswith(f'run{run}'):
            mlist = re.findall('\d+', f)
            if len(mlist) > 1:
                subrun = int(mlist[1])
            else:
                subrun = f
            fdict[subrun] = f
    sortedSubrun = sorted(fdict.keys())
    startFile = fdict[sortedSubrun[0]] 
    stopFile = fdict[sortedSubrun[-1]]

    if startFile is None or stopFile is None:
        print(f'E: startFile or stopFile not found for run {args.run}')
        sys.exit(-1)

    print(f'I: startFile: {startFile}, stopFile: {stopFile}')

    startOdb = stopOdb = None
    # start file
    mfile = midas.file_reader.MidasFile(f'{rundir}/{startFile}')
    startOdb = mfile.get_bor_odb_dump().data

    # stop file
    mfile = midas.file_reader.MidasFile(f'{rundir}/{stopFile}')
    stopOdb = mfile.get_eor_odb_dump().data

    if startOdb is None and stopOdb is None:
        print("E: no BOR/EOR ODB found")
        sys.exit(-1)
    else:
        odbSource = 'FILE'
        if(args.verbose):
            print(startOdb)
            print(stopOdb)
else:
    odbSource = 'ONLINE'
    print('I: fetch ODB from online')
    try:
        mclient = midas.client.MidasClient("rvprovider", host_name=args.host, expt_name=args.expt)
    except Exception as e:
        print(f'E: {e}')
        sys.exit(-1)

    if args.sync:
        # wait DAQ status is running/stopped... to prevent collection of stale informations
        time.sleep(1)
        nloop = 0
        while True:
            if mclient.odb_get('/System/Transition/status') == 1:
                break
            if nloop < 15:
                time.sleep(1)
            else:
               printf(f'E: timeout waiting run state')
               sys.exit(-1)

    odb = mclient.odb_get('/')
    mclient.disconnect()

summary = {}
if odbSource == 'ONLINE':
    summary = getSummary(odb)
elif odbSource == 'FILE':
    summaryStart = getSummary(startOdb)
    summaryStop = getSummary(stopOdb)

if odbSource == 'ONLINE':
    runNumber = summary["RI"]["runNumber"]
elif odbSource == 'FILE':
    runNumber = summaryStart["RI"]["runNumber"]
    # check if stopTimestamp exists... (due to erase of last sub file)
    if 'stopTimestamp' not in summaryStop["RI"]:
        summaryStop["RI"]["stopTime"] = time.ctime(stopOdb['System']['Buffers']['SYSTEM']['Size/key']['last_written'])
        summaryStop["RI"]["stopTimestamp"] = stopOdb['System']['Buffers']['SYSTEM']['Size/key']['last_written']
        durationSec = summaryStop["RI"]["stopTimestamp"] - summaryStart["RI"]["startTimestamp"]
        durationStr = str(datetime.timedelta(seconds=durationSec))
        summaryStop["RI"]["duration"] = durationStr
        # mark the run as 'not complete': status = 'aborted'
        summaryStop["RI"]["partialRun"] = True

if args.dump:
    jsonDoc = {}
    if odbSource == 'FILE':
        summary['START'] = summaryStart
        summary['STOP'] = summaryStop
    jsonDoc = json.dumps(summary, indent=2)
    print(jsonDoc)
    sys.exit(0)

db = RunDb(os.getenv('DBHOST'), os.getenv('DBUSER'), os.getenv('DBPASS'), os.getenv('DBNAME'))

# temporary patch waiting for setup-1/setup-2 suppression
host = socket.gethostname()
hostid = 0
if (host == 'darkside-cdaq.na.infn.it'):
   hostid = 1
elif (host == 'darkside-daq.na.infn.it'):
   hostid = 2
else:
   print(f'host {host} not supported - abort')
   sys.exit(-1)
#

if odbSource == 'ONLINE':
    if db.hasRun(hostid, runNumber):
        # update stop summary
        db.updateStopField(hostid, runNumber, json.dumps(summary))
    else:
        # update start summary
        db.updateStartField(hostid, runNumber, json.dumps(summary))
elif odbSource == 'FILE':
    if db.hasRun(hostid, runNumber):
        if args.force:
            db.delete(hostid, runNumber)
            print(f"I: run {runNumber} already in db - removed")
        else:
            print(f"I: run {runNumber} already in db - no action executed")
            sys.exit(0)
    db.updateStartField(hostid, runNumber, json.dumps(summaryStart))
    db.updateStopField(hostid, runNumber, json.dumps(summaryStop))
    print(f"I: run {runNumber} - info added/updated")

