const http = require('http');

const db = require('./utils/db')
const router = require('./router');

const hostname = '127.0.0.1';
const port = 3000;


//Init

db.init().then((db_client) => {
  const server = http.createServer(async (req, res) => {
    router.rout(req, res, db_client);
  });


  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}).catch(err => console.err(err))