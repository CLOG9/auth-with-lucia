// lucia.ts
import { lucia } from "lucia";
import { fastify } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { ioredis } from "@lucia-auth/adapter-session-redis";
import prismaClient from "./prisma-client.js";
import redisClient from "./redis-client.js";
import "lucia/polyfill/node";
import { google } from "@lucia-auth/oauth/providers";
import * as routeConfig from "./default.json";
const prisma_client = prismaClient;
const redis_client = redisClient;
export const auth = lucia({
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: fastify(),
  adapter: {
    user: prisma(prisma_client),
    session: ioredis(redis_client),
  },
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});
export const googleAuth = google(auth, {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  redirectUri: routeConfig.default.oauthRedirectUri,
  scope: ["profile", "email"],
});
export type Auth = typeof auth;
