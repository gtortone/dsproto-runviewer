
from providers.run import RunProvider
from providers.sequencer import SequencerProvider
from providers.shift import ShiftProvider
from providers.logger import LoggerProvider
from providers.hv import HVProvider
from providers.lakeshore import LakeshoreProvider
from providers.steering import SteeringModuleProvider
from providers.controlbox import ControlModuleProvider
from providers.v1725b import V1725BProvider
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

    if isRunning(odb, 'Logger'):
        dictMerged['LI'] = LoggerProvider(odb['Logger']).getData()

    if isRunning(odb, 'CAEN_HV'):
        dictMerged['HV'] = HVProvider(odb['Equipment']['CAEN_HV'], slots=[4,6],
                        channels=[[0,1,2], [0]],
                        metrics = [['V0Set (V)', 'VMon (V)', 'I0Set (A)', 'IMon (A)', 'Status String'],
                                   ['V0Set (V)', 'VMon (V)', 'I0Set (uA)', 'IMon (uA)', 'Status String']]).getData()

    if isRunning(odb, 'Lakeshore-336'):
        dictMerged['DT'] = LakeshoreProvider(odb['Equipment']['Lakeshore-336']).getData()

    if isRunning(odb, 'SteeringModule'):
        dictMerged['SM'] = SteeringModuleProvider(odb['Equipment']['SteeringModule']).getData()

    if isRunning(odb, 'ControlModule'):
        dictMerged['CM'] = ControlModuleProvider(odb['Equipment']['ControlModule']).getData()

    if isRunning(odb, 'EpicsFrontend'):
        data = EpicsProvider(odb['Equipment']['EpicsFrontend']).getData()
        if len(data['modules'][0]['channels']) > 0:
            dictMerged['DT'] = data

    if isRunning(odb, 'V1725_Data00'):
        dictMerged['BD'] = V1725BProvider(odb['Equipment']['V1725_Data00']).getData()

    return dictMerged
