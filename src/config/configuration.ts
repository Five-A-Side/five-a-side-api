export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    uri: process.env.MONGO_URI,
  },
  grafana: {
    loki: {
      host: process.env.GRAFANA_LOKI_HOST,
      username: process.env.GRAFANA_LOKI_USERNAME,
      password: process.env.GRAFANA_LOKI_PASSWORD,
    },
  },
});
