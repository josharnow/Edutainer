import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AppHeader } from "@/components/layout/app-header";
import { buttonStyles } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Edutainer | A Modern Educational Video Library",
  description:
    "Build a searchable video lesson library, learn at your own pace, and discuss every lesson.",
};

const features = [
  {
    number: "01",
    title: "Build your lesson library",
    description:
      "Add video links from other platforms to keep every lesson organized in one searchable place.",
  },
  {
    number: "02",
    title: "Learn at your pace",
    description:
      "Adjust volume, playback speed, and fullscreen viewing to match your learning style.",
  },
  {
    number: "03",
    title: "Discuss new ideas",
    description:
      "Capture questions and share takeaways with your peers.",
  },
];

/** Introduces Edutainer and directs visitors into the lesson library. */
export default function LandingPage() {
  return (
    <>
      <AppHeader>
        <Link
          href="/library"
          className={buttonStyles()}
        >
          Open library
        </Link>
      </AppHeader>

      <main>
        <section className="relative isolate overflow-hidden border-b border-border">
          <div
            className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-128 -translate-x-1/2 rounded-full bg-accent/80 blur-3xl"
          />
          <div className="mx-auto grid min-h-[calc(100svh-5.25rem)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-24">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-primary/20 bg-card px-3 py-1 text-sm font-semibold text-primary shadow-sm">
                Say goodbye to distractions!
              </p>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Give every lesson your full attention.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Edutainer brings your video lessons, playback tools, and
                discussion into one focused learning space.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/library"
                  className={buttonStyles({ size: "lg" })}
                >
                  Start learning
                </Link>
                <Link
                  href="#features"
                  className={buttonStyles({
                    variant: "outline",
                    size: "lg",
                    className: "bg-card",
                  })}
                >
                  See how it works
                </Link>
              </div>
            </div>

            <Card className="rounded-2xl p-3 shadow-xl sm:p-4">
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-primary" />
                    <span className="text-sm font-bold">Lesson workspace</span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3">
                  <div className="hidden space-y-2 border-r border-border bg-card p-3 sm:block">
                    {[0, 1, 2].map((item) => (
                      <div
                        key={item}
                        className={
                          item === 0
                            ? "h-12 rounded-lg bg-accent"
                            : "h-12 rounded-lg bg-secondary"
                        }
                      />
                    ))}
                  </div>
                  <div className="p-4 sm:col-span-2">
                    <div className="grid aspect-video place-items-center rounded-lg bg-foreground">
                      <span className="grid size-14 place-items-center rounded-full bg-background text-primary shadow-lg">
                        <Image
                          src="/icons/play.svg"
                          alt=""
                          width={24}
                          height={24}
                        />
                      </span>
                    </div>
                    <div className="mt-4 h-4 w-2/3 rounded-full bg-secondary" />
                    <div className="mt-2 h-3 w-full rounded-full bg-muted" />
                    <div className="mt-2 h-3 w-4/5 rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-24"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Designed for concentration
              </p>
              <h2
                id="features-heading"
                className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Everything you need to move from watching to learning on all your devices.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.number}>
                  <Card className="h-full">
                    <CardHeader>
                      <span className="text-sm font-bold text-primary">
                        {feature.number}
                      </span>
                      <CardTitle className="mt-4">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/60 px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Your next lesson is ready
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Open your library and start your learning journey today.
              </h2>
            </div>
            <Link
              href="/library"
              className={buttonStyles({ size: "lg" })}
            >
              Explore lessons
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 text-center text-sm text-muted-foreground">
        © 2026 Edutainer
      </footer>
    </>
  );
}
