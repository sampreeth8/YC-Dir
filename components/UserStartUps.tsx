import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import React from "react";
import StartupCard, { StartupTypeCard } from "./StartupCard";

const UserStartUps = async ({ id }: { id: string }) => {
  const startups = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUPS_BY_AUTHOR_QUERY, { id });
  return (
    <>
      {startups?.length > 0 ? (
        startups.map((post: any) => (
          <StartupCard key={post._id} post={post as StartupTypeCard} />
        ))
      ) : (
        <p className="no-results">No Posts found</p>
      )}
    </>
  );
};

export default UserStartUps;
