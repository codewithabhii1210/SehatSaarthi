// Vercel serverless entry — wraps the same Express app used for local dev.
const { app } = require('../backend/src/app.js');

module.exports = (req, res) => {
  // Express apps are plain (req, res) handlers, so Vercel can call them directly.
  return app(req, res);
};
