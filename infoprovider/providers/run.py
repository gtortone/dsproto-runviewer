
class RunProvider:
    
    def __init__(self, mclient, basedir='/Runinfo'):
        self.mclient = mclient
        self.basedir = basedir
        self.runStates = ['', 'stopped', 'paused', 'running']
        self.data = {}

        if mclient.odb_exists(basedir) is True:
            self.data['runNumber'] = mclient.odb_get(f'{basedir}/Run number')
            self.data['state'] = self.runStates[mclient.odb_get(f'{basedir}/State')]
            self.data['startTime'] = mclient.odb_get(f'{basedir}/Start time')
            self.data['startTimestamp'] = mclient.odb_get(f'{basedir}/Start time binary')
            self.data['stopTime'] = mclient.odb_get(f'{basedir}/Stop time')
            self.data['stopTimestamp'] = mclient.odb_get(f'{basedir}/Stop time binary')  # =0 during run

        if mclient.odb_exists('/Experiment/Edit on Start'):
            odict = mclient.odb_get('/Experiment/Edit on Start')
            for key in odict.keys():
                self.data[key] = odict[key]

    def getData(self):
        return self.data
