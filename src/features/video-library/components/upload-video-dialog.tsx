"use client";

import { useRef, useState, type SubmitEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createScopeApiUrl } from "@/lib/scope-api-url";

type UploadVideoDialogProps = {
  userId: string;
};

type ValidationErrorPayload = {
  detail?: string | Array<{ msg?: string }>;
};

function getCreatedVideoId(payload: unknown) {
  const video = Array.isArray(payload) ? payload[0] : payload;

  if (typeof video !== "object" || video === null) {
    return undefined;
  }

  const id =
    "video_id" in video
      ? video.video_id
      : "id" in video
        ? video.id
        : undefined;

  return typeof id === "string" ? id : undefined;
}

/** Creates URL-backed video lessons through the API and selects the result. */
function UploadVideoDialog({ userId }: UploadVideoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openDialog() {
    setError(undefined);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (!isSubmitting) {
      dialogRef.current?.close();
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError(undefined);
    setIsSubmitting(true);

    try {
      const response = await fetch(createScopeApiUrl("videos"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title: String(formData.get("title") ?? "").trim(),
          description: String(formData.get("description") ?? "").trim(),
          video_url: String(formData.get("video_url") ?? "").trim(),
        }),
      });
      // FastAPI returns validation details as either a message or issue list.
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const detail = (payload as ValidationErrorPayload | null)?.detail;
        const message = Array.isArray(detail) ? detail[0]?.msg : detail;
        throw new Error(message || "The video could not be added.");
      }

      const videoId = getCreatedVideoId(payload);

      form.reset();
      dialogRef.current?.close();

      if (videoId) {
        router.push(`/library?video=${encodeURIComponent(videoId)}`);
      } else {
        // Refresh the library when the API confirms creation without returning an ID.
        router.replace("/library");
        router.refresh();
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The video could not be added.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        className="px-3 cursor-pointer"
        onClick={openDialog}
      >
        <Image
          src="/icons/plus.svg"
          alt=""
          width={16}
          height={16}
        />
        <span>Add video</span>
      </Button>

      <dialog
        ref={dialogRef}
        className="m-auto w-11/12 max-w-xl rounded-xl border border-border bg-card p-0 text-card-foreground shadow-xl backdrop:bg-foreground/45"
        aria-labelledby="upload-video-title"
        aria-describedby="upload-video-description"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeDialog();
          }
        }}
      >
        <form className="space-y-5 p-6" onSubmit={handleSubmit}>
          <div>
            <h2 id="upload-video-title" className="text-xl font-bold">
              Add a video lesson
            </h2>
            <p
              id="upload-video-description"
              className="mt-2 text-sm leading-6 text-muted-foreground"
            >
              Provide lesson details and a direct link to a browser-playable video file.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="video-title">
              Title
            </label>
            <Input
              id="video-title"
              name="title"
              type="text"
              required
              autoFocus
              placeholder="Introduction to organic chemistry"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold"
              htmlFor="video-description"
            >
              Description
            </label>
            <Textarea
              id="video-description"
              name="description"
              rows={4}
              required
              placeholder="Describe what people will learn after watching this lesson."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="video-url">
              Video URL
            </label>
            <Input
              id="video-url"
              name="video_url"
              type="url"
              inputMode="url"
              required
              placeholder="https://example.com/lesson.mp4"
            />
            <p className="text-xs leading-5 text-muted-foreground">
              Use a direct HTTP or HTTPS media URL that points to a video file.
            </p>
          </div>

          <p className="text-sm text-destructive" role="status">
            {error}
          </p>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={isSubmitting}
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding…" : "Add video"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export { UploadVideoDialog };
