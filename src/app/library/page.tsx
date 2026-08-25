import type { Metadata } from "next";

import { LessonLibraryShell } from "@/features/video-library/components/lesson-library-shell";
import { VideoWorkspace } from "@/features/video-library/components/video-workspace";
import {
  getComments,
  getScopeUserId,
  listVideos,
} from "@/lib/scope-api";

export const metadata: Metadata = {
  title: "Lesson Library | Edutainer",
  description:
    "Watch lessons, upload videos, and share ideas in your Edutainer library.",
};

type LibraryPageProps = {
  searchParams: Promise<{ video?: string | string[] }>;
};

/** Loads the selected lesson and its discussion for the server-rendered workspace. */
export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { video: requestedVideo } = await searchParams;
  const userId = getScopeUserId();

  // Repeated query parameters arrive as an array; this will select the first one if multiple are present.
  const requestedVideoId = Array.isArray(requestedVideo)
    ? requestedVideo[0]
    : requestedVideo;

  const videos = await listVideos(userId);
  const selectedVideo = requestedVideoId
    ? videos.find((video) => video.video_id === requestedVideoId) ?? null
    : videos[0] ?? null;
  const comments = selectedVideo
    ? await getComments(selectedVideo.video_id)
    : [];
  const lessons = videos.map(({ video_id, title, description }) => ({
    video_id,
    title,
    description,
  }));

  return (
    <LessonLibraryShell
      lessons={lessons}
      selectedVideoId={selectedVideo?.video_id}
      userId={userId}
    >
      <VideoWorkspace
        comments={comments}
        requestedVideoId={requestedVideoId}
        userId={userId}
        video={selectedVideo}
      />
    </LessonLibraryShell>
  );
}
