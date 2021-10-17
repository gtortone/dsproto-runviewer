
from providers.utils import camelCase

class ShiftProvider:

    def __init__(self, odb):
        self.data = {}

        for k,v in odb.items():
            self.data[camelCase(k)] = v

    def getData(self):
        return self.data

