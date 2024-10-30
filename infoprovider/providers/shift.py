
from providers.utils import camelCase

class ShiftProvider:

    def __init__(self, odb):
        self.data = {}

        for k,v in odb.items():
            if "key" in k:
                continue
            self.data[camelCase(k)] = v.replace("\"", "\\\"")

    def getData(self):
        return self.data

