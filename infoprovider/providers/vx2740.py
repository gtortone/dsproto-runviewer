
class VX2740Provider:
    
    def __init__(self, odbConf, odbData):
        self.data = {}
        self.odbConf = odbConf
        self.odbData= odbData

        self.data['type'] = 'VX2740'
        self.data['description'] = 'VX2740 boards'
        self.data['eventsSent'] = int(odbData['Statistics']['Events sent'])
        moduleList = []
        for board in range(0,16):
            bstr = f'Board{str(board).zfill(2)}'
            if bstr in odbConf['Settings']:
                
                if 'Enable' in odbConf['Settings'][bstr]:
                    if bool(odbConf['Settings'][bstr]['Enable']) is False:
                        continue

                moduleItem = {}
                moduleItem['name'] = f'VX2740 board {board}'
                moduleItem['hostname'] = odbConf['Settings'][bstr]['Hostname (restart on change)']
                moduleItem['fwVersion'] = odbConf['Readback'][bstr]['Firmware version']
                moduleItem['useExtClock'] = odbConf['Readback'][bstr]['Use external clock']
                moduleItem['enableDAC'] = odbConf['Readback'][bstr]['Enable DC offsets']
                moduleItem['useRelativeTrigThreshold'] = odbConf['Readback'][bstr]['Use relative trig thresholds']

                channelList = []
                channels = self.getReadoutChannels(bstr)
                for channel in channels:
                    channelItem = {}
                    channelItem['number'] = channel
                    channelItem['threshold'] = self.odbConf['Readback'][bstr]['Chan over thresh thresholds'][channel]
                    edge = self.odbConf['Readback'][bstr]['Chan over thresh rising edge'][channel]
                    channelItem['thresholdEdge'] = 'positive' if edge else 'negative' 
                    channelItem['thresholdWidth'] = int(self.odbConf['Readback'][bstr]['Chan over thresh width (ns)'][channel], 16)
                    channelItem['dacOffset'] = self.odbConf['Readback'][bstr]['DC offset (pct)'][channel]

                    channelList.append(channelItem)

                moduleItem['channels'] = channelList
                moduleItem['waveform'] = self.getWaveformSetup(bstr)
                moduleItem['triggerSource'] = self.getTriggerSource(bstr)
                moduleItem['triggerOutput'] = self.getTriggerOutput(bstr)

                moduleList.append(moduleItem)

                self.data['modules'] = moduleList

    def getData(self):
        return self.data

    def getReadoutChannels(self, bstr):
        channels = []
        maskA = int(self.odbConf['Readback'][bstr]['Readout channel mask (31-0)'], 16)
        maskB = int(self.odbConf['Readback'][bstr]['Readout channel mask (63-32)'], 16)
        for i in range(0,32):
            if (maskA & (1<<i)):
                channels.append(i)
        for i in range(32,64):
            if (maskB & (1<<i-32)):
                channels.append(i)
        return channels

    def getWaveformSetup(self, bstr):
        wfSetup = {}
        timeUnits = [ 'ns', 'us', 'ms' ]

        wfSetup['samplesNumber'] = int(self.odbConf['Readback'][bstr]['Waveform length (samples)'], 16)
        timeWidth = wfSetup['samplesNumber'] * 8    # nanoseconds
        index = 0
        while timeWidth >= 1000:
            timeWidth = timeWidth / 1000
            index += 1

        wfSetup['timeWidth'] = timeWidth
        wfSetup['timeUnit'] = timeUnits[index]

        wfSetup['preTriggerSamples'] = int(self.odbConf['Readback'][bstr]['Pre-trigger (samples)'], 16)
        preTriggerWidth = wfSetup['preTriggerSamples'] * 8    # nanoseconds
        index = 0
        while preTriggerWidth >= 1000:
            preTriggerWidth = preTriggerWidth / 1000
            index += 1

        wfSetup['preTriggerWidth'] = preTriggerWidth
        wfSetup['preTriggerUnit'] = timeUnits[index]

        wfSetup['triggerDelaySamples'] = int(self.odbConf['Readback'][bstr]['Trigger delay (samples)'], 16)
        triggerDelayWidth = wfSetup['triggerDelaySamples'] * 8  # nanoseconds
        index = 0
        while triggerDelayWidth >= 1000:
           triggerDelayWidth = triggerDelayWidth / 1000
           index += 1

        wfSetup['triggerDelayWidth'] = triggerDelayWidth
        wfSetup['triggerDelayUnit'] = timeUnits[index]

        return wfSetup

    def getTriggerSource(self, bstr):
        triggerSource = {}

        # signals
        signalsList = []
        if self.odbConf['Readback'][bstr]['Trigger on ch over thresh A']:
            signalsList.append('channelOverThreshold - group A')
        if self.odbConf['Readback'][bstr]['Trigger on ch over thresh B']:
            signalsList.append('channelOverThreshold - group B')
        if self.odbConf['Readback'][bstr]['Trigger on ch over thresh A&&B']:
            signalsList.append('channelOverThreshold - group (A and B)')
        if self.odbConf['Readback'][bstr]['Trigger on external signal']:
            signalsList.append('external')
        if self.odbConf['Readback'][bstr]['Trigger on software signal']:
            signalsList.append('software')
        if self.odbConf['Readback'][bstr]['Trigger on user mode signal']:
            signalsList.append('user mode')
        if self.odbConf['Readback'][bstr]['Trigger on test pulse']:
            signalsList.append('test pulse')

        groupList = []
        if self.odbConf['Readback'][bstr]['Trigger on ch over thresh A'] or \
            self.odbConf['Readback'][bstr]['Trigger on ch over thresh A&&B']:
            groupItem = {}
            groupItem['name'] = 'A'
            groupItem['multiplicity'] = int(self.odbConf['Readback'][bstr]['Ch over thresh A multiplicity'], 16)
            groupItem['channels'] = self.getTriggerChannels(bstr, 'A')
            groupList.append(groupItem)

        if self.odbConf['Readback'][bstr]['Trigger on ch over thresh B'] or \
            self.odbConf['Readback'][bstr]['Trigger on ch over thresh A&&B']:
            groupItem = {}
            groupItem['name'] = 'B'
            groupItem['multiplicity'] = int(self.odbConf['Readback'][bstr]['Ch over thresh B multiplicity'], 16)
            groupItem['channels'] = self.getTriggerChannels(bstr, 'B')
            groupList.append(groupItem)

        if len(signalsList) > 0:
            triggerSource['signals'] = signalsList

        if len(groupList) > 0:
            triggerSource['groups'] = groupList

        return triggerSource

    def getTriggerChannels(self, bstr, group):
        channelList = []
        mask1 = int(self.odbConf['Readback'][bstr][f'Ch over thresh {group} en mask(31-0)'], 16)
        mask2 = int(self.odbConf['Readback'][bstr][f'Ch over thresh {group} en mask(63-32)'], 16)
        mask = (mask2 << 32) + mask1
                
        for channel in range(0,64):
            if mask & (1 << channel):
                channelItem = {}
                channelItem['number'] = channel
                channelItem['threshold'] = self.odbConf['Readback'][bstr]['Chan over thresh thresholds'][channel]
                edge = self.odbConf['Readback'][bstr]['Chan over thresh rising edge'][channel]
                channelItem['thresholdEdge'] = 'positive' if edge else 'negative'
                    
                channelList.append(channelItem)
                channel += 1

        return channelList

    def getTriggerOutput(self, bstr):
        triggerOutput = {}
        triggerOutput['mode'] = self.odbConf['Readback'][bstr]['Trigger out mode']
        triggerOutput['id'] = self.odbConf['Readback'][bstr]['Trigger ID mode']

        return triggerOutput
        




