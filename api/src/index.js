const express = require("express");
const routesUser = require("./routes/user");
const routesActivity = require("./routes/activity");
const routesAdmin = require("./routes/admin");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("../swagger.json");
const common = require("./common");

const app = express();
app.use(express.json());

// Add routes
app.use(routesUser);
app.use(routesActivity);
app.use(routesAdmin);

// Swagger configuration
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [`${__dirname}/routes/*.js`],
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle 404s
app.get("*", (req, res) => {
  common.sendResponse(res, common.httpCodes.NOT_FOUND, "Resource not found");
});

// Bind to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
