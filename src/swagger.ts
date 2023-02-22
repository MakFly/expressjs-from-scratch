const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Application of sport by Atecna",
  },
  host: "localhost:3000",
  basePath: "/api",
  schemes: ["http"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "Enter the token with the `Bearer: ` prefix, e.g. Bearer abcde12345",
    },
  },
  definitions: {
    User: {
      name: "Jhon Doe",
      password: "abcd1234",
      role: "USER | ADMIN"
    },
  },
};

const outputFile = "./swagger/swagger_output.json";
const endpointsFiles = ["./routes/index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
