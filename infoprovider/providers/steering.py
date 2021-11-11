
class SteeringModuleProvider:
    
    def __init__(self, odb):
        self.data = {}

        jsonDict = {}
        self.data['description'] = 'steering module'
        moduleList = []
        moduleItem = {}
        moduleItem['name'] = 'Steering Module'
        moduleItem['description'] = 'steering module'

        channelList = []
        for channel in range(0,25):
            channelItem = {}
            channelItem['number'] = channel
            channelItem['lowVoltage'] = bool(odb['Settings']['Original map']['Low voltage'][channel])
            channelItem['highVoltage'] = bool(odb['Settings']['Original map']['High voltage'][channel])
            channelList.append(channelItem)

        moduleItem['channels'] = channelList
        moduleList.append(moduleItem)

        self.data['modules'] = moduleList

    def getData(self):
        return self.data
