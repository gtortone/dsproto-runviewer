
from providers.run import RunProvider
from providers.shift import ShiftProvider
from providers.logger import LoggerProvider

def getSummary(odb):

    dictMerged = {}

    if 'Runinfo' in odb:
        dictMerged['RI'] = RunProvider(odb['Runinfo']).getData()

    if 'Edit on Start' in odb['Experiment']:
        dictMerged['SI'] = ShiftProvider(odb['Experiment']['Edit on Start']).getData()

    if 'Logger' in odb:
        dictMerged['LI'] = LoggerProvider(odb['Logger']).getData()

    return dictMerged
