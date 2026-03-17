import type { Chapter, Class, Lesson, Subject, UserRole } from "@/backend.d";
import { useActor } from "@/hooks/useActor";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllClasses() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubjectsByClass(classId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["subjects", classId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubjectsByClass(classId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useChaptersBySubject(subjectId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["chapters", subjectId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChaptersBySubject(subjectId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLessonsByChapter(chapterId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["lessons", chapterId?.toString()],
    queryFn: async () => {
      if (!actor || !chapterId) return [];
      return actor.getLessonsByChapter(chapterId);
    },
    enabled: !!actor && !isFetching && !!chapterId,
  });
}

export function useLesson(lessonId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["lesson", lessonId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLesson(lessonId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearch(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["search", keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return { lessons: [], chapters: [] };
      return actor.searchContent(keyword);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 1,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Mutations
export function useAddSeedData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.addSeedData();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classes"] }),
  });
}

export function useAddClass() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Class) => {
      if (!actor) throw new Error("No actor");
      return actor.addClass(c);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classes"] }),
  });
}

export function useUpdateClass() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: Class }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateClass(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classes"] }),
  });
}

export function useDeleteClass() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteClass(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classes"] }),
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Subject) => {
      if (!actor) throw new Error("No actor");
      return actor.addSubject(s);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["subjects", vars.classId.toString()] }),
  });
}

export function useUpdateSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: Subject }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSubject(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });
}

export function useDeleteSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSubject(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });
}

export function useAddChapter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Chapter) => {
      if (!actor) throw new Error("No actor");
      return actor.addChapter(c);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["chapters", vars.subjectId.toString()],
      }),
  });
}

export function useUpdateChapter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: Chapter }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateChapter(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chapters"] }),
  });
}

export function useDeleteChapter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteChapter(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chapters"] }),
  });
}

export function useAddLesson() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (l: Lesson) => {
      if (!actor) throw new Error("No actor");
      return actor.addLesson(l);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["lessons", vars.chapterId.toString()],
      }),
  });
}

export function useUpdateLesson() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: Lesson }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateLesson(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useDeleteLesson() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteLesson(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("No actor");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["isAdmin"] }),
  });
}
