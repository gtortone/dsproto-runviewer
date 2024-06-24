
class PSUProvider:

    def __init__(self, odb):
        self.data = {}
        self.data['description'] = 'power supply'
        chList = []
        self.data['type'] = 'PSU'
        self.data['brand'] = odb['Settings']['brand']
        self.data['model'] = odb['Settings']['model']
        self.data['output'] = odb['Settings']['output']

        for ch in range(0, len(odb['Variables']['VOLT'])):
            chData = {}
            chData['name'] = odb['Settings']['name'][ch]
            chData['voltage'] = odb['Variables']['VOLT'][ch]
            chData['current'] = odb['Variables']['CURR'][ch]
            chData['vset'] = odb['Variables']['VLIM'][ch]
            chData['ilimit'] = odb['Variables']['ILIM'][ch]
            chList.append(chData)

        self.data['channels'] = chList


    def getData(self):
        return self.data
