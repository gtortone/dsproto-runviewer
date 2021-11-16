
class CryoEpicsProvider:
    
    def __init__(self, odb):
        self.data = {}

        self.data['description'] = 'dewar temperature'
        moduleList = []
        moduleItem = {}
        moduleItem['name'] = 'Cryostat EPICS parameters'
        moduleItem['description'] = 'EPICS controller'

        channelList = []
        for channel in range(1,10):
            channelItem = {}
            name = f'DS:Level{channel}'
            channelItem['number'] = channel
            channelItem['name'] = name
            channelItem['value'] = odb['Variables'][name]
            channelItem['unit'] = 'K'

            channelList.append(channelItem)

        channelItem = {}
        channelItem['number'] = 10
        channelItem['name'] = 'DS:ColdBox'
        channelItem['value'] = odb['Variables']['DS:ColdBox']
        channelItem['unit'] = 'K'
        channelList.append(channelItem)

        channelItem = {}
        channelItem['number'] = 11
        channelItem['name'] = 'DS:CryostatPressure'
        channelItem['value'] = odb['Variables']['DS:CryostatPressure']
        channelItem['unit'] = 'mbar'
        channelList.append(channelItem)

        moduleItem['channels'] = channelList
        moduleList.append(moduleItem)

        self.data['modules'] = moduleList

    def getData(self):
        return self.data
