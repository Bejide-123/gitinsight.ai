import mongoose from "mongoose";
import { requireEnv } from "@/lib/env";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const getMongoUri = (): string => {
  const { MONGODB_URI } = requireEnv(["MONGODB_URI"]);
  return MONGODB_URI as string;
};

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const getCached = (): MongooseCache => {
  if (!cached) {
    throw new Error("Mongoose cache is not initialized");
  }
  return cached;
};

async function dbConnect() {
  const cache = getCached();

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
    };

    const mongoUri = getMongoUri();

    cache.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnect;
