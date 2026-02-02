import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management System API",
      version: "1.0.0",
      description: "API documentation for the Task Management System - A full-stack, real-time collaborative task management app",
      contact: {
        name: "API Support",
        email: "support@taskmanagement.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token stored in HttpOnly cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Task ID",
            },
            title: {
              type: "string",
              maxLength: 100,
              description: "Task title",
            },
            description: {
              type: "string",
              nullable: true,
              description: "Task description",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Task due date",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
              description: "Task priority level",
            },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"],
              nullable: true,
              description: "Task status",
            },
            creatorId: {
              type: "string",
              description: "ID of the user who created the task",
            },
            assignedToId: {
              type: "string",
              nullable: true,
              description: "ID of the user assigned to the task",
            },
            creator: {
              $ref: "#/components/schemas/User",
            },
            assignedTo: {
              $ref: "#/components/schemas/User",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Notification ID",
            },
            userId: {
              type: "string",
              description: "User ID who receives the notification",
            },
            taskId: {
              type: "string",
              description: "Related task ID",
            },
            message: {
              type: "string",
              description: "Notification message",
            },
            read: {
              type: "boolean",
              description: "Whether the notification has been read",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            task: {
              $ref: "#/components/schemas/Task",
              nullable: true,
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 8,
              description: "User's password (minimum 8 characters)",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 8,
              description: "User's password",
            },
          },
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title", "dueDate", "priority"],
          properties: {
            title: {
              type: "string",
              maxLength: 100,
              description: "Task title",
            },
            description: {
              type: "string",
              description: "Task description",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Task due date",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
              description: "Task priority level",
            },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"],
              description: "Task status",
            },
            assignedToId: {
              type: "string",
              description: "ID of the user to assign the task to",
            },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              maxLength: 100,
              description: "Task title",
            },
            description: {
              type: "string",
              description: "Task description",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Task due date",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
              description: "Task priority level",
            },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"],
              description: "Task status",
            },
            assignedToId: {
              type: "string",
              nullable: true,
              description: "ID of the user to assign the task to (null to unassign)",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              description: "User's full name",
            },
          },
        },
        UserTasksResponse: {
          type: "object",
          properties: {
            assignedToMe: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
              description: "Tasks assigned to the current user",
            },
            createdByMe: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
              description: "Tasks created by the current user",
            },
            overdue: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
              description: "Overdue tasks",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Tasks",
        description: "Task management endpoints",
      },
      {
        name: "Notifications",
        description: "Notification endpoints",
      },
    ],
  },
  apis: ["./src/modules/**/*.routes.ts"], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
