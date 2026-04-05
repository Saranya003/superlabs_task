const http = require("http");
const app = require("./src/app");
const config = require('../backend/config/index');

app.set('config', config);

const port = config.app.port || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
