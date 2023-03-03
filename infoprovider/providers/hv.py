
class HVProvider:
    
    def __init__(self, odb):
        self.data = {}

        self.data['description'] = 'high voltage'
        moduleList = []
        for slot in odb['Status']:
            moduleItem = {}
            moduleItem['name'] = odb['Status'][slot]['Model']
            moduleItem['description'] = odb['Status'][slot]['Description']

            channelList = []
            for channel in range(0, odb['Status'][slot]['Num channels']):
                channelItem = {}
                channelItem['number'] = channel
                channelItem['name'] = odb['Settings'][slot]['ChName'][channel]
                # strip dangerous characters
                channelItem['name'] = channelItem['name'].replace('"','')
                metricList = []
                # status info
                for metric in odb['Status'][slot]:
                    if metric.endswith('/key'):
                        continue
                    if metric.lower().startswith('vmon') or metric.lower().startswith('imon'):
                        metricItem = {}
                        metricItem['name'] = metric
                        metricItem['value'] = odb['Status'][slot][metric][channel]
                        metricItem['unit'] = metric[metric.find("(")+1:metric.find(")")]
                        metricList.append(metricItem)
                    elif metric.lower() == 'status string':
                        metricItem = {}
                        metricItem['name'] = metric
                        metricItem['value'] = odb['Status'][slot][metric][channel]
                        metricList.append(metricItem)
                # settings info
                for metric in odb['Settings'][slot]:
                    if metric.endswith('/key'):
                        continue
                    if metric.lower().startswith('i0') or metric.lower().startswith('v0'):
                        metricItem = {}
                        metricItem['name'] = metric
                        metricItem['value'] = odb['Settings'][slot][metric][channel]
                        metricItem['unit'] = metric[metric.find("(")+1:metric.find(")")]
                        metricList.append(metricItem)

                channelItem['metrics'] = metricList
                channelList.append(channelItem)

            moduleItem['channels'] = channelList
            moduleList.append(moduleItem)

        self.data['modules'] = moduleList

    def getData(self):
        return self.data
