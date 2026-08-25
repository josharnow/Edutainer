import "server-only";

import { createScopeApiUrl } from "@/lib/scope-api-url";
import type { Video, VideoComment } from "@/types/video";

// Omit the API's "id" property and replace it with the "video_id" property.
type ApiVideo = Omit<Video, "video_id"> & { id: string };
type ApiComment = Omit<VideoComment, "comment_id"> & {
  id?: string;
  comment_id?: string;
};

export function getScopeUserId() {
  const userId = process.env.SCOPE_USER_ID?.trim();

  if (!userId) {
    throw new Error("SCOPE_USER_ID is not configured.");
  }

  return userId;
}

async function getJson<T>(pathname: string, searchParams: URLSearchParams) {
  const response = await fetch(createScopeApiUrl(pathname, searchParams), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Scope API request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

async function getCollection<T>(
  pathname: string,
  searchParams: URLSearchParams,
  collectionName: string,
) {
  const payload = await getJson<unknown>(pathname, searchParams);

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  const collection =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)[collectionName]
      : undefined;

  return Array.isArray(collection) ? (collection as T[]) : [];
}

export async function listVideos(userId: string): Promise<Video[]> {
  const videos = await getCollection<ApiVideo>(
    "videos",
    new URLSearchParams({ user_id: userId }),
    "videos",
  );

  return videos.map(
    ({ id, created_at, description, title, user_id, video_url }) => ({
      video_id: id,
      created_at,
      description,
      title,
      user_id,
      video_url,
    }),
  );
}

export async function getComments(videoId: string): Promise<VideoComment[]> {
  const comments = await getCollection<ApiComment>(
    "videos/comments",
    new URLSearchParams({ video_id: videoId }),
    "comments",
  );

  return comments.map(
    ({ id, comment_id, content, created_at, user_id, video_id }) => ({
      comment_id: comment_id ?? id ?? `${video_id}-${created_at}`,
      content,
      created_at,
      user_id,
      video_id,
    }),
  );
}
