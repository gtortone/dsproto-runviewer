
class HVProvider:
    
    def __init__(self, odb, slots, channels, metrics):
        self.slots = slots
        self.channels = channels
        self.metrics = metrics
        self.data = {}

        self.data['description'] = 'high voltage'
        moduleList = []
        slotIndex = 0
        for slot in self.slots:
            moduleItem = {}
            moduleItem['name'] = odb['Status'][f'Slot {slot}']['Model']
            moduleItem['description'] = odb['Status'][f'Slot {slot}']['Description']

            channelList = []
            for channel in channels[slotIndex]:
                channelItem = {}
                channelItem['number'] = channel
                channelItem['name'] = odb['Settings'][f'Slot {slot}']['ChName'][channel]
                metricList = []
                for metric in metrics[slotIndex]:
                    metricItem = {}
                    metricItem['name'] = metric
                    subdir = 'Settings' if 'Set' in metric else 'Status'
                    metricItem['value'] = odb[subdir][f'Slot {slot}'][metric][channel]
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
