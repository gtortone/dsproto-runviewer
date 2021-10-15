
from providers.utils import camelCase

class RunProvider:
    
    def __init__(self, mclient, basedir='/Runinfo'):
        self.mclient = mclient
        self.basedir = basedir
        self.data = {}

        if mclient.odb_exists(basedir) is True:
            self.data['runNumber'] = mclient.odb_get(f'{basedir}/Run number')
            self.data['startTime'] = mclient.odb_get(f'{basedir}/Start time')
            self.data['startTimestamp'] = mclient.odb_get(f'{basedir}/Start time binary')
            stopTimestamp = mclient.odb_get(f'{basedir}/Stop time binary')
            if stopTimestamp != 0:
                self.data['stopTime'] = mclient.odb_get(f'{basedir}/Stop time')
                self.data['stopTimestamp'] = stopTimestamp

        if mclient.odb_exists('/Experiment/Edit on Start'):
            odict = mclient.odb_get('/Experiment/Edit on Start')
            for k,v in odict.items():
                self.data[camelCase(k)] = v

    def getData(self):
        return self.data
