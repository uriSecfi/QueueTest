const notFound = (req, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Sorry, Not Found');
}

module.exports = notFound