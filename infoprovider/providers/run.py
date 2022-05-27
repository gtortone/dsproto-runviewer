
import datetime
from providers.utils import toInt

class RunProvider:
    
    def __init__(self, odb):
        self.data = {}

        self.data['runNumber'] = odb['Run number']
        self.data['startTime'] = odb['Start time']
        self.data['startTimestamp'] = toInt(odb['Start time binary'])
        stopTimestamp = toInt(odb['Stop time binary'])
        if stopTimestamp != 0:
            self.data['stopTime'] = odb['Stop time']
            self.data['stopTimestamp'] = stopTimestamp
            durationSec = self.data['stopTimestamp'] - self.data['startTimestamp']
            durationStr = str(datetime.timedelta(seconds=durationSec))
            self.data['duration'] = durationStr

    def getData(self):
        return self.data
