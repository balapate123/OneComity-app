// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    // Add more if needed
  },
});
