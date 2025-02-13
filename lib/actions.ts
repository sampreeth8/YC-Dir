"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
// Removed the slugify import
import { writeClient } from "@/sanity/lib/write-client";

// Custom slug creation function
function createSlug(str: string): string {
    return str
        .toLowerCase()                     // Convert to lowercase
        .trim()                            // Trim whitespace
        .replace(/[^a-z0-9\s-]/g, '')      // Remove non-alphanumeric characters
        .replace(/\s+/g, '-')              // Replace spaces with dashes
        .replace(/-+/g, '-');              // Replace multiple dashes with a single dash
}

export const createPitch = async(
    state: any,
    formdata: FormData,
    pitch: string,
) => {

    const session = await auth();
    if (!session) {
        return parseServerActionResponse({
            error: "Not Signed In",
            status: "ERROR"
        });
    };

    let slug: any;
    const title = formdata.get("title");
    if (typeof title === "string") {
        // Using the custom createSlug function instead of slugify
        slug = createSlug(title);
    } else {
        throw new Error("Title is missing or not a string");
    }

    try {
        const res = await writeClient.create({
            _type: "startup",
            title,
            slug: {
                _type: "slug",  // Keep the slug type as it was
                current: slug,
            },
            description: formdata.get("description"),
            category: formdata.get("category"),
            image: formdata.get("link"),
            author: {
                _type: "reference",
                _ref: session?.id,
            },
            pitch,
        });

        return parseServerActionResponse({
            ...res,
            error: "",
            status: "SUCCESS",
        });
    } catch (error) {
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};
