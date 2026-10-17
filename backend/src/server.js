// Local development entry point. Vercel uses `api/app.js` instead.
const { app, server } = require('./app');

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`SehatSaarthi Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
