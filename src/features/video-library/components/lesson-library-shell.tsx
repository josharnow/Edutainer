"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadVideoDialog } from "@/features/video-library/components/upload-video-dialog";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";

type LessonSummary = Pick<
  Video,
  "video_id" | "title" | "description"
>;

type LessonLibraryShellProps = PropsWithChildren<{
  lessons: LessonSummary[];
  selectedVideoId?: string;
  userId: string;
}>;

/** Coordinates the responsive library navigation around server-rendered content. */
function LessonLibraryShell({
  children,
  lessons,
  selectedVideoId,
  userId,
}: LessonLibraryShellProps) {
  // Desktop collapse and mobile drawer visibility are independent UI states.
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearch = searchQuery.trim().toLowerCase();

  // Map first so lesson numbers remain stable while filtering.
  const visibleLessons = lessons
    .map((lesson, index) => ({ lesson, lessonNumber: index + 1 }))
    .filter(({ lesson }) => {
      if (!normalizedSearch) {
        return true;
      }

      return [lesson.title, lesson.description].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });

  return (
    <>
      <AppHeader>
        <UploadVideoDialog userId={userId} />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open lesson library"
          aria-controls="lesson-library-sidebar"
          aria-expanded={isMobileOpen}
          title="Lesson library"
          onClick={() => setIsMobileOpen(true)}
        >
          <Image
            src="/icons/lesson-library.svg"
            alt=""
            width={20}
            height={20}
          />
        </Button>
      </AppHeader>

      <div className="relative flex min-h-[calc(100svh-5.25rem)] flex-1">
        {isMobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-foreground/35 lg:hidden"
            aria-label="Close lesson library"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <aside
          id="lesson-library-sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-4/5 max-w-80 -translate-x-full flex-col border-r border-border bg-card shadow-xl transition-all duration-300 ease-in-out",
            "lg:sticky lg:top-21 lg:bottom-auto lg:z-auto lg:h-[calc(100svh-5.25rem)] lg:self-start lg:translate-x-0 lg:shadow-none",
            isMobileOpen && "translate-x-0",
            isCollapsed ? "lg:w-20" : "lg:w-80",
          )}
          aria-label="Lesson library"
        >
          <div className="flex h-18 shrink-0 items-center justify-between border-b border-border px-4">
            <h2
              className={cn(
                "truncate text-lg font-bold",
                isCollapsed && "lg:hidden",
              )}
            >
              Lesson Library
            </h2>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn("hidden lg:grid cursor-pointer", isCollapsed && "text-primary")}
              aria-controls="lesson-library-list"
              aria-expanded={!isCollapsed}
              title={
                isCollapsed
                  ? "Expand lesson library"
                  : "Collapse lesson library"
              }
              onClick={() => setIsCollapsed((current) => !current)}
            >
              {isCollapsed ? (
                <Image
                  src="/icons/lesson-library.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              ) : (
                <Image
                  src="/icons/collapse.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              )}
              <span className="sr-only">
                {isCollapsed
                  ? "Expand lesson library"
                  : "Collapse lesson library"}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Close lesson library"
              onClick={() => setIsMobileOpen(false)}
            >
              <Image
                src="/icons/close.svg"
                alt=""
                width={20}
                height={20}
              />
            </Button>
          </div>

          <div
            className={cn(
              "border-b border-border p-3",
              isCollapsed && "lg:hidden",
            )}
            role="search"
          >
            <label className="sr-only" htmlFor="lesson-search">
              Search videos
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-muted-foreground"
              >
                <Image
                  src="/icons/search.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
              <Input
                id="lesson-search"
                type="search"
                value={searchQuery}
                className="appearance-none pl-10"
                placeholder="Search videos"
                aria-controls="lesson-library-list"
                aria-describedby="lesson-search-results"
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
              />
            </div>
          </div>

          <nav
            id="lesson-library-list"
            className="min-h-0 flex-1 overflow-y-auto p-3"
            aria-label="Lessons"
          >
            {visibleLessons.length > 0 ? (
              <ul className="space-y-2">
                {visibleLessons.map(({ lesson, lessonNumber }) => {
                  const isSelected = lesson.video_id === selectedVideoId;

                  return (
                    <li key={lesson.video_id}>
                      <Link
                        href={{
                          pathname: "/library",
                          query: { video: lesson.video_id },
                        }}
                        className={cn(
                          "group relative flex min-h-16 items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          isSelected
                            ? "border-primary/25 bg-accent text-accent-foreground"
                            : "border-transparent hover:bg-secondary",
                          isCollapsed && "lg:justify-center lg:px-2",
                        )}
                        aria-current={isSelected ? "page" : undefined}
                        aria-label={`${lesson.title}. ${lesson.description}`}
                        title={
                          isCollapsed
                            ? `${lesson.title}: ${lesson.description}`
                            : undefined
                        }
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-bold text-secondary-foreground",
                            isSelected && "bg-primary text-primary-foreground",
                          )}
                          aria-hidden="true"
                        >
                          {lessonNumber}
                        </span>
                        <span
                          className={cn(
                            "min-w-0",
                            isCollapsed && "lg:hidden",
                          )}
                        >
                          <span className="block truncate text-sm font-semibold">
                            {lesson.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {lesson.description}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "pointer-events-none absolute inset-x-2 top-full -mt-1 z-30 rounded-lg border border-border bg-foreground p-3 text-left text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                            isCollapsed && "lg:hidden",
                          )}
                          aria-hidden="true"
                        >
                          <span className="block text-sm font-semibold">
                            {lesson.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-background/80">
                            {lesson.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p
                className={cn(
                  "p-3 text-sm text-muted-foreground",
                  isCollapsed && "lg:hidden",
                )}
              >
                {lessons.length === 0
                  ? "Your lesson library is empty."
                  : `No videos match “${searchQuery.trim()}”.`}
              </p>
            )}
          </nav>

          <div
            id="lesson-search-results"
            className={cn(
              "border-t border-border p-4 text-xs text-muted-foreground",
              isCollapsed && "lg:hidden",
            )}
          >
            {normalizedSearch
              ? `${visibleLessons.length} of ${lessons.length} lessons`
              : `${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}`}
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}

export { LessonLibraryShell };
