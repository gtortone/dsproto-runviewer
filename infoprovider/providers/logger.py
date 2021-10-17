
class LoggerProvider:
    
    def __init__(self, odb):
        self.data = {}
        
        self.data['writeData'] = bool(odb['Write data'])
        self.data['eventsWritten'] = int(odb['Channels']['0']['Statistics']['Events written'])
        self.data['bytesWritten'] = int(odb['Channels']['0']['Statistics']['Bytes written'])
        self.data['diskLevel'] = float(odb['Channels']['0']['Statistics']['Disk level'])

    def getData(self):
        return self.data
