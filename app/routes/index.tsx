import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import * as React from "react";

type Post = {
  title: string;
  article: string;
};

type PostData = { id: string; attributes: Post }[];

type PostResponse = {
  data: PostData;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export const loader: LoaderFunction = async () => {
  // This is where Remix integrates with Strapi
  const response = await fetch("http://localhost:1337/api/posts");
  const postResponse = (await response.json()) as PostResponse;

    return json(
    postResponse.data.map((post) => ({
      ...post,
      attributes: {
        ...post.attributes,
        article: marked(post.attributes.article),
      },
    }))
  );
};

const Posts: React.FC = () => {
  const posts = useLoaderData<PostData>();
  console.log(posts);
  return (
    <>
      {posts?.map((post) => {
        const { title, article } = post.attributes;
        return (
          <article key={post.id}>
            <h1>{title}</h1>
            {/* Reminder that this can in fact be dangerous
                https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml */}
            <div dangerouslySetInnerHTML={{ __html: article }} />
          </article>
        );
      })}
    </>
  );
};
export default Posts;
