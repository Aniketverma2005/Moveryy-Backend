// swagger/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Moveryy API's",
      version: "1.0.0",
      description: "Automatically generated Swagger docs",
    },
  },
  apis: ["src/routes/**/*.js", "src/swagger/**/*.js"]
};

export const swaggerSpec = swaggerJSDoc(options);
