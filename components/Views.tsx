import { STARTUPS_QUERY_FOR_VIEWS } from "@/sanity/lib/queries";
import React from "react";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";

const Views = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUPS_QUERY_FOR_VIEWS, { id });
  console.log("result", result);
  const totalViews = result?.views || 0;

  after(async () => {
    await writeClient
      .patch(id)
      .set({ views: totalViews + 1 })
      .commit();
  });

  return (
    // {post?.views || 0}
    <>
      <div className="flex justify-end mt-4">
        <div className="bg-pink-100 text-blue-900 text-sm px-5 py-2 rounded-xl shadow-md flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H21M21 12H15M5.5 12A6.5 6.5 0 0 1 12 5.5m0 13A6.5 6.5 0 0 0 18.5 12M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
            />
          </svg>
          <span className="text-lg font-medium">views:{totalViews}</span>
        </div>
      </div>
    </>
  );
};

export default Views;
