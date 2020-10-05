/**
 * Install express and run.
 * > npm start
 */

const express = require('express')
const app = express()
const fs = require('fs')
const port = 3000

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

app.get('/api/:filename', (req, res, next) => {
    const filename = req.params.filename;
    getJsonFile(filename).then((data) => {
        const json = JSON.parse(data)
        res.json(json);
    }).catch((error) => {
        res.json({
            "message": "File: "+filename+" not found."
        })
    })
});

app.all('*', (req, res) => {
    const json = {
        "message": "Use /api/filename.json to load your json file."
    }
    res.status(200).send(json);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});