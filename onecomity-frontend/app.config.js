// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    "eas": {
        "projectId": "2ae390c9-2b39-498b-8dbf-936307624a94"
      }
    // Add more if needed
  },
});
