const dbName = 'queue';
const parse = require('url-parse');

//Private 
const get_timeout_hellper = (req, res, db_client) => {
    return new Promise((resolve, reject) => {

        url = parse(req.url, true)
        const queueName = url.pathname.replace('/api/', '')

        //go to db
        const queueCollection = db_client.db(dbName).collection(queueName);

        queueCollection.findOne({}, true)
            .then((msg) => {
                if (msg != null) {
                    queueCollection.removeOne({
                        "_id": msg._id
                    }, true)
                }
                resolve(msg)
            })

    })
}

const get_send_msg_hellper = (res, msg) => {
    res.statusCode = msg == null ? 204 : 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(msg));
}


const _get = (req, res, db_client) => {
    url = parse(req.url, true)
    const timeout_ms = Number(url.query.timeout);

    get_timeout_hellper(req, res, db_client)
        .then((msg) => {
            if (msg == null) {
                setTimeout(() => {
                    get_timeout_hellper(req, res, db_client)
                        .then((msg) => {
                            get_send_msg_hellper(res, msg);
                        })

                }, timeout_ms);
            } else {
                get_send_msg_hellper(res, msg);
            }
        })
}
const _post = (req, res, db_client) => {

    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            let data = JSON.parse(Buffer.concat(chunks));
            resolve({
                "queue": req.url.replace('/api/', ''),
                "message": data
            });
        })
    }).then((data) => {
        const queueCollection = db_client.db(dbName).collection(data.queue);
        return queueCollection.insertMany([data.message]); //might return a promise.
    }).then((result) => {
        res.statusCode = 200;
        res.end(JSON.stringify(result));
    }).catch(err => {
        console.error(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(err));
    })
}

const _update = (req, res, db_client) => {
    throw new Error('Not implemented')
}

const _delete = (req, res, db_client) => {
    throw new Error('Not implemented')
}

const queue_handler = (req, res, db_client) => {
    switch (req.method) {
        case 'GET':
            _get(req, res, db_client)
            break;
        case 'POST':
            _post(req, res, db_client)
            break;
        case 'UPDATE':
            _update(req, res, db_client)
            break;
        case 'DELETE':
            _delete(req, res, db_client)
            break;
        default:
            throw new Error('Method is Not Supported')
    }
}

module.exports = queue_handler