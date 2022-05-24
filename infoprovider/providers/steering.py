
class SteeringModuleProvider:
    
    def __init__(self, odb):
        self.data = {}

        jsonDict = {}
        self.data['description'] = 'steering module'
        moduleList = []
        moduleItem = {}
        moduleItem['name'] = 'Steering Module'
        moduleItem['description'] = 'steering module'

        if odb['Settings']['Use PDUPlus map']:
            # PDU plus map
            moduleItem['type'] =  'pduplus'
            qList = []
            for q in range(0,4):
                quadrantItem = {}
                quadrantItem['number'] = q+1
                quadrantItem['main'] = odb['Settings']['PDUPlus map']['Quadrants'][q]
                quadrantItem['lowVoltage'] = odb['Settings']['PDUPlus map'][f'Quadrant {q+1} tiles LV']
                quadrantItem['highVoltage'] = odb['Settings']['PDUPlus map'][f'Quadrant {q+1} tiles HV']
                qList.append(quadrantItem)
                
            moduleItem['quadrants'] = qList
        else:
            # PDU original map
            moduleItem['type'] =  'pduoriginal'
            channelList = []
            for channel in range(0,25):
                channelItem = {}
                channelItem['number'] = channel
                if 'Original map' in odb['Settings']:
                    channelItem['lowVoltage'] = bool(odb['Settings']['Original map']['Low voltage'][channel])
                    channelItem['highVoltage'] = bool(odb['Settings']['Original map']['High voltage'][channel])
                else:
                    channelItem['lowVoltage'] = bool(odb['Settings']['Low voltage'][channel])
                    channelItem['highVoltage'] = bool(odb['Settings']['High voltage'][channel])
                channelList.append(channelItem)

                moduleItem['channels'] = channelList

        moduleList.append(moduleItem)
        self.data['modules'] = moduleList

    def getData(self):
        return self.data
