import { cn, formatDateTime } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

import { Startup, Author } from "@/sanity.types";
import { Skeleton } from "./ui/skeleton";


export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };


export default function StartupCard({ post }: { post: StartupTypeCard }) {
  console.log(post)
  const {
    title,
    _id,
    description,
    image,
    category,
    views,
    author,
    slug,
    _createdAt,
  } = post;

  return (
    <div className="bg-[#fffafa] rounded-2xl shadow-lg p-5 w-full max-w-sm flex flex-col justify-between">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">{formatDateTime(_createdAt)}</p>
        <div className="flex items-center gap-2">
          <EyeIcon className="text-gray-500" size={16} />
          <span className="text-gray-500 text-sm">{views}</span>
        </div>
      </div>

      {/* Author Section */}
      <div className="mt-2 flex items-center gap-3">
        {author?.image ? (
          <Image
            src={author.image}
            alt={title || "Startup image"}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        )}
        <div>
          <p className="text-lg font-semibold">{author?.name}</p>
          <p className="text-gray-500 text-sm">{author?.bio}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-4">
        <h3 className="text-xl font-bold line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
      </div>

      {/* Image Section */}
      {image && (
        <div className="mt-4">
          <Image
            src={image}
            alt={title || "Startup image"}
            width={300}
            height={150}
            className="rounded-xl object-cover"
          />
        </div>
      )}

      {/* Category and Details Button */}
      <div className="mt-5 flex justify-between items-center">
      <Link href={`/?query=${category}`}><p className="text-blue-500 font-medium">{category}</p></Link>
        {slug && (
          <Link href={`/startup/${_id}`}>
            <button className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600">
              Details
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index.toString())}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

