
from providers.run import RunProvider
from providers.shift import ShiftProvider
from providers.logger import LoggerProvider
from providers.hv import HVProvider
from providers.lakeshore import LakeshoreProvider
from providers.steering import SteeringModuleProvider
from providers.v1725b import V1725BProvider

def getSummary(odb):

    dictMerged = {}

    if 'Runinfo' in odb:
        dictMerged['RI'] = RunProvider(odb['Runinfo']).getData()

    if 'Edit on Start' in odb['Experiment']:
        dictMerged['SI'] = ShiftProvider(odb['Experiment']['Edit on Start']).getData()

    if 'Logger' in odb:
        dictMerged['LI'] = LoggerProvider(odb['Logger']).getData()

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

    return dictMerged
