
class VX2740Provider:
    
    def __init__(self, odbConf, odbData):
        self.data = {}
        self.odbConf = odbConf
        self.odbData= odbData

        self.data['description'] = 'VX2740 boards'
        self.data['eventsSent'] = int(odbData['Statistics']['Events sent'])

    def getData(self):
        return self.data
