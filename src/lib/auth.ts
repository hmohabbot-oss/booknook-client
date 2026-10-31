import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

// সরাসরি আপনার মঙ্গোডিবি ক্লাউড কানেকশন স্ট্রিং
const defaultUri = "mongodb://booknookAdmin:Qu9iBPjsw6orWwyW@ac-sfypucj-shard-00-00.ymga8vs.mongodb.net:27017,ac-sfypucj-shard-00-01.ymga8vs.mongodb.net:27017,ac-sfypucj-shard-00-02.ymga8vs.mongodb.net:27017/booknookDB?ssl=true&replicaSet=atlas-bqpnyl-shard-0&authSource=admin";
const uri = process.env.MONGODB_URI || defaultUri;

const client = new MongoClient(uri);
const db = client.db("booknookDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "booknook_auth_secret_key_2026",
  trustedOrigins: ["http://localhost:3000"],
});