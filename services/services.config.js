module.exports = {
    apps: [
      {
        name: "gateway",
        script: "./gateway/index.js",
        watch: true,
        env: {
          "NODE_ENV": process.env.NODE_ENV,
          "GATEWAY_PORT": process.env.GATEWAY_PORT
        }
      },
      {
        name: "library-service",
        script: "./library-service/index.js",
        watch: true,
        env: {
          "NODE_ENV": process.env.NODE_ENV,
          "LIBRARY_SERVICE_PORT": process.env.LIBRARY_SERVICE_PORT
        }
      },
      {
        name: "communication-service",
        script: "./communication-service/index.js",
        watch: true,
        env: {
          "NODE_ENV": process.env.NODE_ENV,
          "COMMUNICATION_SERVICE_PORT": process.env.COMMUNICATION_SERVICE_PORT
        }
      },
      {
        name: "notification-service",
        script: "./notification-service/index.js",
        watch: true,
        env: {
          "NODE_ENV": process.env.NODE_ENV,
          "NOTIFICATION_SERVICE_PORT": process.env.NOTIFICATION_SERVICE_PORT
        }
      },
      {
        name: "identity-server",
        script: "./identity-server/index.js",
        watch: true,
        env: {
          "NODE_ENV": process.env.NODE_ENV,
          "IDENTITY_SERVER_PORT": process.env.IDENTITY_SERVER_PORT
        }
      },
      {
        name: "database",
        script: "./database/index.js",
        watch: true,
        autorestart: false,
        env: {
          "NODE_ENV": process.env.NODE_ENV
        }
      }
    ]
}