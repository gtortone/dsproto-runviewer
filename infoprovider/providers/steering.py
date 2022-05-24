
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
            qmap = {}
            qmap['q1'] = {}
            qmap['q2'] = {}
            qmap['q3'] = {}
            qmap['q4'] = {}
            moduleItem['type'] =  'pduplus'
            #qmap['main'] = odb['Settings']['PDUPlus map']['Quadrants']
            qmap['q1']['main'] = odb['Settings']['PDUPlus map']['Quadrants'][0]
            qmap['q2']['main'] = odb['Settings']['PDUPlus map']['Quadrants'][1]
            qmap['q3']['main'] = odb['Settings']['PDUPlus map']['Quadrants'][2]
            qmap['q4']['main'] = odb['Settings']['PDUPlus map']['Quadrants'][3]
            qmap['q1']['lv'] = odb['Settings']['PDUPlus map']['Quadrant 1 tiles LV']
            qmap['q2']['lv'] = odb['Settings']['PDUPlus map']['Quadrant 2 tiles LV']
            qmap['q3']['lv'] = odb['Settings']['PDUPlus map']['Quadrant 3 tiles LV']
            qmap['q4']['lv'] = odb['Settings']['PDUPlus map']['Quadrant 4 tiles LV']
            qmap['q1']['hv'] = odb['Settings']['PDUPlus map']['Quadrant 1 tiles HV']
            qmap['q2']['hv'] = odb['Settings']['PDUPlus map']['Quadrant 2 tiles HV']
            qmap['q3']['hv'] = odb['Settings']['PDUPlus map']['Quadrant 3 tiles HV']
            qmap['q4']['hv'] = odb['Settings']['PDUPlus map']['Quadrant 4 tiles HV']
            moduleItem['quadrants'] = qmap
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
