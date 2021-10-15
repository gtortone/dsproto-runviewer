
class V1725BProvider:
    
    def __init__(self, mclient, basedir='/Equipment/V1725_Data00'):
        self.mclient = mclient
        self.basedir = basedir
        self.data = {}

        if mclient.odb_exists(basedir) is True:
            self.data['description'] = 'V1725B boards'
            moduleList = []
            for board in range(0,16):
                if mclient.odb_exists(f'{basedir}/Settings/Board{board}'):
                    if mclient.odb_get(f'{basedir}/Settings/Board{board}/Enable'):
                        moduleItem = {}
                        moduleItem['name'] = f'V1725B board {board}'

                        channelList = []
                        channels = self.getReadoutChannels( board)
                        for channel in channels:
                            channelItem = {}
                            channelItem['number'] = channel
                            channelItem['dacOffset'] = mclient.odb_get(f'{basedir}/Settings/Board{board}/DAC[{channel}]')
                            dynamicRange = mclient.odb_get(f'{basedir}/Settings/Board{board}/Dynamic Range 2V (y) 0.5V (n)[{channel}]')
                            channelItem['dynamicRange'] = '2V' if dynamicRange else '0.5V'
                            channelList.append(channelItem)

                        moduleItem['channels'] = channelList
                        moduleItem['waveform'] = self.getWaveformSetup(board)
                        moduleItem['triggerSource'] = self.getTriggerSource(board)
                        moduleItem['triggerOutput'] = self.getTriggerOutput(board)

                        if 'couples' in moduleItem['triggerSource']:
                            polValue = mclient.odb_get(f'{basedir}/Settings/Board{board}/Board Configuration')
                            polarity = 'under-threshold' if polValue & 0x40 else 'over-threshold'
                            moduleItem['selfTriggerPolarity'] = polarity

                        moduleList.append(moduleItem)

        self.data['modules'] = moduleList 

    def getData(self):
        return self.data

    def getReadoutChannels(self, board):
        channels = []
        mask = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/Channel Mask')
        for i in range(0,16):
            if (mask & (1<<i)):
                channels.append(i)
        return channels

    def getWaveformSetup(self, board):
        wfSetup = {}
        sramSize = 5120000  # SRAM size of V7125B
        numBuffers = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ]     # use 'Buffer organization' as index
        timeUnits = [ 'ns', 'us', 'ms' ]
        bufferOrganization = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/Buffer organization')
        customSize = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/Custom size')

        if(customSize != 0):
            wfSetup['samplesNumber'] = customSize * 10
        else:
            wfSetup['samplesNumber'] = int((sramSize / numBuffers[bufferOrganization]) - 10)

        timeWidth = wfSetup['samplesNumber'] * 4    # nanoseconds
        index = 0
        while timeWidth >= 1000:
            timeWidth = timeWidth / 1000

        wfSetup['timeWidth'] = timeWidth
        wfSetup['timeUnit'] = timeUnits[index]

        postTriggerSamples = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/Post Trigger')
        postTriggerWidth = postTriggerSamples * 4 * 4
        index = 0
        while postTriggerWidth >= 1000:
            postTriggerWidth = postTriggerWidth / 1000

        wfSetup['postTriggerWidth'] = postTriggerWidth
        wfSetup['postTriggerUnit'] = timeUnits[index]

        wfSetup['totalBuffers'] = numBuffers[bufferOrganization]
        wfSetup['almostFullLevel'] = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/almost_full')

        return wfSetup

    def getTriggerSource(self, board):
            logic = ['AND','CH(n)','CH(n+1)','OR']
            triggerSource = {}
            mask = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/Trigger Source')

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
                    logicValue = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/SelfTrigger_Logic[{couple}]')
                    coupleItem['logic'] = logic[logicValue]

                    channelList = []
                    if (logicValue == 0 or logicValue == 3):
                        for channel in [couple*2, couple*2 + 1]:
                            channelItem = {}
                            channelItem['number'] = channel
                            channelItem['threshold'] = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/SelfTrigger_Threshold[{channel}]')
                            channelList.append(channelItem)
                    elif (logicValue == 1):
                        channelItem = {}
                        channel = couple * 2
                        channelItem['number'] = channel
                        channelItem['threshold'] = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/SelfTrigger_Threshold[{channel}]')
                        channelList.append(channelItem)
                    elif (logicValue == 2):
                        channelItem = {}
                        channel = couple * 2 + 1
                        channelItem['number'] = channel
                        channelItem['threshold'] = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/SelfTrigger_Threshold[{channel}]')
                        channelList.append(channelItem)

                    coupleItem['channels'] = channelList

                    coupleList.append(coupleItem)

            if len(coupleList) > 0:
                triggerSource['couples'] = coupleList

            return triggerSource

    def getTriggerOutput(self, board):
            logic = ['OR','AND','MAJ']
            triggerOutput = {}
            mask = self.mclient.odb_get(f'{self.basedir}/Settings/Board{board}/Trigger Output')

            # signals
            signalsList = []
            if mask & (1 << 30):
                signalsList.append('triggerIn')

            if mask & (1 << 31):
                signalsList.append('triggerSw')

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
