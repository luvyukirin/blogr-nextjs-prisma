import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { AuthOptions } from 'next-auth'
import NextAuth from "next-auth";
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    secret: process.env.SECRET,
};



const authHandler = (req: NextApiRequest, res: NextApiResponse): NextApiHandler => NextAuth(req, res, authOptions);

export default authHandler;