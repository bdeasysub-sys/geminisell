module.exports = {
  apps: [
    {
      name: "easysub",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1"
      }
    }
  ]
};
