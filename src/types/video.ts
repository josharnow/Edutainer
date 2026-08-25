/** A video lesson returned by the video API. */
export type Video = {
  video_id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  created_at: string;
};

/** A comment associated with one video lesson. */
export type VideoComment = {
  comment_id: string;
  video_id: string;
  user_id: string;
  content: string;
  created_at: string;
};
