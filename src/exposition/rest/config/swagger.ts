import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clean Architecture API',
      version: '1.0.0',
      description: 'API documentation for the Clean Architecture project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The user ID',
            },
            name: {
              type: 'string',
              minLength: 2,
              description: 'The user name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The user email',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'The user password',
            },
          },
          required: ['name', 'email', 'password'],
        },
        CreateUserDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              description: 'The user name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The user email',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'The user password',
            },
          },
          required: ['name', 'email', 'password'],
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              description: 'The user name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The user email',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'The user password',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/exposition/rest/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);