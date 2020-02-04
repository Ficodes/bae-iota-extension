const bodyParser = require('body-parser');
const express = require('express')
const request = require('request')
const inventory = require('./lib/inventory')

const inventoryURL = 'http://apis.docker:8080/DSProductInventory/api/productInventory/v2/hub'
const callbackURL = 'http://bae.iota.docker:3000/inventory'

const port = 3000;

// Initialize express routes
const app = express()
app.use(bodyParser.json());

app.post('/inventory', inventory.notificationHandler)

const init = () => {
    app.listen(port, () => {
        console.log(`Server running at ${port}/`);
    });
}

const makeSubcription = () => {
    let data = {
        callback: callbackURL
    };

    let headers = {
        'content-type': 'application/json'
    };

    let req = {
        method: 'POST',
        url: inventoryURL,
        headers: headers,
        body: JSON.stringify(data)
    };

    request(req, (err, response) => {
        if (!err && (response.statusCode == 201 || response.statusCode == 409)) {
            init()
        }
    });
}

const createInventorySubscription = () => {
    request.get(inventoryURL, (err, response, body) => {
        if (response.statusCode === 200) {
            let hubs = JSON.parse(body);
            if (hubs.filter((x) => x.callback === callbackURL).length > 0) {
                init()
            } else {
                makeSubcription()
            }
        } else {
            console.log('Error accessing to inventory data')
        }
    })
}

createInventorySubscription();

/*const keyGen = length => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'
    let key = ''
    while (key.length < length) {
        let byte = crypto.randomBytes(1)
        if (byte[0] < 243) {
            key += charset.charAt(byte[0] % 27)
        }
    }
    return key
}

seed = keyGen(81);
console.log('SEED: ' + seed)*/