import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  Link,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "My Life CTRL — AI-Powered Personal Chief of Staff" },
      {
        name: "description",
        content:
          "MyCTRL is your AI-powered personal chief of staff — turning life's chaos into clear, prioritized action plans. Organize your paperwork, deadlines, and next steps.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Nav />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Nav() {
  const links = [
    { to: "/reentry", label: "Re-entry" },
    { to: "/recovery", label: "Recovery" },
    { to: "/campus", label: "Campus" },
    { to: "/care", label: "Care" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          to="/"
          className="flex items-center gap-1.5"
        >
          {/* Keyboard icon */}
          <svg className="h-5 w-5 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
            <line x1="6" y1="8" x2="6.01" y2="8"/>
            <line x1="10" y1="8" x2="10.01" y2="8"/>
            <line x1="14" y1="8" x2="14.01" y2="8"/>
            <line x1="18" y1="8" x2="18.01" y2="8"/>
            <line x1="8" y1="12" x2="8.01" y2="12"/>
            <line x1="12" y1="12" x2="12.01" y2="12"/>
            <line x1="16" y1="12" x2="16.01" y2="12"/>
            <line x1="6" y1="16" x2="6.01" y2="16"/>
            <line x1="10" y1="16" x2="10.01" y2="16"/>
            <line x1="14" y1="16" x2="14.01" y2="16"/>
          </svg>
          {/* Stacked MY / CTRL */}
          <span className="flex flex-col leading-none">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">MY</span>
            <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">CTRL</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
