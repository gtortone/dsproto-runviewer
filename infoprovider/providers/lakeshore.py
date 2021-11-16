
class LakeshoreProvider:
    
    def __init__(self, odb):
        self.data = {}

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
            channelItem['value'] = odb['Variables']['TEMP'][channel]
            channelItem['flag'] = odb['Variables']['FLAG'][channel]
            channelItem['unit'] = 'K'

            channelList.append(channelItem)

        moduleItem['channels'] = channelList
        moduleList.append(moduleItem)

        self.data['modules'] = moduleList

    def getData(self):
        return self.data
