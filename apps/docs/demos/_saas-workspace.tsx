"use client";
import { useState } from "react";
import {
  DashboardPanel,
  DashboardGrid,
  DashboardToolbar,
  MetricSummary,
  WorkBoard,
  ScheduleCalendar,
  ScheduleView,
  TaskTimeline,
  Conversation,
  RecordEditor,
  InvoiceComposer,
  AuthPanel,
  type InvoiceLine,
  type RecordField,
} from "@ux-sting/react/saas-dashboard";
import { DataTable } from "@ux-sting/react/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from "@ux-sting/react/dialog";
import { Button } from "@ux-sting/react/button";
import { LineChart, PieChart } from "@ux-sting/react/chart";

export const screenNames = [
  "Dashboard Navigation",
  "Dashboard",
  "Invoice List",
  "Invoice List-Dropdown",
  "Schedule List",
  "Board List",
  "Customer List",
  "Add Customer",
  "Create event",
  "Product",
  "Add Product",
  "Create Invoice",
  "Calendar Month",
  "Task view",
  "Calendar year",
  "Task preview timeline",
  "Calendar day",
  "Sign Up",
  "Login",
  "Recover",
  "Confirm",
  "Chat",
] as const;
type Screen = (typeof screenNames)[number];
interface ExampleRecord {
  id: string;
  name: string;
  email: string;
  status: string;
  amount: number;
}
const initialRecords: ExampleRecord[] = [
  {
    id: "example-1",
    name: "Alex Example",
    email: "alex@example.invalid",
    status: "Paid",
    amount: 120,
  },
  {
    id: "example-2",
    name: "Morgan Example",
    email: "morgan@example.invalid",
    status: "Pending",
    amount: 80,
  },
];
const fieldNames: Record<string, RecordField[]> = {
  customer: [
    { key: "name", label: "Customer name", required: true },
    { key: "email", label: "Email", type: "email", required: true },
  ],
  product: [
    { key: "name", label: "Product name", required: true },
    { key: "amount", label: "Price", type: "number", min: 0, step: 0.01, required: true },
  ],
  event: [
    { key: "name", label: "Event title", required: true },
    { key: "start", label: "Starts", type: "datetime-local", required: true },
    { key: "end", label: "Ends", type: "datetime-local", required: true },
  ],
};
/** All 22 publicly visible screen compositions. Fixtures are explicitly separate from live analytics. */
export function Workspace() {
  const [screen, setScreen] = useState<Screen>("Dashboard");
  const [records, setRecords] = useState(initialRecords);
  const [editor, setEditor] = useState<"customer" | "product" | "event" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [date, setDate] = useState(new Date(2026, 10, 5));
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([
    { id: "task-1", column: "todo", title: "Review portfolio report", description: "Example task" },
    { id: "task-2", column: "doing", title: "Prepare content plan", description: "Example task" },
  ]);
  const [events, setEvents] = useState([
    {
      id: "event-1",
      title: "Editorial review",
      start: "2026-11-05T14:00:00",
      end: "2026-11-05T15:00:00",
      detail: "Example event",
    },
  ]);
  const [messages, setMessages] = useState([
    {
      id: "hello",
      author: "Alex",
      body: "Welcome to this fictional workspace.",
      sentAt: "2026-11-05T10:00:00Z",
      own: false,
    },
  ]);
  const [lines, setLines] = useState<InvoiceLine[]>([
    { id: "line-1", description: "Example service", quantity: 1, unitPrice: 120 },
  ]);
  const [auth, setAuth] = useState<Record<string, string>>({});
  const open = (kind: "customer" | "product" | "event", record?: ExampleRecord) => {
    setEditor(kind);
    setEditId(record?.id ?? null);
    setForm(
      record ? { name: record.name, email: record.email, amount: String(record.amount) } : {},
    );
  };
  const save = () => {
    if (editor === "event") {
      if (Date.parse(form.end || "") < Date.parse(form.start || ""))
        throw new Error("End precedes start");
      setEvents((old) => [
        ...old,
        {
          id: `event-${Date.now()}`,
          title: form.name || "",
          start: form.start || "",
          end: form.end || "",
          detail: "Example event",
        },
      ]);
    } else {
      const record = {
        id: editId || `example-${Date.now()}`,
        name: form.name || "",
        email: form.email || "",
        status: "Pending",
        amount: Number(form.amount || 0),
      };
      setRecords((old) =>
        editId ? old.map((row) => (row.id === editId ? record : row)) : [...old, record],
      );
    }
    setEditor(null);
    setNotice("Saved to this example workspace.");
  };
  const exportRows = () => {
    const csv = [
      "Name,Email,Status,Amount",
      ...records.map((row) =>
        [row.name, row.email, row.status, String(row.amount)]
          .map((value) => '"' + value.replaceAll('"', '""') + '"')
          .join(","),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "fictional-workspace.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const table = (kind: "invoice" | "customer" | "product" | "task" = "invoice") => (
    <DataTable
      label={`${kind} examples`}
      data={records.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))}
      getRowId={(row) => row.id}
      pageSize={5}
      columns={[
        { id: "name", header: kind === "product" ? "Product" : "Name", sortable: true },
        { id: "email", header: "Email", sortable: true },
        { id: "status", header: "Status", sortable: true },
        {
          id: "amount",
          header: "Amount",
          align: "end",
          sortable: true,
          cell: (row) =>
            new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(row.amount),
        },
        {
          id: "actions",
          header: "Manage",
          cell: (row) => (
            <div className="flex flex-wrap gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => open(kind === "product" ? "product" : "customer", row)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setRecords((old) => old.filter((item) => item.id !== row.id));
                  setNotice("Removed from the example.");
                }}
              >
                Remove
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
  const editorForm = (kind: "customer" | "product" | "event") => (
    <RecordEditor
      label={`Example ${kind} editor`}
      fields={fieldNames[kind] || []}
      values={form}
      onChange={(key, value) => setForm((old) => ({ ...old, [key]: value }))}
      onSave={save}
      errorLabel="Check that the event end follows its start, then try again."
    />
  );
  let content;
  if (screen === "Dashboard" || screen === "Dashboard Navigation" || screen === "Product")
    content = (
      <div className="grid gap-4">
        <DashboardGrid layout="metrics">
          <MetricSummary label="Example visitors" value="120" detail="Fictional data" />
          <MetricSummary label="Example clicks" value="42" detail="Fictional data" />
          <MetricSummary label="Example records" value={records.length} />
          <MetricSummary label="Example tasks" value={tasks.length} />
        </DashboardGrid>
        <DashboardGrid layout="wide-main">
          <DashboardPanel title="Example activity">
            <LineChart
              label="Fictional activity"
              data={[
                { day: "Mon", visits: 20 },
                { day: "Tue", visits: 35 },
                { day: "Wed", visits: 65 },
              ]}
              index="day"
              series={[{ key: "visits", label: "Visits" }]}
              area
            />
          </DashboardPanel>
          <DashboardPanel title="Example devices">
            <PieChart
              label="Fictional devices"
              data={[
                { name: "Desktop", value: 70 },
                { name: "Mobile", value: 30 },
              ]}
              innerRadius={0.65}
            />
          </DashboardPanel>
        </DashboardGrid>
        {screen === "Product" && <Button onClick={() => open("product")}>Add product</Button>}
        {table(screen === "Product" ? "product" : "invoice")}
      </div>
    );
  else if (screen === "Board List")
    content = (
      <WorkBoard
        label="Example board"
        columns={[
          { id: "todo", label: "To do" },
          { id: "doing", label: "In progress" },
          { id: "review", label: "Review" },
          { id: "done", label: "Done" },
        ]}
        items={tasks}
        onMove={(id, column) =>
          setTasks((old) => old.map((item) => (item.id === id ? { ...item, column } : item)))
        }
        onOpen={(item) => setNotice(item.description || item.title)}
      />
    );
  else if (screen === "Chat")
    content = (
      <Conversation
        label="Example messages"
        messages={messages}
        onSend={(body) =>
          setMessages((old) => [
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
  else if (screen.startsWith("Calendar"))
    content = (
      <ScheduleCalendar
        label="Example calendar"
        date={date}
        onDateChange={setDate}
        view={screen === "Calendar year" ? "year" : screen === "Calendar day" ? "day" : "month"}
        items={events}
        onOpen={(event) => setNotice(event.title)}
      />
    );
  else if (screen === "Schedule List")
    content = (
      <ScheduleView
        label="Example schedule"
        items={events}
        onOpen={(event) => setNotice(event.title)}
      />
    );
  else if (screen === "Task preview timeline")
    content = (
      <TaskTimeline
        label="Example timeline"
        start="2026-11-01"
        end="2026-11-30"
        tasks={tasks.map((task, i) => ({
          id: task.id,
          title: task.title,
          start: `2026-11-${String(3 + i * 5).padStart(2, "0")}`,
          end: `2026-11-${String(8 + i * 5).padStart(2, "0")}`,
        }))}
        onOpen={(task) => setNotice(task.title)}
      />
    );
  else if (screen === "Task view")
    content = (
      <DataTable
        label="Example tasks"
        data={tasks}
        getRowId={(task) => task.id}
        columns={[
          { id: "title", header: "Task", sortable: true },
          {
            id: "column",
            header: "Stage",
            cell: (task) => (
              <select
                aria-label={`Stage for ${task.title}`}
                value={task.column}
                onChange={(e) =>
                  setTasks((old) =>
                    old.map((item) =>
                      item.id === task.id ? { ...item, column: e.target.value } : item,
                    ),
                  )
                }
                className="min-h-11 rounded border border-input bg-background px-2"
              >
                <option value="todo">To do</option>
                <option value="doing">In progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            ),
          },
        ]}
      />
    );
  else if (screen === "Create Invoice")
    content = (
      <div className="grid gap-4">
        <InvoiceComposer
          label="Example invoice"
          items={lines}
          onChange={setLines}
          currency="USD"
          taxRate={0.2}
        />
        <Button
          onClick={() => {
            setRecords((old) => [
              ...old,
              {
                id: String(Date.now()),
                name: "Example invoice",
                email: "",
                status: "Draft",
                amount: lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0) * 1.2,
              },
            ]);
            setScreen("Invoice List");
            setNotice("Example invoice created.");
          }}
        >
          Create example invoice
        </Button>
      </div>
    );
  else if (screen === "Add Customer" || screen === "Add Product" || screen === "Create event") {
    const kind =
      screen === "Add Customer" ? "customer" : screen === "Add Product" ? "product" : "event";
    content = (
      <div className="grid gap-4">
        {table(kind === "product" ? "product" : "customer")}
        <Button onClick={() => open(kind)}>Open {kind} editor</Button>
      </div>
    );
  } else if (["Sign Up", "Login", "Recover", "Confirm"].includes(screen))
    content = (
      <AuthPanel
        title={screen}
        description="UI example only. This does not authenticate an account."
        aside={
          screen === "Login" || screen === "Sign Up" ? (
            <p className="text-xl font-semibold">Your workspace, together.</p>
          ) : undefined
        }
      >
        {screen === "Confirm" ? (
          <>
            <p role="status">Example request completed.</p>
            <Button onClick={() => setScreen("Login")}>Return to login</Button>
          </>
        ) : (
          <RecordEditor
            label={`Example ${screen}`}
            fields={
              [
                ...(screen === "Sign Up" ? [{ key: "name", label: "Name", required: true }] : []),
                { key: "email", label: "Email", type: "email", required: true },
                ...(screen !== "Recover"
                  ? [{ key: "password", label: "Password", type: "password", required: true }]
                  : []),
              ] as RecordField[]
            }
            values={auth}
            onChange={(key, value) => setAuth((old) => ({ ...old, [key]: value }))}
            onSave={() => {
              setAuth({});
              setScreen("Confirm");
            }}
            saveLabel={screen}
          />
        )}
      </AuthPanel>
    );
  else content = table(screen === "Customer List" ? "customer" : "invoice");
  return (
    <div className="grid min-w-0 gap-4">
      <p className="rounded-lg border border-border bg-muted p-3 text-sm">
        Interactive component examples with fictional records. These values are not connected
        analytics. Changes last for this page session.
      </p>
      <DashboardToolbar
        label="Example workspace controls"
        summary={notice || "Choose any of the 22 public-reference screen compositions."}
      >
        <label className="grid min-w-0 gap-1 text-xs">
          Screen
          <select
            aria-label="Example screen"
            value={screen}
            onChange={(e) => {
              setScreen(e.target.value as Screen);
              setNotice("");
            }}
            className="min-h-11 max-w-full rounded border border-input bg-background px-2 text-base"
          >
            {screenNames.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs">
          Search
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-11 min-w-0 rounded border border-input bg-background px-3 text-base"
          />
        </label>
        <Button variant="outline" onClick={exportRows}>
          Export example CSV
        </Button>
        <Button
          onClick={() =>
            open(
              screen.includes("Product") || screen === "Product"
                ? "product"
                : screen.includes("Calendar") || screen.includes("event")
                  ? "event"
                  : "customer",
            )
          }
        >
          Add record
        </Button>
      </DashboardToolbar>
      <DashboardPanel
        title={screen}
        actions={
          screen === "Invoice List-Dropdown" ? (
            <label className="text-sm">
              Invoice actions
              <select
                aria-label="Invoice actions"
                defaultValue=""
                className="ms-2 min-h-11 rounded border border-input bg-background px-2"
                onChange={(e) => {
                  if (e.target.value === "create") setScreen("Create Invoice");
                  if (e.target.value === "export") exportRows();
                  e.target.value = "";
                }}
              >
                <option value="">Choose action</option>
                <option value="create">Create invoice</option>
                <option value="export">Export CSV</option>
              </select>
            </label>
          ) : undefined
        }
      >
        {content}
      </DashboardPanel>
      <Dialog
        open={!!editor}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editor ? `Add or edit ${editor}` : "Record editor"}</DialogTitle>
            <DialogDescription>Changes apply to this fictional example only.</DialogDescription>
          </DialogHeader>
          <DialogBody>{editor && editorForm(editor)}</DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
