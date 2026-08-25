"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createScopeApiUrl } from "@/lib/scope-api-url";

type CommentComposerProps = {
  userId: string;
  videoId: string;
};

/** Posts a new lesson comment and refreshes server-rendered discussion data. */
function CommentComposer({ userId, videoId }: CommentComposerProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = String(formData.get("content") ?? "").trim();

    if (!content) {
      setError("Enter a comment before posting.");
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    try {
      const response = await fetch(createScopeApiUrl("videos/comments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: videoId,
          user_id: userId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("The comment could not be posted.");
      }

      form.reset();
      // Re-run the Server Component data load so the persisted comment appears.
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The comment could not be posted.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="lesson-comment">
        Add a comment
      </label>
      <Textarea
        id="lesson-comment"
        name="content"
        rows={3}
        maxLength={2_000}
        required
        placeholder="Share a question or takeaway…"
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-destructive" role="status">
          {error}
        </p>
        <Button
          type="submit"
          className="ml-auto cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting…" : "Post comment"}
        </Button>
      </div>
    </form>
  );
}

export { CommentComposer };
