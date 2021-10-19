#!/usr/bin/env python3

import os
import sys
import argparse
import midas.client
import midas.file_reader
import json
from dotenv import load_dotenv

from config.setup1 import getSummary as getSetup1Summary
from config.setup2 import getSummary as getSetup2Summary
from db.rundb import RunDb

load_dotenv()

parser = argparse.ArgumentParser(description="DS Proto MIDAS RunViewer information provider")
parser.add_argument('--setup', action='store', type=int, help='DS proto setup [1, 2]', choices=[1,2])
parser.add_argument('--dump', action='store_true', help='dump json to screen without store it on database')
parser.add_argument('--rundir', action='store', type=str, help='directory that contains run files')
parser.add_argument('--run', action='store', type=int, help='run number')
args = parser.parse_args()

sys.dont_write_bytecode = True

# fetch whole ODB tree from file or online ODB
if args.rundir and args.run:
    print('I: fetch ODB from run file')
    try:
        flist = os.listdir(args.rundir)
    except:
        print(f'E: directory {args.rundir} does not exist')
        sys.exit(-1)

    if len(flist) == 0:
        print(f'E: directory {args.rundir} is empty')
        sys.exit(-1)

    flist.sort()
    startFile = flist[0]
    stopFile = flist[len(flist)-1]
    print(f'I: startFile: {startFile}, stopFile: {stopFile}')

    startOdb = stopOdb = None
    # start file
    mfile = midas.file_reader.MidasFile(f'{args.rundir}/{startFile}')
    for event in mfile:
        if event.header.is_bor_event():
            startOdb = json.loads(event.non_bank_data)
    # stop file
    mfile = midas.file_reader.MidasFile(f'{args.rundir}/{stopFile}')
    for event in mfile:
        if event.header.is_eor_event():
            stopOdb = json.loads(event.non_bank_data)

    if startOdb is None and stopOdb is None:
        print("E: no BOR/EOR ODB found")
        sys.exit(-1)
    else:
        odbSource = 'FILE'
else:
    odbSource = 'ONLINE'
    print('I: fetch ODB from online')
    mclient = midas.client.MidasClient("rvprovider")
    odb = mclient.odb_get('/')
    mclient.disconnect()

summary = {}
if(args.setup == 1):
    if odbSource == 'ONLINE':
        summary = getSetup1Summary(odb)
    elif odbSource == 'FILE':
        summaryStart = getSetup1Summary(startOdb)
        summaryStop = getSetup1Summary(stopOdb)
elif(args.setup == 2):
    if odbSource == 'ONLINE':
        summary = getSetup2Summary(odb)
    elif odbSource == 'FILE':
        summaryStart = getSetup2Summary(startOdb)
        summaryStop = getSetup2Summary(stopOdb)
else:
    print('E: unknown setup number')
    sys.exit(-1)

if odbSource == 'ONLINE':
    runNumber = summary["RI"]["runNumber"]
elif odbSource == 'FILE':
    runNumber = summaryStart["RI"]["runNumber"]

if args.dump:
    jsonDoc = {}
    if odbSource == 'FILE':
        summary['START'] = summaryStart
        summary['STOP'] = summaryStop
    jsonDoc = json.dumps(summary, indent=2)
    print(jsonDoc)
    sys.exit(0)

db = RunDb(os.getenv('DBHOST'), os.getenv('DBUSER'), os.getenv('DBPASS'), os.getenv('DBNAME'))

if odbSource == 'ONLINE':
    if db.hasRun(args.setup, runNumber):
        # update stop summary
        db.updateStopField(args.setup, runNumber, json.dumps(summary))
    else:
        # update start summary
        db.updateStartField(args.setup, runNumber, json.dumps(summary))
elif odbSource == 'FILE':
    if not db.hasRun(args.setup, runNumber):
        db.updateStartField(args.setup, runNumber, json.dumps(summaryStart))
        db.updateStopField(args.setup, runNumber, json.dumps(summaryStop))
    else:
        print(f"I: run {runNumber} already in db - no action executed")

sys.exit(0)
