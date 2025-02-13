import { auth } from "@/auth";
import { StartupCardSkeleton } from "@/components/StartupCard";
import { Skeleton } from "@/components/ui/skeleton";
import UserStartUps from "@/components/UserStartUps";
import { client } from "@/sanity/lib/client";
import { GET_AUTHOR_BY_ID } from "@/sanity/lib/queries";
import { User } from "lucide-react";
import React, { Suspense } from "react";

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  console.log("uid", id);
  const session = await auth();

  const user = await client.fetch(GET_AUTHOR_BY_ID, { id });
  console.log("user details", user);

  return (
    <>
      <section className="profile-section bg-gray-50 py-12">
        {/* Profile Header */}
        <div className="profile-card bg-[rgb(238,43,105)] max-w-4xl mx-auto p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="profile-header text-center">
            <img
              src={user?.image ?? ""}
              alt={user?.name || "User Image"}
              width={160}
              height={160}
              className="rounded-full border-4 border-blue-500 mb-6"
            />
            <h2 className="text-3xl font-semibold text-gray-900">
              {user?.name}
            </h2>
            <p className="text-lg text-white mt-2">@{user?.username}</p>
            <p className="mt-4 text-white text-sm px-6">{user?.bio || "It's My bio"}</p>
          </div>
        </div>

        {/* Startups Section */}
        <div className="startups-section mt-16">
          <div className="startups-title text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800">
              {session?.id === id ? "Your" : "All"} Startups
            </h3>
          </div>
          <ul className="mt-7 card_grid">
             <Suspense fallback={<StartupCardSkeleton/>}>
             <UserStartUps id = {id}/>
             </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default page;
