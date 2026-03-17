import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllClasses,
  useChaptersBySubject,
  useLessonsByChapter,
  useSubjectsByClass,
} from "@/hooks/useQueries";
import { getSubjectStyle } from "@/utils/colors";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function SubjectPage() {
  const { classId, subjectId } = useParams({
    from: "/class/$classId/subject/$subjectId",
  });
  const [selectedChapterId, setSelectedChapterId] = useState<bigint | null>(
    null,
  );
  const [selectedLesson, setSelectedLesson] = useState<{
    id: bigint;
    title: string;
    content: string;
  } | null>(null);

  const { data: classes } = useAllClasses();
  const cls = classes?.find((c) => c.id.toString() === classId);
  const { data: subjects } = useSubjectsByClass(BigInt(classId));
  const subject = subjects?.find((s) => s.id.toString() === subjectId);
  const style = subject
    ? getSubjectStyle(subject.name)
    : { bg: "bg-sky-500", text: "text-white", emoji: "📖" };

  const { data: chapters, isLoading: chaptersLoading } = useChaptersBySubject(
    BigInt(subjectId),
  );
  const { data: lessons, isLoading: lessonsLoading } =
    useLessonsByChapter(selectedChapterId);

  useEffect(() => {
    if (chapters && chapters.length > 0 && !selectedChapterId) {
      const sorted = [...chapters].sort(
        (a, b) => Number(a.orderIndex) - Number(b.orderIndex),
      );
      setSelectedChapterId(sorted[0].id);
    }
  }, [chapters, selectedChapterId]);

  useEffect(() => {
    if (lessons && lessons.length > 0) {
      const sorted = [...lessons].sort(
        (a, b) => Number(a.orderIndex) - Number(b.orderIndex),
      );
      setSelectedLesson(sorted[0]);
    } else {
      setSelectedLesson(null);
    }
  }, [lessons]);

  return (
    <div className="container mx-auto px-4 py-10">
      <Link
        to="/class/$classId"
        params={{ classId }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        data-ocid="subject.back.link"
      >
        <ArrowLeft className="w-4 h-4" /> {cls?.name ?? "Back"}
      </Link>

      {subject && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${style.bg} ${style.text} rounded-2xl p-6 mb-8 flex items-center gap-4`}
        >
          <span className="text-5xl">{style.emoji}</span>
          <div>
            <h1 className="text-2xl font-extrabold">{subject.name}</h1>
            <p className="text-sm opacity-80 mt-1">{subject.description}</p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Chapters Sidebar */}
        <div
          className="bg-white rounded-2xl border border-border shadow-card overflow-hidden"
          data-ocid="chapters.panel"
        >
          <div className="px-4 py-3 border-b border-border font-bold text-sm">
            Chapters
          </div>
          {chaptersLoading ? (
            <div className="p-4 space-y-2" data-ocid="chapters.loading_state">
              {Array.from({ length: 5 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : chapters && chapters.length > 0 ? (
            <ScrollArea className="h-[460px]">
              <ul className="p-2">
                {[...chapters]
                  .sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex))
                  .map((ch, i) => (
                    <li
                      key={ch.id.toString()}
                      data-ocid={`chapters.item.${i + 1}`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedChapterId(ch.id)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                          selectedChapterId === ch.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary text-foreground"
                        }`}
                        data-ocid={`chapter.${i + 1}.button`}
                      >
                        <span className="truncate">{ch.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      </button>
                    </li>
                  ))}
              </ul>
            </ScrollArea>
          ) : (
            <div
              className="p-6 text-sm text-muted-foreground text-center"
              data-ocid="chapters.empty_state"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No chapters available
            </div>
          )}
        </div>

        {/* Lesson Content */}
        <div
          className="bg-white rounded-2xl border border-border shadow-card"
          data-ocid="lesson.panel"
        >
          {lessonsLoading ? (
            <div className="p-8 space-y-3" data-ocid="lesson.loading_state">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : selectedLesson ? (
            <div>
              {lessons && lessons.length > 1 && (
                <div className="px-6 pt-4 flex gap-2 flex-wrap border-b border-border pb-3">
                  {[...lessons]
                    .sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex))
                    .map((l, i) => (
                      <button
                        type="button"
                        key={l.id.toString()}
                        onClick={() => setSelectedLesson(l)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          selectedLesson.id === l.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-accent"
                        }`}
                        data-ocid={`lesson.tab.${i + 1}`}
                      >
                        {l.title}
                      </button>
                    ))}
                </div>
              )}
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-extrabold text-foreground mb-4">
                  {selectedLesson.title}
                </h2>
                <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                  {selectedLesson.content.split("\n").map((para, i) =>
                    para.trim() ? (
                      // biome-ignore lint/suspicious/noArrayIndexKey: paragraph index
                      <p key={i} className="mb-3">
                        {para}
                      </p>
                    ) : (
                      // biome-ignore lint/suspicious/noArrayIndexKey: paragraph index
                      <br key={i} />
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="lesson.empty_state"
            >
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Select a chapter to view lessons</p>
              <p className="text-sm mt-1">
                Choose a chapter from the sidebar to see its content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
