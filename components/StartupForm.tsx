"use client";

import React, { useState, useActionState } from "react";
import dynamic from "next/dynamic";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { formSchema } from "@/lib/validation";
import { createPitch } from "@/lib/actions";
import { z } from "zod";
import { useRouter } from "next/navigation";

import router from "next/router";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);
      console.log("result", result);

      if (result.status === "SUCCESS") {
        setMessage({
          type: "success",
          text: "Your startup pitch has been created successfully!",
        });
        window.location.href = `/startup/${result._id}`;
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("er1", error.flatten().fieldErrors);
        setErrors(
          error.flatten().fieldErrors as unknown as Record<string, string>
        );
        setMessage({
          type: "error",
          text: "Please check your inputs and try again.",
        });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      setMessage({ type: "error", text: "An unexpected error has occurred." });
      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <>
      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        action={formAction}
        className="space-y-8 bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your Startup Title"
          />
          {errors.title && (
            <p className="text-red-500 mt-1 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Provide a brief description of your Startup"
          />
          {errors.description && (
            <p className="text-red-500 mt-1 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter the Startup Category (e.g., Tech, Health, Education)"
          />
          {errors.category && (
            <p className="text-red-500 mt-1 text-sm">{errors.category}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="link"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Image URL
          </label>
          <input
            id="link"
            name="link"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter the Image URL for your Startup"
          />
          {errors.link && (
            <p className="text-red-500 mt-1 text-sm">{errors.link}</p>
          )}
        </div>

        {/* Pitch */}
        <div>
          <label
            htmlFor="pitch"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Pitch
          </label>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: "0.5rem", overflow: "hidden" }}
            textareaProps={{
              placeholder:
                "Briefly describe your idea and what problem it solves",
            }}
            previewOptions={{
              disallowedElements: ["style"],
            }}
          />
          {errors.pitch && (
            <p className="text-red-500 mt-1 text-sm">{errors.pitch}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#007cb9] text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Your Pitch"}
          <Send className="inline ml-2" />
        </button>
      </form>
    </>
  );
};

export default StartupForm;
