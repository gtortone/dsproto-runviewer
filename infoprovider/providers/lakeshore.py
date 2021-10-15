
class LakeshoreProvider:
    
    def __init__(self, mclient, basedir='/Equipment/Lakeshore-336'):
        self.mclient = mclient
        self.basedir = basedir
        self.data = {}

        if mclient.odb_exists(basedir) is True:
            tempTree = mclient.odb_get(basedir)
            self.data['description'] = 'dewar temperature'
            moduleList = []
            moduleItem = {}
            moduleItem['name'] = 'Lakeshore 336'
            moduleItem['description'] = 'temperature controller'

            channelList = []
            for channel in range(0,4):
                channelItem = {}
                channelItem['number'] = channel
                channelItem['name'] = f'T{channel}'
                channelItem['value'] = mclient.odb_get(f'{basedir}/Variables/TEMP[{channel}]')
                channelItem['flag'] = mclient.odb_get(f'{basedir}/Variables/FLAG[{channel}]')

                channelList.append(channelItem)

            moduleItem['channels'] = channelList
            moduleList.append(moduleItem)

            self.data['modules'] = moduleList

    def getData(self):
        return self.data
