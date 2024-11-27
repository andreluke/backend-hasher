import { defineRoutes } from "../../utils/defineRoutes.js";
import controller from "../../controllers/AuthController.js";

export default defineRoutes((app) => {
  app.post(
    "/login",
    {
      schema: {
        tags: ["auth"],
        description: "Login user",
        body: {
          type: "object",
          required: ["email", "senha"],
          properties: {
            email: {
              type: "string",
              description: "The email of the user",
            },
            senha: {
              type: "string",
              description: "The password of the user",
            },
          },
        },
        response: {
          200: {
            description: "Successful login",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Response message indicating success",
                example: "Usuário criado com sucesso",
              },
              usuario: {
                type: "object",
                description: "Details of the authenticated user",
                properties: {
                  nome: {
                    type: "string",
                    description: "User's name",
                  },
                  email: {
                    type: "string",
                    description: "User's email",
                  },
                  created_at: {
                    type: "string",
                    format: "date-time",
                    description: "User's creation date",
                  },
                  removed_at: {
                    type: "null",
                    description: "User's removal date (if any)",
                  },
                  _id: {
                    type: "string",
                    description: "Unique identifier of the user",
                  },
                  __v: {
                    type: "integer",
                    description: "Version key for the user object",
                  },
                },
              },
              senha: {
                type: "string",
                description: "User's password",
              },
              token: {
                type: "string",
                description: "JWT access token",
              },
              refreshToken: {
                type: "string",
                description: "JWT refresh token",
              },
            },
          },
          401: {
            description: "User not found",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Unauthorized response due to invalid credentials",
              },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Internal server error",
              },
            },
          },
        },
      },
    },
    controller.login
  );

  app.post(
    "/refresh-token",
    {
      schema: {
        tags: ["auth"],
        description: "Refresh JWT token",
        body: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: {
              type: "string",
              description: "The refresh token used to get a new access token",
            },
          },
        },
        response: {
          200: {
            description: "Successfully refreshed the token",
            type: "object",
            properties: {
              token: {
                type: "string",
                description: "New access token",
              },
              refreshToken: {
                type: "string",
                description: "New refresh token",
              },
            },
          },
          400: {
            description: "Bad request due to missing or invalid refresh token",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Error message",
              },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Error message",
              },
            },
          },
        },
      },
    },
    controller.refresh
  );
});
