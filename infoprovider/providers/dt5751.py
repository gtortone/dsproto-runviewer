
from providers.utils import toInt

class DT5751Provider:
    
    def __init__(self, odb):
        self.data = {}
        self.odb = odb

        self.data['type'] = 'DT5751'
        self.data['description'] = 'DT5751 boards'
        self.data['eventsSent'] = int(odb['Statistics']['Events sent'])
        moduleList = []
        for board in range(0,16):
            if f'Board{board}' in odb['Settings']:

                if 'Enable' in odb['Settings'][f'Board{board}']:
                    if bool(odb['Settings'][f'Board{board}']['Enable']) is False:
                        continue

                moduleItem = {}
                moduleItem['name'] = f'DT5751 board {board}'

                moduleItem['desMode'] = bool(odb['Settings'][f'Board{board}']['Board Configuration'] & (1<<12))

                channelList = []
                channels = self.getReadoutChannels(board)
                for channel in channels:
                    channelItem = {}
                    channelItem['number'] = channel
                    channelItem['dacOffset'] = toInt(odb['Settings'][f'Board{board}']['DAC'][channel])
                    channelItem['threshold'] = toInt(self.odb['Settings'][f'Board{board}']['SelfTrigger_Threshold'][channel])
                    channelList.append(channelItem)

                moduleItem['desMode'] = bool(odb['Settings'][f'Board{board}']['Board Configuration'] & (1<<12))
                moduleItem['channels'] = channelList
                moduleItem['waveform'] = self.getWaveformSetup(board)
                moduleItem['triggerSource'] = self.getTriggerSource(board)
                moduleItem['triggerOutput'] = self.getTriggerOutput(board)

                if 'channels' in moduleItem['triggerSource']:
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
        for i in range(0,4):
            if (mask & (1<<i)):
                channels.append(i)
        return channels

    def getWaveformSetup(self, board):
        wfSetup = {}
        numBuffers = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ]     # use 'Buffer organization' as index
        timeUnits = [ 'ns', 'us', 'ms' ]
        bufferOrganization = self.odb['Settings'][f'Board{board}']['Buffer organization']
        customSize = self.odb['Settings'][f'Board{board}']['Custom size']
        desMode = bool(self.odb['Settings'][f'Board{board}']['Board Configuration'] & (1<<12))

        if (desMode):
            sramSize = 1.8 * 1024 * 1024 * 2        # 3.6MS / ch
        else:
            sramSize = 1.8 * 1024 * 1024            # 1.8MS / ch 

        if(customSize != 0):
            wfSetup['samplesNumber'] = customSize * 7
        else:
            wfSetup['samplesNumber'] = int(sramSize / numBuffers[bufferOrganization])

        if (desMode):
           wfSetup['samplesNumber'] *= 2;

        if (desMode):
            timeWidth = wfSetup['samplesNumber']/2      # 1 sample every 0.5ns (500ps)
        else:
            timeWidth = wfSetup['samplesNumber']        # 1 sample every 1ns

        index = 0
        while timeWidth >= 1000:
            timeWidth = timeWidth / 1000
            index += 1

        wfSetup['timeWidth'] = timeWidth
        wfSetup['timeUnit'] = timeUnits[index]

        postTriggerSamples = toInt(self.odb['Settings'][f'Board{board}']['Post Trigger'])
        postTriggerWidth = postTriggerSamples * 4 * 4       # nanoseconds

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
            triggerSource = {}
            mask = toInt(self.odb['Settings'][f'Board{board}']['Trigger Source'])

            # channels
            channelList = []
            for channel in range(0,4):
                if mask & (1 << channel):
                    channelItem = {}
                    channelItem['channelNumber'] = channel
                    channelItem['threshold'] = toInt(self.odb['Settings'][f'Board{board}']['SelfTrigger_Threshold'][channel])

                    channelList.append(channelItem)

            if len(channelList) > 0:
                triggerSource['channels'] = channelList

            # signals
            signalsList = []
            if mask & (1 << 30):
                signalsList.append('triggerIn')

            if mask & (1 << 31):
                signalsList.append('triggerSw')
                triggerSource['triggerSwRate'] = float(self.odb['Settings'][f'Board{board}']['Software trigger rate (Hz)'])

            if len(signalsList) > 0:
                triggerSource['signals'] = signalsList

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

            # channels
            channelList = []
            for channel in range(0,4):
                if mask & (1 << channel):
                    channelList.append(channel)

            if len(channelList) > 0:
                triggerOutput['channelsList'] = channelList
                triggerOutput['channelsLogic'] = logic[(mask & 0x300) >> 8]

            return triggerOutput
