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
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];

  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach((iface) => {
      // Skip internal and non-IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        addresses.push(iface.address);
      }
    });
  });

  https.createServer(options, (req, res) => {
    handle(req, res);
  }).listen(3001, () => {
    console.log('✅ HTTPS server running at https://localhost:3001');
    if (addresses.length > 0) {
      addresses.forEach(address => {
        console.log(`Access from mobile at https://${address}:3001`);
      });
    }
  });
});
