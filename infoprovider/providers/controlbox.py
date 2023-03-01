
class ControlModuleProvider:
    
    def __init__(self, odb):
        self.data = {}

        jsonDict = {}
        self.data['description'] = 'control module' 
        moduleList = []

        for i in range (0,16):
            if odb['Settings'][f'PDU {i}']['Enable'] is True:
                # pdu
                moduleItem = {}
                moduleItem['number'] = i
                # quadrant
                qList = []
                for q in range(0,4):
                    quadrantItem = {}
                    quadrantItem['number'] = q+1
                    quadrantItem['main'] = odb['Settings'][f'PDU {i}']['Quadrants'][q]
                    # tile
                    tList = []
                    for t in range(0,4):
                        tileItem = {}
                        tileItem['number'] = t+1
                        tileItem['lowVoltage'] = odb['Settings'][f'PDU {i}'][f'Quadrant {q+1} tiles LV'][t]
                        tileItem['highVoltage'] = odb['Settings'][f'PDU {i}'][f'Quadrant {q+1} tiles HV'][t]
                        tList.append(tileItem)

                    quadrantItem['tiles'] = tList

                    qList.append(quadrantItem)

                moduleItem['quadrants'] = qList
                moduleList.append(moduleItem)

        self.data['pdus'] = moduleList

    def getData(self):
        return self.data
