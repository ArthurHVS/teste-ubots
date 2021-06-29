module.exports = {
    apps : [{
      name: "luxuryrentalcars",
      script: "./server.js",
      env: {
        PORT: 3000,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 3001,
        NODE_ENV: "production",
      }
    }]
  }