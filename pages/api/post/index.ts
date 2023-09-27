// import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title & content

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { title, content } = req.body;

    // const session = await getSession({ req });
    // console.log('session data: ', session);

    // If you find that session returns null, you should consider to try
    // using getServerSession instead of getSession.
    // More to read: https://next-auth.js.org/getting-started/client#getsession
    const session = await getServerSession(req, res, authOptions);
    const result = await prisma.post.create({
        data: {
            title,
            content,
            author: {
                connect: {
                    email: session?.user?.email,
                },
            },
        },
    });

    res.json(result);
}

export default handler;