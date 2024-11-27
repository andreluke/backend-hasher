import { defineRoutes } from "../../utils/defineRoutes.js";
import controller from "../../controllers/UserController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
export default defineRoutes((app) => {
    app.post("/", {
        schema: {
            tags: ["user"],
            description: "Create a new user",
            body: {
                type: "object",
                required: ["email", "senha", "nome"],
                properties: {
                    nome: {
                        type: "string",
                        description: "The name of the user",
                    },
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
                201: {
                    description: "User created successfully",
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Response message indicating success",
                            example: "Usuário criado com sucesso",
                        },
                        usuario: {
                            type: "object",
                            description: "Details of the created user",
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
                400: {
                    description: "Bad request due to invalid or missing data",
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Error message indicating what went wrong",
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
    }, controller.create);
    app.get("/", {
        schema: {
            tags: ["user"],
            description: "Get a list of all users",
            response: {
                200: {
                    description: "List of users",
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            nome: { type: "string" },
                            email: { type: "string" },
                            created_at: { type: "string", format: "date-time" },
                            _id: { type: "string" },
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
        preHandler: authMiddleware,
    }, controller.list);
    app.get("/me", {
        schema: {
            tags: ["user"],
            description: "Get the authenticated user's information",
            response: {
                200: {
                    description: "Authenticated user information",
                    type: "object",
                    properties: {
                        nome: { type: "string" },
                        email: { type: "string" },
                        created_at: { type: "string", format: "date-time" },
                        _id: { type: "string" },
                    },
                },
                404: {
                    description: "User not found",
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Message indicating that the user was not found",
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
        preHandler: authMiddleware,
    }, controller.getUsuario);
    app.patch("/", {
        schema: {
            tags: ["user"],
            description: "Update an existing user's information",
            body: {
                type: "object",
                required: ["userId"],
                properties: {
                    userId: {
                        type: "string",
                        description: "The unique identifier of the user",
                    },
                    nome: { type: "string", description: "User's name" },
                    email: { type: "string", description: "User's email" },
                    senha: { type: "string", description: "User's password" },
                },
            },
            response: {
                200: {
                    description: "User updated successfully",
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Response message indicating success",
                            example: "Usuário atualizado com sucesso",
                        },
                    },
                },
                404: {
                    description: "User not found",
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Message indicating that the user was not found",
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
        preHandler: authMiddleware,
    }, controller.update);
    app.delete("/", {
        schema: {
            tags: ["user"],
            description: "Delete a user by their ID",
            body: {
                type: "object",
                required: ["userId"],
                properties: {
                    userId: {
                        type: "string",
                        description: "The unique identifier of the user to delete",
                    },
                },
            },
            response: {
                200: {
                    description: "User deleted successfully",
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Response message indicating success",
                            example: "Usuário removido com sucesso",
                        },
                    },
                },
                404: {
                    description: "User not found",
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Message indicating that the user was not found",
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
        preHandler: authMiddleware,
    }, controller.delete);
});
