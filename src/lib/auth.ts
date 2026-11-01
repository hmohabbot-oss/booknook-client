import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

if (!uri) throw new Error("MONGODB_URI must be configured in the environment.");
if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters.");
}

const globalForMongo = globalThis as typeof globalThis & { bookNookMongo?: MongoClient };
const client = globalForMongo.bookNookMongo ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo.bookNookMongo = client;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const trustedOrigins = [
  baseURL,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DATABASE || "booknookDB")),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
   
   },
  ...(googleClientId && googleClientSecret
    ? { socialProviders: { google: { clientId: googleClientId, clientSecret: googleClientSecret } } }
    : {}),
  baseURL,
  secret,
  trustedOrigins,
});