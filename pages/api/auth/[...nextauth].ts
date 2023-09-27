// import { NextApiHandler } from 'next';
// import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import GitHubProvider from 'next-auth/providers/github';
// import prisma from '../../../lib/prisma';

// const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
// export default authHandler;

// const options = {
//     providers: [
//         GitHubProvider({
//             clientId: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET,
//         }),
//     ],
//     adapter: PrismaAdapter(prisma),
//     secret: process.env.SECRET,
// };

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