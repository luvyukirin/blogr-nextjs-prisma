import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  });
  Router.push('/');
}

const css = `
.page {
  background: var(--geist-background);
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.25rem;
  border: 0.125rem solid rgba(0, 0, 0, 0.2);
}

input[type='submit'] {
  background: #ececec;
  border: 0;
  padding: 1rem 2rem;
}

.back {
  margin-left: 1rem;
}
`;

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || 'Unknown author'}</p>
        <ReactMarkdown children={props.content} />
        {
          !props.published && userHasValidSession && postBelongsToUser && (
            <button onClick={() => publishPost(props.id)}>Publish</button>
          )
        }
        {
          userHasValidSession && postBelongsToUser && (
            <button onClick={() => deletePost(props.id)}>Delete</button>
          )
        }
      </div>
      <style jsx>{css}</style>
    </Layout>
  );
};

export default Post;