import { MongoClient, MongoClientOptions } from "mongodb";
import dns from "node:dns";

// Fix for Node 18+ IPv6 DNS resolution issues with MongoDB Atlas SRV
dns.setDefaultResultOrder("ipv4first");

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// Fix Crash #3: MongoDB Connection Pool Exhaustion.
// maxPoolSize controls the maximum number of concurrent connections.
// minPoolSize keeps a few warm connections always open.
// maxIdleTimeMS closes idle connections to prevent Atlas free-tier limits from being hit.
const options: MongoClientOptions = {
  family: 4,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,    // Cap at 10 connections across all serverless invocations
  minPoolSize: 1,     // Keep 1 connection warm
  maxIdleTimeMS: 60000, // Close idle connections after 60s
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so that the value is preserved across
  // module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
