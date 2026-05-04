import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "./config";

/**
 * Wrapper for `getServerSession` so that you don't need to import `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => getServerSession(ctx.req, ctx.res, authOptions);

export { authOptions };
