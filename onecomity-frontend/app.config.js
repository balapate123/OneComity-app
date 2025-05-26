export default ({ config }) => ({
  ...config,
  icon: "./assets/logo.png",
  plugins: [
    ...(config.plugins || []),
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
  ],
  android: {
    ...(config.android || {}),
    usesCleartextTraffic: true, // (for good measure, but plugin is key!)
  },
  extra: {
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    eas: {
      projectId: "2ae390c9-2b39-498b-8dbf-936307624a94",
    },
  },
});
