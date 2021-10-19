
class SequencerProvider:
    
    def __init__(self, odb):
        self.data = {}

        self.data['loopCounter'] = odb['State']['Loop counter'][0]
        self.data['loopLimit'] = odb['State']['Loop n'][0]

    def getData(self):
        return self.data
