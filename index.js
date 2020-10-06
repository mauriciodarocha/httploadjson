/**
 * Install packages and run.
 * $ npm start
 * 
 * Create keys:
 * $ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
 */

const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors');

const keyPem = fs.readFileSync('./resources/key.pem');
const certPem = fs.readFileSync('./resources/cert.pem');

const app = express();
const PORTSSL = 8443;

const sslOptions = {
    key: keyPem,
    cert: certPem,
    passphrase: "1234"
};

async function getJsonFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/api/:filename', (req, res) => {
    const filename = req.params.filename;
    getJsonFile(filename).then((data) => {
        const json = JSON.parse(data)
        res.json(json);
    }).catch((error) => {
        res.json({
            "message": `File: ${filename} not found.`
        })
    })
});

app.all('*', (req, res) => {
    const json = {
        "message": "Use /api/filename.json to load your json file."
    }
    res.status(200).send(json);
});

console.log(`Open: https://localhost:${PORTSSL}`);
https.createServer(sslOptions, app).listen(PORTSSL);