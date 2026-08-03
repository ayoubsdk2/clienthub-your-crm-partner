import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCrm } from "@/lib/crm-store";
import { formatDate, repById, reps, type Task, type TaskPriority, type TaskStatus } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — ClientHub CRM" },
      { name: "description", content: "Create, assign and track sales tasks with owners, due dates and priorities." },
      { property: "og:title", content: "Tasks — ClientHub CRM" },
      { property: "og:description", content: "Create, assign and track sales tasks with owners and due dates." },
      { property: "og:url", content: "/app/tasks" },
    ],
    links: [{ rel: "canonical", href: "/app/tasks" }],
  }),
  component: TasksPage,
});

const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-destructive/12 text-destructive",
  medium: "bg-warning/15 text-warning",
  low: "bg-muted text-muted-foreground",
};

const emptyDraft = {
  title: "",
  related: "",
  assigneeId: "r1",
  dueDate: new Date().toISOString().slice(0, 10),
  status: "todo" as TaskStatus,
  priority: "medium" as TaskPriority,
};

function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useCrm();
  const [tab, setTab] = useState<"all" | TaskStatus>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const visible = tasks.filter((t) => tab === "all" || t.status === tab);

  const openNew = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const openEdit = (t: Task) => {
    setEditing(t);
    const { id: _id, ...rest } = t;
    setDraft(rest);
    setOpen(true);
  };

  const save = () => {
    if (!draft.title.trim()) {
      toast.error("Give the task a title");
      return;
    }
    if (editing) {
      updateTask(editing.id, draft);
      toast.success("Task updated");
    } else {
      addTask(draft);
      toast.success("Task created");
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description={`${tasks.filter((t) => t.status !== "done").length} open · ${tasks.filter((t) => t.status === "done").length} completed`}
        actions={
          <Button size="sm" onClick={openNew}>
            <Plus className="mr-1.5 h-4 w-4" /> New task
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">To do</TabsTrigger>
          <TabsTrigger value="in_progress">In progress</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
      </Tabs>

      {visible.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-5 w-5" />}
          title="Nothing here yet"
          description="No tasks in this view. Create one to keep the team moving."
          action={<Button onClick={openNew}>Create task</Button>}
        />
      ) : (
        <ul className="space-y-2.5">
          {visible.map((t) => {
            const overdue = t.status !== "done" && new Date(t.dueDate) < new Date("2026-08-03");
            return (
              <li key={t.id} className="card-surface flex flex-wrap items-center gap-3 p-4">
                <Checkbox
                  checked={t.status === "done"}
                  onCheckedChange={(v) => updateTask(t.id, { status: v ? "done" : "todo" })}
                  aria-label={`Mark ${t.title} complete`}
                />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${t.status === "done" ? "text-muted-foreground line-through" : ""}`}>
                    {t.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{t.related}</p>
                </div>
                <span className={`shrink-0 rounded-md px-2 py-1 text-[0.7rem] font-semibold ${priorityStyles[t.priority]}`}>
                  {t.priority}
                </span>
                <Badge variant="outline" className="shrink-0 gap-1">
                  <CalendarClock className={`h-3 w-3 ${overdue ? "text-destructive" : ""}`} />
                  <span className={overdue ? "text-destructive" : ""}>{formatDate(t.dueDate)}</span>
                </Badge>
                <span className="hidden shrink-0 items-center gap-2 sm:flex">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-[0.6rem] font-bold">
                    {repById(t.assigneeId)?.initials}
                  </span>
                  <span className="hidden text-xs text-muted-foreground md:inline">{repById(t.assigneeId)?.name}</span>
                </span>
                <div className="ml-auto flex shrink-0 gap-1 sm:ml-0">
                  <Button variant="ghost" size="icon" aria-label="Edit task" onClick={() => openEdit(t)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete task"
                    onClick={() => {
                      deleteTask(t.id);
                      toast.success("Task deleted");
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit task" : "Create task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input id="task-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Send revised proposal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-related">Related account</Label>
              <Input id="task-related" value={draft.related} onChange={(e) => setDraft({ ...draft, related: e.target.value })} placeholder="Orbital Systems" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={draft.assigneeId} onValueChange={(v) => setDraft({ ...draft, assigneeId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {reps.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due">Due date</Label>
                <Input id="task-due" type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as TaskStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To do</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v as TaskPriority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save changes" : "Create task"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
