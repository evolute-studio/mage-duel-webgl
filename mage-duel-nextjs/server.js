const fs = require('fs');
const https = require('https');
const next = require('next');

const app = next({ dev: true });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem'),
};

app.prepare().then(() => {
  https.createServer(options, (req, res) => {
    handle(req, res);
  }).listen(3001, () => {
    console.log('✅ HTTPS server running at https://localhost:3001');
  });
});
