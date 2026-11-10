"use client";
import { Workspace as WorkspaceExample } from "./_saas-workspace";
import { useState } from "react";
import {
  DashboardGrid,
  DashboardPanel,
  DashboardToolbar,
  MetricSummary,
  WorkBoard,
  Conversation,
  ScheduleView,
  AuthPanel,
} from "@ux-sting/react/saas-dashboard";
import { Button } from "@ux-sting/react/button";
/** Explicit fictional data: component documentation, never application analytics. */
export function Overview() {
  return (
    <div className="grid gap-4">
      <DashboardToolbar label="Example filters" summary="Fictional demonstration data">
        <label className="flex items-center gap-2 text-sm">
          Period
          <select className="min-h-11 rounded border border-input bg-background px-2">
            <option>Last 28 days</option>
            <option>Last 7 days</option>
          </select>
        </label>
        <Button variant="outline">Export</Button>
      </DashboardToolbar>
      <DashboardGrid layout="metrics">
        <MetricSummary label="Visitors" value="14.2K" change="+12%" detail="Illustrative example" />
        <MetricSummary label="Clicks" value="3.4K" change="+8%" detail="Illustrative example" />
      </DashboardGrid>
      <DashboardPanel title="Analytics" description="Bring your own data source">
        Composable content and accessible controls.
      </DashboardPanel>
    </div>
  );
}
export function Board() {
  const [items, set] = useState([
    { id: "audit", column: "todo", title: "Review site analytics" },
    { id: "content", column: "doing", title: "Write a landing page" },
  ]);
  return (
    <WorkBoard
      label="Example work board"
      columns={[
        { id: "todo", label: "To do" },
        { id: "doing", label: "In progress" },
        { id: "review", label: "Review" },
        { id: "done", label: "Done" },
      ]}
      items={items}
      onMove={(id, column) =>
        set((old) => old.map((item) => (item.id === id ? { ...item, column } : item)))
      }
    />
  );
}
export function Chat() {
  const [messages, set] = useState([
    {
      id: "intro",
      author: "Alex",
      body: "Welcome to the example conversation.",
      sentAt: "2026-11-05T10:00:00Z",
      own: false,
    },
  ]);
  return (
    <Conversation
      label="Example conversation"
      messages={messages}
      onSend={(body) =>
        set((old) => [
          ...old,
          {
            id: String(Date.now()),
            author: "You",
            body,
            sentAt: new Date().toISOString(),
            own: true,
          },
        ])
      }
    />
  );
}
export function Agenda() {
  return (
    <ScheduleView
      label="Example agenda"
      items={[
        {
          id: "one",
          title: "Editorial review",
          start: "2026-11-05T14:00:00Z",
          end: "2026-11-05T14:30:00Z",
          detail: "Fictional example event",
        },
      ]}
    />
  );
}
export function Authentication() {
  return (
    <AuthPanel
      title="Sign in"
      description="Composition example; connect your authentication provider."
      footer="Made with UX-STING"
    >
      <form onSubmit={(e) => e.preventDefault()} className="grid gap-3">
        <label>
          Email
          <input
            type="email"
            required
            className="block min-h-11 w-full rounded border border-input bg-background px-3"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            className="block min-h-11 w-full rounded border border-input bg-background px-3"
          />
        </label>
        <Button type="submit">Sign in</Button>
      </form>
    </AuthPanel>
  );
}

export function Workspace() {
  return <WorkspaceExample />;
}
