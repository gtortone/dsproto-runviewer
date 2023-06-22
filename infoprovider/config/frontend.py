
from providers.run import RunProvider
from providers.sequencer import SequencerProvider
from providers.shift import ShiftProvider
from providers.logger import LoggerProvider
from providers.hv import HVProvider
from providers.lakeshore import LakeshoreProvider
from providers.steering import SteeringModuleProvider
from providers.controlbox import ControlModuleProvider
from providers.v1725b import V1725BProvider
from providers.dt5751 import DT5751Provider 
from providers.vx274x import VX274xProvider
from providers.epics import EpicsProvider
from providers.utils import *

def getSummary(odb):

    dictMerged = {}

    if 'Runinfo' in odb:
        dictMerged['RI'] = RunProvider(odb['Runinfo']).getData()

    if 'Sequencer' in odb:
        if bool(odb['Sequencer']['State']['Running']) is True:
            dictMerged['SQ'] = SequencerProvider(odb['Sequencer']).getData()

    if 'Edit on Start' in odb['Experiment']:
        dictMerged['SI'] = ShiftProvider(odb['Experiment']['Edit on Start']).getData()

    if 'Logger' in odb:
        dictMerged['LI'] = LoggerProvider(odb['Logger']).getData()

    # frontends

    # find an 'active' SteeringModule
    smName = None
    clients = odb['System']['Clients']
    for k,v in clients.items():
        if v['Name'].startswith('Steering'):
                smName = v['Name']
    if smName:
        dictMerged['SM'] = SteeringModuleProvider(odb['Equipment'][smName]).getData()

    if isRunning(odb, 'CAENHV'):
        dictMerged['HV'] = HVProvider(odb['Equipment']['CAEN_HV']).getData()

    if isRunning(odb, 'Lakeshore-336'):
        dictMerged['DT'] = LakeshoreProvider(odb['Equipment']['Lakeshore-336']).getData()

    if isRunning(odb, 'ControlModule'):
        dictMerged['CM'] = ControlModuleProvider(odb['Equipment']['ControlModule']).getData()

    if isRunning(odb, 'EpicsFrontend'):
        data = EpicsProvider(odb['Equipment']['EpicsFrontend']).getData()
        if len(data['modules'][0]['channels']) > 0:
            dictMerged['DT'] = data
    
    digife = []     # digitizers frontends

    if isRunning(odb, 'feov1725MTI00'):
        digife.append(V1725BProvider(odb['Equipment']['V1725_Data00']).getData())

    if isRunning(odb, 'VX2740_Group_00'):
        digife.append(VX274xProvider(odb['Equipment']['VX2740_Config_Group_000'], odb['Equipment']['VX2740_Data_Group_000']).getData())

    if isRunning(odb, 'feodt5751MTI00'):
        digife.append(DT5751Provider(odb['Equipment']['DT5751_Data00']).getData())

    if (len(digife) > 0):
        dictMerged['BD'] = digife

    return dictMerged
