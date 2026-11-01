import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb://booknookAdmin:Qu9iBPjsw6orWwyW@ac-sfypucj-shard-00-00.ymga8vs.mongodb.net:27017,ac-sfypucj-shard-00-01.ymga8vs.mongodb.net:27017,ac-sfypucj-shard-00-02.ymga8vs.mongodb.net:27017/booknookDB?ssl=true&replicaSet=atlas-bqpnyl-shard-0&authSource=admin";

const secret = process.env.BETTER_AUTH_SECRET || "booknook_auth_secret_key_2026_super_secure";
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

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
    // লোকালহোস্টে কুকি মিসম্যাচ সমস্যা সমাধানের জন্য
    skipStateCookieCheck: true,
  },
  ...(googleClientId && googleClientSecret
    ? { socialProviders: { google: { clientId: googleClientId, clientSecret: googleClientSecret } } }
    : {}),
  baseURL,
  secret,
  trustedOrigins,
});