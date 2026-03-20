import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SmartShelf API",
      version: "1.0.0",
      description: "E-commerce API for SmartShelf App",
      contact: {
        name: "Shreyansh Singh Thakur",
        email: "thakur.shreyansh11@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, "../routes/*.ts"),
    path.join(__dirname, "../**/*Controller.ts"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
