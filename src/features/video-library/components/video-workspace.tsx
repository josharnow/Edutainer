import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { CommentComposer } from "@/features/comments/components/comment-composer";
import { VideoPlayer } from "@/features/player/components/video-player";
import type { Video, VideoComment } from "@/types/video";

type VideoWorkspaceProps = {
  comments: VideoComment[];
  requestedVideoId?: string;
  userId: string;
  video: Video | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

/** Renders the selected lesson, its metadata, and its discussion state. */
function VideoWorkspace({
  comments,
  requestedVideoId,
  userId,
  video,
}: VideoWorkspaceProps) {
  if (!video) {
    return (
      <section className="grid min-h-[calc(100svh-5.25rem)] place-items-center p-6 text-center">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {requestedVideoId ? "Lesson unavailable" : "Welcome to Edutainer"}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {requestedVideoId
              ? "That lesson could not be found"
              : "Choose a lesson and start learning"}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {requestedVideoId
              ? "Select another lesson from your library to continue."
              : "Open your lesson library to watch a video, review its details, and join the discussion."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Card className="gap-0 overflow-hidden p-0">
        {/* Use the key to remount the player when lessons change so old playback stops. */}
        <VideoPlayer
          key={video.video_id}
          src={video.video_url}
          title={video.title}
        />
        <CardContent className="space-y-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {video.title}
            </h1>
            <time
              className="text-sm text-muted-foreground"
              dateTime={video.created_at}
            >
              Added {dateFormatter.format(new Date(video.created_at))}
            </time>
          </div>
          <p className="max-w-3xl leading-7 text-muted-foreground">
            {video.description}
          </p>
        </CardContent>
      </Card>

      <section aria-labelledby="comments-heading">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <h2 id="comments-heading" className="text-xl font-bold">
              Discussion
            </h2>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          </CardHeader>

          <CardContent className="space-y-6">
            <CommentComposer userId={userId} videoId={video.video_id} />

            {comments.length > 0 ? (
              <ul className="divide-y divide-border border-t border-border">
                {comments.map((comment) => (
                  <li key={comment.comment_id} className="space-y-2 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{comment.user_id}</p>
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={comment.created_at}
                      >
                        {dateFormatter.format(new Date(comment.created_at))}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {comment.content}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="border-t border-border pt-5 text-sm text-muted-foreground">
                No comments yet. Start the discussion with a question or
                takeaway.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export { VideoWorkspace };

