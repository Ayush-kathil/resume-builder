import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    };

    cached.promise = mongoose.connect(uri, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error: any) {
    cached.promise = null;

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`MongoDB Connection Error: ${errorMessage}`);
    
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('querySrv')) {
      console.error(
        'Network error detected: Please ensure your current IP address is whitelisted in MongoDB Atlas ' +
        '(Network Access tab) and check your DNS settings.'
      );
    }

    throw new Error('Database connection failed. Check server logs for details.');
  }

  return cached.conn;
}
