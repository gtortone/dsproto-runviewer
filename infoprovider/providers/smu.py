
class SMUProvider:

    def __init__(self, odb):
        self.data = {}
        self.data['description'] = 'source metering unit'
        self.data['type'] = 'SMU'
        self.data['brand'] = odb['Settings']['brand']
        self.data['model'] = odb['Settings']['model']
        self.data['output'] = odb['Settings']['output']
        self.data['source'] = {}
        self.data['source']['function'] = odb['Settings']['source']['function']
        self.data['source']['level'] = odb['Settings']['source']['level']
        self.data['source']['vlimit'] = odb['Settings']['source']['Vlimit']
        self.data['source']['ilimit'] = odb['Settings']['source']['Ilimit']
        self.data['measure'] = {}
        self.data['measure']['function'] = odb['Settings']['measure']['function'].strip('"')
        self.data['measure']['value'] = odb['Variables']['MVAL']

    def getData(self):
        return self.data
