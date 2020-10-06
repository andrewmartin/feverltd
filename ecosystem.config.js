module.exports = {
  apps: [
    {
      name: 'feverltd.com',
      script: 'yarn start -- -p $PORT',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT,
      },
    },
  ],
}
