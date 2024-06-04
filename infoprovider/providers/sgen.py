
class SGENProvider:

    def __init__(self, odb):
        self.data = {}
        self.data['description'] = 'waveform generator unit'
        self.data['type'] = 'SGEN'
        self.data['brand'] = odb['Settings']['brand']
        self.data['model'] = odb['Settings']['model']
        self.data['output'] = odb['Settings']['output']
        self.data['shape'] = odb['Settings']['shape']
        self.data['frequency'] = odb['Settings']['frequency']
        self.data['vhigh'] = odb['Settings']['Vhigh']
        self.data['vlow'] = odb['Settings']['Vlow']
        if (self.data['shape'] == 'PULS'):
            self.data['width'] = odb['Settings']['pulse']['width']

    def getData(self):
        return self.data
