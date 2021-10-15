
class SteeringModuleProvider:
    
    def __init__(self, mclient, basedir='/Equipment/SteeringModule'):
        self.mclient = mclient
        self.basedir = basedir
        self.data = {}

        if mclient.odb_exists(basedir) is True:
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
                channelItem['lowVoltage'] = bool(mclient.odb_get(f'{basedir}/Settings/Low voltage[{channel}]'))
                channelItem['highVoltage'] = bool(mclient.odb_get(f'{basedir}/Settings/High voltage[{channel}]'))
                channelList.append(channelItem)

            moduleItem['channels'] = channelList
            moduleList.append(moduleItem)

            self.data['modules'] = moduleList

    def getData(self):
        return self.data
