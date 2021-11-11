
function historyURL(setup, group, panel, tstart, tstop) {
   var baseURL = ''
   if (setup === 1) {
      baseURL='http://darkside-cdaq.na.infn.it/midas'
   } else if (setup === 2) {
      baseURL='http://darkside-daq.na.infn.it/midas'
   }
   if (tstop === undefined)
      tstop = Math.floor(Date.now() / 1000)
      
   return [baseURL, '/?cmd=History', `&group=${group}`, `&panel=${panel}`, `&A=${tstart}`, `&B=${tstop}`].join('')
}

export default historyURL
