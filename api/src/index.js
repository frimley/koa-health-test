const express = require("express");
const dotenv = require("dotenv");
const routesUser = require("./routes/user");
const routesActivity = require("./routes/activity");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("../swagger.json");

// Load config values from .env file
dotenv.config();

const app = express();
app.use(express.json());

// Add routes
app.use(routesUser);
app.use(routesActivity);

// swagger configuration
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [`${__dirname}/routes/*.js`],
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Bind to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
