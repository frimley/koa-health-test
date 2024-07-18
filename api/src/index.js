const express = require("express");
const dotenv = require("dotenv");
const routesInsecure = require("./routes/insecure");
const routesSecure = require("./routes/secure");

// Load config values from .env file
dotenv.config();

const app = express();
app.use(express.json());

// Add routes to the app
app.use(routesInsecure);
app.use(routesSecure);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
