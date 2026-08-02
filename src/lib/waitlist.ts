import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const USE_CASES = [
  "Coding",
  "Study",
  "Business",
  "Content Creation",
  "Other",
] as const;

export type UseCase = (typeof USE_CASES)[number];

export const waitlistSchema = z.object({
  name: z.string().trim().max(100, "Name must be under 100 characters").optional(),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be under 255 characters"),
  country: z.string().trim().max(80, "Country must be under 80 characters").optional(),
  use_case: z.enum(USE_CASES).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export interface WaitlistRow {
  id: string;
  name: string | null;
  email: string;
  country: string | null;
  use_case: string | null;
  created_at: string;
}

export const formatPosition = (position: number) =>
  `#${String(position).padStart(4, "0")}`;

export class DuplicateEmailError extends Error {
  constructor() {
    super("This email is already on the waitlist.");
    this.name = "DuplicateEmailError";
  }
}

/** Insert a signup and return its 1-based waitlist position. */
export async function joinWaitlist(input: WaitlistInput): Promise<number> {
  const email = input.email.trim().toLowerCase();

  const { error } = await supabase.from("waitlist").insert({
    email,
    name: input.name?.trim() || null,
    country: input.country?.trim() || null,
    use_case: input.use_case || null,
  });

  if (error) {
    if (error.code === "23505") throw new DuplicateEmailError();
    throw new Error("Something went wrong. Please try again in a moment.");
  }

  return getWaitlistPosition(email);
}

export async function getWaitlistPosition(email: string): Promise<number> {
  const { data, error } = await supabase.rpc("get_waitlist_position", {
    _email: email.trim().toLowerCase(),
  });
  if (error || typeof data !== "number") return 0;
  return data;
}

export async function getWaitlistCount(): Promise<number> {
  const { data, error } = await supabase.rpc("get_waitlist_count");
  if (error || typeof data !== "number") return 0;
  return data;
}

export function toCSV(rows: WaitlistRow[]): string {
  const headers = ["Position", "Name", "Email", "Country", "Use Case", "Joined At"];
  const escape = (value: string | null) => `"${(value ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((row, index) =>
    [
      formatPosition(index + 1),
      escape(row.name),
      escape(row.email),
      escape(row.country),
      escape(row.use_case),
      escape(new Date(row.created_at).toISOString()),
    ].join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
