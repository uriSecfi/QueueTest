const url = 'mongodb://127.0.0.1:27017'

const MongoClient = require('mongodb').MongoClient

const init = async () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, client) => {
            if (err) {
                console.err(err)
                reject(err)
            }
            console.log(`Connected MongoDB: ${url}`)
            resolve(client);
        })
    })
}

exports.init = init;