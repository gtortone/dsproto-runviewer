#!/usr/bin/env python3

import os
import sys
import argparse
import midas.client
import json
import mysql.connector as mysql
from dotenv import load_dotenv

from providers.run import RunProvider
from providers.shift import ShiftProvider
from providers.logger import LoggerProvider
from providers.hv import HVProvider
from providers.lakeshore import LakeshoreProvider
from providers.steering import SteeringModuleProvider
from providers.v1725b import V1725BProvider

load_dotenv()

parser = argparse.ArgumentParser(description="DS Proto MIDAS RunViewer information provider")
parser.add_argument('--setup', action='store', type=int, help='specify DS proto setup [1, 2]', choices=[1,2])
parser.add_argument('--dump', action='store_true', help='dump json to screen without store it on database')
args = parser.parse_args()

sys.dont_write_bytecode = True
mclient = midas.client.MidasClient("rvprovider")

# fetch whole ODB tree
odb = mclient.odb_get('/')

dictMerged = {}

if 'Runinfo' in odb:
    dictMerged['RI'] = RunProvider(odb['Runinfo']).getData()

if 'Edit on Start' in odb['Experiment']:
    dictMerged['SI'] = ShiftProvider(odb['Experiment']['Edit on Start']).getData()

if 'Logger' in odb:
    dictMerged['LI'] = LoggerProvider(odb['Logger']).getData()

if(args.setup == 1):

    if 'CAEN_HV' in odb['Equipment']:
        dictMerged['HV'] = HVProvider(odb['Equipment']['CAEN_HV'], slots=[4,6], 
                        channels=[[0,1,2], [0]], 
                        metrics = [['V0Set (V)', 'VMon (V)', 'I0Set (A)', 'IMon (A)', 'Status String'], 
                                   ['V0Set (V)', 'VMon (V)', 'I0Set (uA)', 'IMon (uA)', 'Status String']]).getData()

    if 'Lakeshore-336' in odb['Equipment']:
        dictMerged['DT'] = LakeshoreProvider(odb['Equipment']['Lakeshore-336']).getData()

    if 'SteeringModule' in odb['Equipment']:
        dictMerged['SM'] = SteeringModuleProvider(odb['Equipment']['SteeringModule']).getData()

    if 'V1725_Data00' in odb['Equipment']:
        dictMerged['BD'] = V1725BProvider(odb['Equipment']['V1725_Data00']).getData()

elif(args.setup == 2):
    None
else:
    print('E: unknown setup number')
    sys.exit(-1)

runNumber = dictMerged["RI"]["runNumber"]

if args.dump:
    jsonDoc = json.dumps(dictMerged, indent=2)
    print(jsonDoc)
    sys.exit(0)

try:
    db = mysql.connect(
        host=os.getenv('DBHOST'),
        user=os.getenv('DBUSER'),
        password=os.getenv('DBPASS'),
        database=os.getenv('DBNAME')
    )
except Error as e:
    print('E: MySQL connection failed')
    sys.exit(-1)

jsonDoc = json.dumps(dictMerged)
cursor = db.cursor()

select = f'SELECT * from ds.params WHERE setup = {args.setup} AND run = {runNumber}'
cursor.execute(select)
records = cursor.fetchall()

if len(records) == 0:       # run 'start' detected
    insert = f'INSERT INTO ds.params VALUES (NULL, {args.setup}, {runNumber}, \'{jsonDoc}\', NULL)'
    cursor.execute(insert)
else:                       # run 'stop' detected
    if records[0][4] is None:
        update = f'UPDATE ds.params SET jsonStop = \'{jsonDoc}\' WHERE setup = {args.setup} AND run = {runNumber}'
        cursor.execute(update)
    else:
        print(f'E: jsonStop already present (run {runNumber})')
        sys.exit(-1)

db.commit()

sys.exit(0)
