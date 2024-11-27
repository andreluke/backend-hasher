import { defineRoutes } from "../../utils/defineRoutes.js";
import controller from "../../controllers/LinkController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
  createLink,
  deleteLink,
  updateLink,
} from "../../interfaces/ILinkController.js";

export default defineRoutes((app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["link"],
        description: "List all links",
        response: {
          200: {
            description: "List of all links",
            type: "array",
            items: {
              type: "object",
              properties: {
                url: { type: "string", description: "URL of the link" },
                slug: { type: "string", description: "Slug of the link" },
                created_at: {
                  type: "string",
                  format: "date-time",
                  description: "Creation date",
                },
                _id: {
                  type: "string",
                  description: "Unique identifier of the link",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              message: { type: "string", description: "Error message" },
            },
          },
        },
      },
    },
    controller.list
  );

  app.get(
    "/:slug",
    {
      schema: {
        tags: ["link"],
        description: "Get a link by slug",
        response: {
          302: {
            description: "Redirects to the original URL",
            properties:{
                url: {
                    type: "string",
                    description: "Redirection link"
                }
            }
          },
          404: {
            description: "Link not found",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Message indicating link not found",
              },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              message: { type: "string", description: "Error message" },
            },
          },
        },
      },
    },
    controller.getBySlug
  );

  app.post<createLink>(
    "/",
    {
      schema: {
        tags: ["link"],
        description: "Create a new link",
        body: {
          type: "object",
          required: ["url"],
          properties: {
            url: { type: "string", description: "The URL to be shortened" },
            slug: { type: "string", description: "Custom slug for the link" },
          },
        },
        response: {
          201: {
            description: "Link created successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
                example: "Link criado com sucesso",
              },
              link: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  slug: { type: "string" },
                  created_at: { type: "string", format: "date-time" },
                  _id: { type: "string" },
                },
              },
            },
            400: {
              description: "Bad request, possibly due to invalid data",
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "Error message indicating invalid data",
                },
              },
            },
            500: {
              description: "Internal server error",
              type: "object",
              properties: {
                message: { type: "string", description: "Error message" },
              },
            },
          },
        },
      },
      preHandler: authMiddleware,
    },
    controller.create
  );

  app.delete<deleteLink>(
    "/:id",
    {
      schema: {
        tags: ["link"],
        description: "Delete a link by ID",
        response: {
          200: {
            description: "Link deleted successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
                example: "Link deletado com sucesso",
              },
            },
          },
          404: {
            description: "Link not found",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Error message indicating link not found",
              },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              message: { type: "string", description: "Error message" },
            },
          },
        },
      },
      preHandler: authMiddleware,
    },
    controller.delete
  );

  app.put<updateLink>(
    "/",
    {
      schema: {
        tags: ["link"],
        description: "Update a link",
        body: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "ID of the link to be updated" },
            url: { type: "string", description: "New URL for the link" },
            slug: { type: "string", description: "New slug for the link" },
          },
        },
        response: {
          200: {
            description: "Link updated successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
                example: "Link atualizado com sucesso",
              },
              link: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  slug: { type: "string" },
                  created_at: { type: "string", format: "date-time" },
                  _id: { type: "string" },
                },
              },
            },
          },
          404: {
            description: "Link not found",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Error message indicating link not found",
              },
            },
          },
          400: {
            description: "Bad request due to invalid data",
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Error message indicating invalid data",
              },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              message: { type: "string", description: "Error message" },
            },
          },
        },
      },
      preHandler: authMiddleware,
    },
    controller.update
  );
});
