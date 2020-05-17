const notFound = require('./api/404')
const queueApi = require('./api/queue')

const rout = async (req, res, db_client) => {
    switch (req.url) {
        case `${req.url.includes('/api/') ? req.url : "_NON_"}`:
            queueApi(req, res, db_client);
            break
        default:
            notFound(req, res);
    }
}


exports.rout = rout