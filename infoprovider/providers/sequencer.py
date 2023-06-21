
class SequencerProvider:
    
    def __init__(self, odb):
        self.data = {}

        self.data['loopCounter'] = odb['State']['Loop counter'][0]
        self.data['loopLimit'] = odb['State']['Loop n'][0]
        for line in odb['Script']['Lines']:
            if line.startswith('RUNDESCRIPTION'):
                if line.find('$') >= 0:
                    odbvar = line.split('$')[1]
                    self.data['runDescription'] = odb['Variables'][odbvar]
                else:
                    self.data['runDescription'] = line.split('"')[1]

    def getData(self):
        return self.data
