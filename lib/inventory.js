const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

// Init MAM Channel
const mode = 'restricted';
const secretKey = 'TERMSTEST';
const provider = 'https://fiware.iota.cafe';

// Populate the seed to always use the same channel
// const seed = 'G9WUISWJUNRRU9YGKCEU9HRFQJGVRTXYAKNQHDFRXGSNKQQGQS9RROYT9FSJSNEQJ9QFKEBRKGKSCBIUJ'

let mamState = Mam.init(provider); // TODO: Provide the seed
mamState = Mam.changeMode(mamState, mode, secretKey)

// Writte in the MAM channel
const publish = async data => {
    const trytes = asciiToTrytes(JSON.stringify(data));
    const message = Mam.create(mamState, trytes);

    mamState = message.state;

    // Attach the payload
    await Mam.attach(message.payload, message.address)

    //console.log('Published', data, '\n');
    return message.root
}

const notificationHandler = (req, res) => {
    // Process inventory notification
    console.log(req.body)
    let event = req.body;

    if (event.eventType == 'ProductCreationNotification') {
        console.log('New event received')

        // Make MAM message for acquisition event
        publish(event.event.product).then((root) => {
            console.log('ROOT: ' + root)
            res.end()
        })

    } else {
        res.end()
    }
}


// ======================
const publishAll = async () => {
    let root = await publish({
        'msg': 'First message'
    })
    let exporer = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${secretKey.padEnd(81, '9')}&root=`
    console.log(exporer + root)
    console.log('ROOT: ' + root)
    
    root = await publish({
        'msg': 'Second message'
    })
    console.log('ROOT: ' + root)
    
    root = await publish({
        'msg': 'Third message'
    })
    console.log('ROOT: ' + root)
}

module.exports = {
    notificationHandler
}