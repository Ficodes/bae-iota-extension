const Mam = require('@iota/mam');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const provider = 'https://fiware.iota.cafe';

let root = 'WBYOIXJILDSIJSBHLRAPWELNFGHOG9GSHMW9WFJKETUCVXIDBMRQSHUVV9KB9MEIKKI9FTTJYRLQKYHXF'
// const root = 'I9EXYIPHZ9PG9KTTSM9KFPDJHUXAJBYGGZCNSFQKOKAPTGHJOWQNEGXKPSJDW9UZMNBCUIBIYVWDVSOVQ'
// const root = 'GLTAXNLRXBBCBISYLOJFPU9DRGXWBCLULQCUAUV9XXJPXCYEBCEDAXKRV9XYZS9ERMIEHVZSJAMMYBARG'


// Subscribe to messages
const mode = 'restricted';
const secretKey = 'MYBAESECRET';

//let mamState = Mam.init(provider);
//mamState = Mam.changeMode(mamState, mode, secretKey)

// Log messages

const readMessages = () => {
    return setTimeout(async () => {
        console.log('READING FROM ' + root)
        let resp = await Mam.fetch(root, mode, secretKey)
        root = resp.nextRoot
        console.log('MSG', JSON.parse(trytesToAscii(resp.messages)), '\n')
    }, 1000)
}

readMessages()
