const Mam = require('@iota/mam');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mode = 'restricted'
const secretKey = 'MYVERYSECRETKEY'
const provider = 'https://fiware.iota.cafe'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${secretKey.padEnd(81, '9')}&root=`

// Initialise MAM State
let mamState = Mam.init(provider)

// Set channel mode
mamState = Mam.changeMode(mamState, mode, secretKey)

// Publish to tangle
const publish = async packet => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)

    // Save new mamState
    mamState = message.state

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9)

    console.log('Published', packet, '\n');
    //console.log('ROOT:' + message.root)
    return message.root
}

const publishAll = async () => {
  const root = await publish({
    message: 'Message from Me',
    timestamp: (new Date()).toLocaleString()
  })

  await publish({
    message: 'Message from other',
    timestamp: (new Date()).toLocaleString()
  })

  await publish({
    message: 'Message from ey',
    timestamp: (new Date()).toLocaleString()
  })

  return root
}

// Callback used to pass data out of the fetch
const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')

publishAll()
  .then(async root => {

    console.log('Checking root: ' + root)
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);

    // Output asyncronously using "logData" callback function
    await Mam.fetch(root, mode, secretKey, logData)

    // Output syncronously once fetch is completed
    const result = await Mam.fetch(root, mode, secretKey)
    result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
  })
