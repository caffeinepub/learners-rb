import { Skeleton } from "@/components/ui/skeleton";
import { useLesson } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { motion } from "motion/react";

export default function LessonPage() {
  const { lessonId } = useParams({ from: "/lesson/$lessonId" });
  const { data: lesson, isLoading } = useLesson(BigInt(lessonId));

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        data-ocid="lesson.back.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {isLoading ? (
        <div className="space-y-3" data-ocid="lesson.loading_state">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : lesson ? (
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-card p-8"
        >
          <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-3">
            <BookOpen className="w-4 h-4" /> Lesson
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-6">
            {lesson.title}
          </h1>
          <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
            {lesson.content.split("\n").map((para, i) =>
              para.trim() ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: paragraph index
                <p key={i} className="mb-4">
                  {para}
                </p>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: paragraph index
                <br key={i} />
              ),
            )}
          </div>
        </motion.article>
      ) : (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="lesson.error_state"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Lesson not found.</p>
        </div>
      )}
    </div>
  );
}
