import type { Chapter, Class, Lesson, Subject } from "@/backend.d";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddChapter,
  useAddClass,
  useAddLesson,
  useAddSubject,
  useAllClasses,
  useChaptersBySubject,
  useDeleteChapter,
  useDeleteClass,
  useDeleteLesson,
  useDeleteSubject,
  useIsAdmin,
  useLessonsByChapter,
  useSubjectsByClass,
  useUpdateChapter,
  useUpdateClass,
  useUpdateLesson,
  useUpdateSubject,
} from "@/hooks/useQueries";
import { Loader2, Lock, Pencil, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function AdminLogin() {
  const { login, loginStatus } = useInternetIdentity();
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      data-ocid="admin.login_prompt.panel"
    >
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
        <Lock className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
        <p className="text-muted-foreground text-sm">
          You need to be logged in as an admin to access this panel.
        </p>
      </div>
      <Button
        onClick={login}
        disabled={loginStatus === "logging-in"}
        className="rounded-full"
        data-ocid="admin.login.button"
      >
        {loginStatus === "logging-in" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </div>
  );
}

// ---- Classes Tab ----
function ClassesTab() {
  const { data: classes, isLoading } = useAllClasses();
  const addMut = useAddClass();
  const updateMut = useUpdateClass();
  const deleteMut = useDeleteClass();
  const [editing, setEditing] = useState<Class | null>(null);
  const [form, setForm] = useState({ name: "", description: "", grade: "1" });
  const [dialogOpen, setDialogOpen] = useState(false);

  function openAdd() {
    setEditing(null);
    setForm({ name: "", description: "", grade: "1" });
    setDialogOpen(true);
  }
  function openEdit(c: Class) {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description,
      grade: c.grade.toString(),
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    const data: Class = {
      id: editing?.id ?? 0n,
      name: form.name,
      description: form.description,
      grade: BigInt(form.grade),
    };
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data });
        toast.success("Class updated");
      } else {
        await addMut.mutateAsync(data);
        toast.success("Class added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save class");
    }
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Class deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Classes</h3>
        <Button
          size="sm"
          className="gap-1.5 rounded-full"
          onClick={openAdd}
          data-ocid="admin.classes.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      </div>
      {isLoading ? (
        <Skeleton
          className="h-48 w-full rounded-xl"
          data-ocid="admin.classes.loading_state"
        />
      ) : (
        <div
          className="rounded-xl border border-border overflow-hidden"
          data-ocid="admin.classes.table"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(classes ?? [])
                .sort((a, b) => Number(a.grade) - Number(b.grade))
                .map((c, i) => (
                  <TableRow
                    key={c.id.toString()}
                    data-ocid={`admin.classes.row.${i + 1}`}
                  >
                    <TableCell className="font-semibold text-primary">
                      Grade {c.grade.toString()}
                    </TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                      {c.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEdit(c)}
                          data-ocid={`admin.classes.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(c.id)}
                          data-ocid={`admin.classes.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="admin.classes.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Class" : "Add Class"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-ocid="admin.classes.name.input"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                data-ocid="admin.classes.description.textarea"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Grade</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                data-ocid="admin.classes.grade.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.classes.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addMut.isPending || updateMut.isPending}
              data-ocid="admin.classes.save_button"
            >
              {addMut.isPending || updateMut.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Subjects Tab ----
function SubjectsTab() {
  const { data: classes } = useAllClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const classIdBig = selectedClassId ? BigInt(selectedClassId) : null;
  const { data: subjects, isLoading } = useSubjectsByClass(classIdBig ?? 0n);
  const addMut = useAddSubject();
  const updateMut = useUpdateSubject();
  const deleteMut = useDeleteSubject();
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "blue",
    iconName: "book",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  function openAdd() {
    setEditing(null);
    setForm({ name: "", description: "", color: "blue", iconName: "book" });
    setDialogOpen(true);
  }
  function openEdit(s: Subject) {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description,
      color: s.color,
      iconName: s.iconName,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!classIdBig) {
      toast.error("Select a class first");
      return;
    }
    const data: Subject = {
      id: editing?.id ?? 0n,
      name: form.name,
      description: form.description,
      color: form.color,
      iconName: form.iconName,
      classId: classIdBig,
    };
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data });
        toast.success("Subject updated");
      } else {
        await addMut.mutateAsync(data);
        toast.success("Subject added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save subject");
    }
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Subject deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Subjects</h3>
        <Button
          size="sm"
          className="gap-1.5 rounded-full"
          onClick={openAdd}
          disabled={!selectedClassId}
          data-ocid="admin.subjects.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
      </div>
      <div className="mb-4">
        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
          <SelectTrigger
            className="w-48"
            data-ocid="admin.subjects.class.select"
          >
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {(classes ?? [])
              .sort((a, b) => Number(a.grade) - Number(b.grade))
              .map((c) => (
                <SelectItem key={c.id.toString()} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      {selectedClassId &&
        (isLoading ? (
          <Skeleton
            className="h-48 w-full rounded-xl"
            data-ocid="admin.subjects.loading_state"
          />
        ) : (
          <div
            className="rounded-xl border border-border overflow-hidden"
            data-ocid="admin.subjects.table"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(subjects ?? []).map((s, i) => (
                  <TableRow
                    key={s.id.toString()}
                    data-ocid={`admin.subjects.row.${i + 1}`}
                  >
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                      {s.description}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-xs">
                        {s.color}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEdit(s)}
                          data-ocid={`admin.subjects.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(s.id)}
                          data-ocid={`admin.subjects.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="admin.subjects.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Subject" : "Add Subject"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-ocid="admin.subjects.name.input"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                data-ocid="admin.subjects.description.textarea"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Color</Label>
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="e.g. blue"
                data-ocid="admin.subjects.color.input"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Icon Name</Label>
              <Input
                value={form.iconName}
                onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                placeholder="e.g. book"
                data-ocid="admin.subjects.icon.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.subjects.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addMut.isPending || updateMut.isPending}
              data-ocid="admin.subjects.save_button"
            >
              {addMut.isPending || updateMut.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Chapters Tab ----
function ChaptersTab() {
  const { data: classes } = useAllClasses();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const { data: subjects } = useSubjectsByClass(
    selectedClassId ? BigInt(selectedClassId) : 0n,
  );
  const { data: chapters, isLoading } = useChaptersBySubject(
    selectedSubjectId ? BigInt(selectedSubjectId) : 0n,
  );
  const addMut = useAddChapter();
  const updateMut = useUpdateChapter();
  const deleteMut = useDeleteChapter();
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    orderIndex: "1",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  function openAdd() {
    setEditing(null);
    setForm({ title: "", description: "", orderIndex: "1" });
    setDialogOpen(true);
  }
  function openEdit(c: Chapter) {
    setEditing(c);
    setForm({
      title: c.title,
      description: c.description,
      orderIndex: c.orderIndex.toString(),
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!selectedSubjectId) {
      toast.error("Select a subject first");
      return;
    }
    const data: Chapter = {
      id: editing?.id ?? 0n,
      title: form.title,
      description: form.description,
      subjectId: BigInt(selectedSubjectId),
      orderIndex: BigInt(form.orderIndex),
    };
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data });
        toast.success("Chapter updated");
      } else {
        await addMut.mutateAsync(data);
        toast.success("Chapter added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save chapter");
    }
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Chapter deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Chapters</h3>
        <Button
          size="sm"
          className="gap-1.5 rounded-full"
          onClick={openAdd}
          disabled={!selectedSubjectId}
          data-ocid="admin.chapters.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Chapter
        </Button>
      </div>
      <div className="flex gap-3 mb-4">
        <Select
          value={selectedClassId}
          onValueChange={(v) => {
            setSelectedClassId(v);
            setSelectedSubjectId("");
          }}
        >
          <SelectTrigger
            className="w-40"
            data-ocid="admin.chapters.class.select"
          >
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            {(classes ?? [])
              .sort((a, b) => Number(a.grade) - Number(b.grade))
              .map((c) => (
                <SelectItem key={c.id.toString()} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedSubjectId}
          onValueChange={setSelectedSubjectId}
          disabled={!selectedClassId}
        >
          <SelectTrigger
            className="w-40"
            data-ocid="admin.chapters.subject.select"
          >
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {(subjects ?? []).map((s) => (
              <SelectItem key={s.id.toString()} value={s.id.toString()}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedSubjectId &&
        (isLoading ? (
          <Skeleton
            className="h-48 w-full rounded-xl"
            data-ocid="admin.chapters.loading_state"
          />
        ) : (
          <div
            className="rounded-xl border border-border overflow-hidden"
            data-ocid="admin.chapters.table"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...(chapters ?? [])]
                  .sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex))
                  .map((ch, i) => (
                    <TableRow
                      key={ch.id.toString()}
                      data-ocid={`admin.chapters.row.${i + 1}`}
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {ch.orderIndex.toString()}
                      </TableCell>
                      <TableCell className="font-medium">{ch.title}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                        {ch.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => openEdit(ch)}
                            data-ocid={`admin.chapters.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(ch.id)}
                            data-ocid={`admin.chapters.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ))}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="admin.chapters.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Chapter" : "Add Chapter"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-ocid="admin.chapters.title.input"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                data-ocid="admin.chapters.description.textarea"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Order</Label>
              <Input
                type="number"
                min="1"
                value={form.orderIndex}
                onChange={(e) =>
                  setForm({ ...form, orderIndex: e.target.value })
                }
                data-ocid="admin.chapters.order.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.chapters.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addMut.isPending || updateMut.isPending}
              data-ocid="admin.chapters.save_button"
            >
              {addMut.isPending || updateMut.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Lessons Tab ----
function LessonsTab() {
  const { data: classes } = useAllClasses();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const { data: subjects } = useSubjectsByClass(
    selectedClassId ? BigInt(selectedClassId) : 0n,
  );
  const { data: chapters } = useChaptersBySubject(
    selectedSubjectId ? BigInt(selectedSubjectId) : 0n,
  );
  const { data: lessons, isLoading } = useLessonsByChapter(
    selectedChapterId ? BigInt(selectedChapterId) : null,
  );
  const addMut = useAddLesson();
  const updateMut = useUpdateLesson();
  const deleteMut = useDeleteLesson();
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [form, setForm] = useState({ title: "", content: "", orderIndex: "1" });
  const [dialogOpen, setDialogOpen] = useState(false);

  function openAdd() {
    setEditing(null);
    setForm({ title: "", content: "", orderIndex: "1" });
    setDialogOpen(true);
  }
  function openEdit(l: Lesson) {
    setEditing(l);
    setForm({
      title: l.title,
      content: l.content,
      orderIndex: l.orderIndex.toString(),
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!selectedChapterId) {
      toast.error("Select a chapter first");
      return;
    }
    const data: Lesson = {
      id: editing?.id ?? 0n,
      title: form.title,
      content: form.content,
      chapterId: BigInt(selectedChapterId),
      orderIndex: BigInt(form.orderIndex),
    };
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data });
        toast.success("Lesson updated");
      } else {
        await addMut.mutateAsync(data);
        toast.success("Lesson added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save lesson");
    }
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Lesson deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Lessons</h3>
        <Button
          size="sm"
          className="gap-1.5 rounded-full"
          onClick={openAdd}
          disabled={!selectedChapterId}
          data-ocid="admin.lessons.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Lesson
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          value={selectedClassId}
          onValueChange={(v) => {
            setSelectedClassId(v);
            setSelectedSubjectId("");
            setSelectedChapterId("");
          }}
        >
          <SelectTrigger
            className="w-36"
            data-ocid="admin.lessons.class.select"
          >
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            {(classes ?? [])
              .sort((a, b) => Number(a.grade) - Number(b.grade))
              .map((c) => (
                <SelectItem key={c.id.toString()} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedSubjectId}
          onValueChange={(v) => {
            setSelectedSubjectId(v);
            setSelectedChapterId("");
          }}
          disabled={!selectedClassId}
        >
          <SelectTrigger
            className="w-36"
            data-ocid="admin.lessons.subject.select"
          >
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {(subjects ?? []).map((s) => (
              <SelectItem key={s.id.toString()} value={s.id.toString()}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedChapterId}
          onValueChange={setSelectedChapterId}
          disabled={!selectedSubjectId}
        >
          <SelectTrigger
            className="w-36"
            data-ocid="admin.lessons.chapter.select"
          >
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>
          <SelectContent>
            {(chapters ?? []).map((ch) => (
              <SelectItem key={ch.id.toString()} value={ch.id.toString()}>
                {ch.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedChapterId &&
        (isLoading ? (
          <Skeleton
            className="h-48 w-full rounded-xl"
            data-ocid="admin.lessons.loading_state"
          />
        ) : (
          <div
            className="rounded-xl border border-border overflow-hidden"
            data-ocid="admin.lessons.table"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Content Preview</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...(lessons ?? [])]
                  .sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex))
                  .map((l, i) => (
                    <TableRow
                      key={l.id.toString()}
                      data-ocid={`admin.lessons.row.${i + 1}`}
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {l.orderIndex.toString()}
                      </TableCell>
                      <TableCell className="font-medium">{l.title}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                        {l.content.slice(0, 80)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => openEdit(l)}
                            data-ocid={`admin.lessons.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(l.id)}
                            data-ocid={`admin.lessons.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ))}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.lessons.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-ocid="admin.lessons.title.input"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Content</Label>
              <Textarea
                className="min-h-32"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                data-ocid="admin.lessons.content.textarea"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Order</Label>
              <Input
                type="number"
                min="1"
                value={form.orderIndex}
                onChange={(e) =>
                  setForm({ ...form, orderIndex: e.target.value })
                }
                data-ocid="admin.lessons.order.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.lessons.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addMut.isPending || updateMut.isPending}
              data-ocid="admin.lessons.save_button"
            >
              {addMut.isPending || updateMut.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();
  const isLoggedIn = !!identity;

  if (!isLoggedIn) return <AdminLogin />;

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="admin.access_denied.panel"
      >
        <ShieldAlert className="w-16 h-16 text-destructive opacity-50" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground text-sm">
          You don&apos;t have admin privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold mb-1">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">
          Manage all classes, subjects, chapters, and lessons.
        </p>

        <Tabs defaultValue="classes">
          <TabsList className="mb-6" data-ocid="admin.tabs">
            <TabsTrigger value="classes" data-ocid="admin.classes.tab">
              Classes
            </TabsTrigger>
            <TabsTrigger value="subjects" data-ocid="admin.subjects.tab">
              Subjects
            </TabsTrigger>
            <TabsTrigger value="chapters" data-ocid="admin.chapters.tab">
              Chapters
            </TabsTrigger>
            <TabsTrigger value="lessons" data-ocid="admin.lessons.tab">
              Lessons
            </TabsTrigger>
          </TabsList>
          <TabsContent value="classes">
            <ClassesTab />
          </TabsContent>
          <TabsContent value="subjects">
            <SubjectsTab />
          </TabsContent>
          <TabsContent value="chapters">
            <ChaptersTab />
          </TabsContent>
          <TabsContent value="lessons">
            <LessonsTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
