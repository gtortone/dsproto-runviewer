
from providers.utils import toInt

class V1725BProvider:
    
    def __init__(self, odb):
        self.data = {}
        self.odb = odb

        self.data['type'] = 'V1725B'
        self.data['description'] = 'V1725B boards'
        self.data['eventsSent'] = int(odb['Statistics']['Events sent'])
        moduleList = []
        for board in range(0,16):
            if f'Board{board}' in odb['Settings']:

                if 'Enable' in odb['Settings'][f'Board{board}']:
                    if bool(odb['Settings'][f'Board{board}']['Enable']) is False:
                        continue

                moduleItem = {}
                moduleItem['name'] = f'V1725B board {board}'

                channelList = []
                channels = self.getReadoutChannels(board)
                for channel in channels:
                    channelItem = {}
                    channelItem['number'] = channel
                    channelItem['dacOffset'] = toInt(odb['Settings'][f'Board{board}']['DAC'][channel])
                    dynamicRange = odb['Settings'][f'Board{board}']['Dynamic Range 2V (y) 0.5V (n)'][channel]
                    channelItem['dynamicRange'] = '2V' if dynamicRange else '0.5V'
                    channelItem['threshold'] = toInt(self.odb['Settings'][f'Board{board}']['SelfTrigger_Threshold'][channel])
                    channelList.append(channelItem)

                moduleItem['channels'] = channelList
                moduleItem['waveform'] = self.getWaveformSetup(board)
                moduleItem['triggerSource'] = self.getTriggerSource(board)
                moduleItem['triggerOutput'] = self.getTriggerOutput(board)

                if 'couples' in moduleItem['triggerSource']:
                    polValue = toInt(odb['Settings'][f'Board{board}']['Board Configuration'])
                    polarity = 'under-threshold' if polValue & 0x40 else 'over-threshold'
                    moduleItem['selfTriggerPolarity'] = polarity

                moduleList.append(moduleItem)

                self.data['modules'] = moduleList 

    def getData(self):
        return self.data

    def getReadoutChannels(self, board):
        channels = []
        mask = toInt(self.odb['Settings'][f'Board{board}']['Channel Mask'])
        for i in range(0,16):
            if (mask & (1<<i)):
                channels.append(i)
        return channels

    def getWaveformSetup(self, board):
        wfSetup = {}
        sramSize = 5120000  # SRAM size of V7125B
        numBuffers = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ]     # use 'Buffer organization' as index
        timeUnits = [ 'ns', 'us', 'ms' ]
        bufferOrganization = self.odb['Settings'][f'Board{board}']['Buffer organization']
        customSize = self.odb['Settings'][f'Board{board}']['Custom size']

        if(customSize != 0):
            wfSetup['samplesNumber'] = customSize * 10
        else:
            wfSetup['samplesNumber'] = int((sramSize / numBuffers[bufferOrganization]) - 10)

        timeWidth = wfSetup['samplesNumber'] * 4    # nanoseconds
        index = 0
        while timeWidth >= 1000:
            timeWidth = timeWidth / 1000
            index += 1

        wfSetup['timeWidth'] = timeWidth
        wfSetup['timeUnit'] = timeUnits[index]

        postTriggerSamples = toInt(self.odb['Settings'][f'Board{board}']['Post Trigger'])
        postTriggerWidth = postTriggerSamples * 4 * 4
        index = 0
        while postTriggerWidth >= 1000:
            postTriggerWidth = postTriggerWidth / 1000
            index += 1

        wfSetup['postTriggerWidth'] = postTriggerWidth
        wfSetup['postTriggerUnit'] = timeUnits[index]

        wfSetup['totalBuffers'] = numBuffers[bufferOrganization]
        wfSetup['almostFullLevel'] = toInt(self.odb['Settings'][f'Board{board}']['almost_full'])

        return wfSetup

    def getTriggerSource(self, board):
            logic = ['AND','CH(n)','CH(n+1)','OR']
            triggerSource = {}
            mask = toInt(self.odb['Settings'][f'Board{board}']['Trigger Source'])

            # signals
            signalsList = []
            if mask & (1 << 30):
                signalsList.append('triggerIn')

            if mask & (1 << 31):
                signalsList.append('triggerSw')

            if len(signalsList) > 0:
                triggerSource['signals'] = signalsList

            # couples
            coupleList = []
            for couple in range(0,8):
                if mask & (1 << couple):
                    coupleItem = {}
                    coupleItem['coupleNumber'] = couple
                    logicValue = toInt(self.odb['Settings'][f'Board{board}']['SelfTrigger_Logic'][couple])
                    coupleItem['logic'] = logic[logicValue]

                    channelList = []
                    if (logicValue == 0 or logicValue == 3):
                        for channel in [couple*2, couple*2 + 1]:
                            channelItem = {}
                            channelItem['number'] = channel
                            channelItem['threshold'] = toInt(self.odb['Settings'][f'Board{board}']['SelfTrigger_Threshold'][channel])
                            channelList.append(channelItem)
                    elif (logicValue == 1):
                        channelItem = {}
                        channel = couple * 2
                        channelItem['number'] = channel
                        channelItem['threshold'] = toInt(self.odb['Settings'][f'Board{board}']['SelfTrigger_Threshold'][channel])
                        channelList.append(channelItem)
                    elif (logicValue == 2):
                        channelItem = {}
                        channel = couple * 2 + 1
                        channelItem['number'] = channel
                        channelItem['threshold'] = toInt(self.odb['Settings'][f'Board{board}']['SelfTrigger_Threshold'][channel])
                        channelList.append(channelItem)

                    coupleItem['channels'] = channelList

                    coupleList.append(coupleItem)

            if len(coupleList) > 0:
                triggerSource['couples'] = coupleList

            return triggerSource

    def getTriggerOutput(self, board):
            logic = ['OR','AND','MAJ']
            triggerOutput = {}
            mask = toInt(self.odb['Settings'][f'Board{board}']['Trigger Output'])

            # signals
            signalsList = []
            if mask & (1 << 30):
                signalsList.append('triggerIn')

            if mask & (1 << 31):
                signalsList.append('triggerSw')
                triggerOutput['triggerSwRate'] = float(self.odb['Settings'][f'Board{board}']['Software trigger rate (Hz)'])

            if len(signalsList) > 0:
                triggerOutput['signals'] = signalsList

            # couples
            coupleList = []
            for couple in range(0,8):
                if mask & (1 << couple):
                    coupleList.append(couple)

            if len(coupleList) > 0:
                triggerOutput['couplesList'] = coupleList
                triggerOutput['couplesLogic'] = logic[(mask & 0x300) >> 8]

            return triggerOutput
