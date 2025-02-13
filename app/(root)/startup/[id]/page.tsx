import { formatDateTime } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUPS_QUERY_BY_ID,
} from "@/sanity/lib/queries";
import Link from "next/link";
import Image from "next/image";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import Views from "@/components/Views";
import { auth } from "@/auth";
import { Session } from "next-auth";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

export const experimental_ppr = true;
const md = markdownit();

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  // withConfig({ useCdn: false })

  const [post,{ select: editorPicks }] = await Promise.all([await client.fetch(STARTUPS_QUERY_BY_ID, { id }),
    await client.fetch(PLAYLIST_BY_SLUG_QUERY, {slug: "editor-s-picks-for-the-month"}),]);
  
  // const post = await client.fetch(STARTUPS_QUERY_BY_ID, { id });
  console.log("post details", post);
  const parsedContent = md.render(post?.pitch || "");

  // const { select: editorPicks } = await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
  //   slug: "editor-s-picks-for-the-month",
  // });

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">
          {post?._createdAt ? formatDateTime(post._createdAt) : "Unknown date"}
        </p>

        <h1 className="heading">{post?.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>
      <section className="section_container bg-white p-8 rounded-2xl shadow-lg">
        <div className="relative overflow-hidden rounded-xl max-h-72">
          <img
            src={post?.image || "/default-avatar.png"}
            alt="thumbnail"
            className="w-full h-64 object-contain rounded-lg"
          />
        </div>

        <div className="space-y-8 mt-10 max-w-4xl mx-auto">
          {/* Author and category */}
          <div className="flex justify-between items-center">
            <Link
              href={`/user/${post?.author?._id}`}
              className="flex items-center gap-4 hover:opacity-80"
            >
              {post?.author && (
                <Image
                  src={post?.author?.image || "/default-avatar.png"}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="rounded-full shadow-lg"
                />
              )}
              <div>
                <p className="text-lg font-semibold">{post?.author?.name}</p>
                <p className="text-sm text-gray-500">
                  @{post?.author?.username}
                </p>
              </div>
            </Link>

            {/* Category Tag */}
            <p className="bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-full shadow-md">
              {post?.category}
            </p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
      </section>
      <div className="mt-14">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          ✨ Editor's Picks for the Month ✨
        </h2>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {editorPicks?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {editorPicks.map((post: any) => (
                <StartupCard key={post._id} post={post as StartupTypeCard} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center text-lg">
              No startups found this month.
            </p>
          )}
        </div>
      </div>
      <Suspense fallback={<Skeleton className="view_skeleton" />}>
        <Views id={post?._id || ""} />
      </Suspense>
    </>
  );
};

export default page;
