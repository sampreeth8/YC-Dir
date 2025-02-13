// Import necessary utilities
import { twMerge } from "tailwind-merge";

// Custom classNames function (replaces `clsx`)
function classNames(...inputs: (string | false | undefined | null)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// Custom `cn` function that merges classes
export function cn(...inputs: (string | false | undefined | null)[]) {
  return twMerge(classNames(...inputs));
}

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

// Function to format date
export function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-US", options);
}

// Parse server action response function
export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}
