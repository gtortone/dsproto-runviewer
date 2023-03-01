
class EpicsProvider:
    
    def __init__(self, odb):
        self.data = {}

        self.data['description'] = 'epics pv'
        moduleList = []
        moduleItem = {}
        moduleItem['name'] = 'EPICS parameters'
        moduleItem['description'] = 'EPICS controller'

        channelList = []
        for pv in odb['Settings']['PV list']:
          if pv in odb['Variables']:
              channelItem = {}
              channelItem['name'] = pv
              channelItem['value'] = odb['Variables'][str(pv)]
              if pv.lower().find('level') != -1:
                channelItem['unit'] = 'K'
              elif pv.lower().find('rtd') != -1:
                channelItem['unit'] = 'K'
              elif pv.lower().find('coldbox') != -1:
                channelItem['unit'] = 'K'
              elif pv.lower().find('pressure') != -1:
                channelItem['unit'] = 'mbar'
              channelList.append(channelItem)

        moduleItem['channels'] = channelList
        moduleList.append(moduleItem)

        self.data['modules'] = moduleList

    def getData(self):
        return self.data
