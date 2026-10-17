const connectDB = async () => {
  // Reuse an existing connection (serverless functions are reused across invocations).
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 15,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`MongoDB Atlas Connection Error: ${error.message}`);

    // Local fallback only makes sense outside production/serverless.
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      throw error;
    }

    console.log('Attempting fallback to Local MongoDB...');
    try {
      const localUri = 'mongodb://127.0.0.1:27017/sehatsaarthi';
      const localConn = await mongoose.connect(localUri, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`Fallback Local MongoDB Connected: ${localConn.connection.host}`);
      return localConn.connection;
    } catch (localError) {
      console.error(`Local MongoDB Connection Error: ${localError.message}`);
      throw localError;
    }
  }
};

module.exports = connectDB;
