
class LoggerProvider:
    
    def __init__(self, mclient, basedir='/Logger'):
        self.mclient = mclient
        self.basedir = basedir
        self.data = {}
        
        if mclient.odb_exists(basedir) is True:
            self.data['writeData'] = bool(mclient.odb_get(f'{basedir}/Write data'))
            self.data['eventsWritten'] = int(mclient.odb_get(f'{basedir}/Channels/0/Statistics/Events written'))
            self.data['bytesWritten'] = int(mclient.odb_get(f'{basedir}/Channels/0/Statistics/Bytes written'))
            self.data['diskLevel'] = mclient.odb_get(f'{basedir}/Channels/0/Statistics/Disk level')

    def getData(self):
        return self.data
