const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const productRoutes = require("./routes/api/adminRouter");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src-attr": ["'unsafe-inline'"], // allow inline attributes
      "script-src": ["'self'", "'unsafe-inline'"]
    }
  })
);
  
app.use(compression());


app.use(express.static(path.join(__dirname, "../../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.use(require('./routes/index'));


app.get("/", (req, res) => {
  res.send("Server is alive...");
});

module.exports = app;
