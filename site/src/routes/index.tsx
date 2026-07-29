import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";

// Read the (optional) business name at request time so the placeholder can be
// personalized by writing site.json — no rebuild needed.
const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "";
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Life CTRL — Your AI-Powered Personal Chief of Staff" },
      {
        name: "description",
        content:
          "MyCTRL is your AI-powered personal chief of staff — turning life's chaos into clear, prioritized action plans. Organize your paperwork, deadlines, and next steps.",
      },
    ],
  }),
  loader: () => getBusinessName(),
  component: Home,
});

const solutions = [
  {
    to: "/reentry",
    title: "Re-entry",
    headline: "Reduce recidivism with technology.",
    desc: "AI-powered case management for returning citizens, corrections programs, and halfway houses.",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    border: "hover:border-indigo-300 dark:hover:border-indigo-700",
  },
  {
    to: "/recovery",
    title: "Recovery",
    headline: "Improve SUD treatment retention.",
    desc: "Patient engagement and behavioral health case management for addiction treatment programs.",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    border: "hover:border-teal-300 dark:hover:border-teal-700",
  },
  {
    to: "/campus",
    title: "Campus",
    headline: "Reduce administrative attrition.",
    desc: "Student success platform for universities and community colleges to keep students on track.",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    border: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  {
    to: "/care",
    title: "Care",
    headline: "Reduce hospital readmissions.",
    desc: "Healthcare navigation and care coordination tools for patients, caregivers, and providers.",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    border: "hover:border-rose-300 dark:hover:border-rose-700",
  },
];

function Home() {
  const businessName = Route.useLoaderData();
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="flex min-h-[90dvh] flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Coming soon
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          {businessName || "Something new is on the way"}
        </h1>
        <p className="max-w-md text-lg text-gray-600 dark:text-gray-400">
          {businessName
            ? `${businessName} is building something. Check back soon.`
            : "We're building something. Check back soon."}
        </p>
      </section>

      {/* Solutions */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500">
            Institutional Solutions
          </p>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            MyCTRL for organizations
          </h2>
          <p className="mt-4 text-center text-lg text-gray-600 dark:text-gray-400">
            Purpose-built verticals for the populations you serve. Start with a pilot.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {solutions.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className={`group rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ${s.border}`}
              >
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${s.color}`}>
                  {s.title}
                </span>
                <h3 className="mt-4 text-xl font-bold group-hover:underline">
                  {s.headline}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {s.desc}
                </p>
                <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                  Learn more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:text-gray-600">
        <p>&copy; {new Date().getFullYear()} My Life CTRL. All rights reserved.</p>
        <p className="mt-1 text-xs">LifeCTRL LLC</p>
        <p className="mt-1">
          Built with{" "}
          <a
            href="https://cto.new"
            className="underline hover:text-gray-600 dark:hover:text-gray-400"
          >
            cto.new
          </a>
        </p>
      </footer>
    </main>
  );
}
