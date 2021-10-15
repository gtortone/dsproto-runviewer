
class HVProvider:
    
    def __init__(self, mclient, slots, channels, metrics, basedir='/Equipment/CAEN_HV'):
        self.mclient = mclient
        self.slots = slots
        self.channels = channels
        self.metrics = metrics
        self.basedir = basedir
        self.data = {}

        if mclient.odb_exists(basedir) is True:
            hvTree = mclient.odb_get(basedir)
            self.data['description'] = 'high voltage'
            moduleList = []
            slotIndex = 0
            for slot in self.slots:
                moduleItem = {}
                moduleItem['name'] = mclient.odb_get(f'{basedir}/Status/Slot {slot}/Model')
                moduleItem['description'] = mclient.odb_get(f'{basedir}/Status/Slot {slot}/Description')

                channelList = []
                for channel in channels[slotIndex]:
                    channelItem = {}
                    channelItem['number'] = channel
                    channelItem['name'] = mclient.odb_get(f'{basedir}/Settings/Slot {slot}/ChName[{channel}]')
                    metricList = []
                    for metric in metrics[slotIndex]:
                        metricItem = {}
                        metricItem['name'] = metric
                        subdir = 'Settings' if 'Set' in metric else 'Status'
                        metricItem['value'] = mclient.odb_get(f'{basedir}/{subdir}/Slot {slot}/{metric}[{channel}]')
                        if metric.find("(") != -1:
                            metricItem['unit'] = metric[metric.find("(")+1:metric.find(")")]

                        metricList.append(metricItem)

                    channelItem['metrics'] = metricList

                    channelList.append(channelItem)

                moduleItem['channels'] = channelList
                moduleList.append(moduleItem)
                slotIndex = slotIndex + 1

            self.data['modules'] = moduleList

    def getData(self):
        return self.data
