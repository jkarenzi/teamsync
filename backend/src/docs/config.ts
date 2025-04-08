import swaggerJsdoc from 'swagger-jsdoc'
import dotenv from 'dotenv'
dotenv.config()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TeamSync API',
      version: '1.0.0',
      description: 'TeamSync Api Documentation',
    },
    servers: [
      {
        url: process.env.APP_URL,
        description: 'Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerformat: 'JWT',
        },
      },
    },
  },
  apis: ['src/docs/*'],
};


export default swaggerJsdoc(options)