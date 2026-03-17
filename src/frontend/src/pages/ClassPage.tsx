import { Skeleton } from "@/components/ui/skeleton";
import { useAllClasses, useSubjectsByClass } from "@/hooks/useQueries";
import { getSubjectStyle } from "@/utils/colors";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { motion } from "motion/react";

export default function ClassPage() {
  const { classId } = useParams({ from: "/class/$classId" });
  const { data: classes } = useAllClasses();
  const cls = classes?.find((c) => c.id.toString() === classId);
  const { data: subjects, isLoading } = useSubjectsByClass(BigInt(classId));

  return (
    <div className="container mx-auto px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        data-ocid="class.back.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Classes
      </Link>

      {cls ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-foreground mb-1">
            {cls.name} – Let&apos;s Learn!
          </h1>
          <p className="text-muted-foreground mb-8">{cls.description}</p>
        </motion.div>
      ) : (
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
      )}

      <section data-ocid="subjects.section">
        <h2 className="text-xl font-bold mb-5">Subjects</h2>
        {isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            data-ocid="subjects.loading_state"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((sub, i) => {
              const style = getSubjectStyle(sub.name);
              return (
                <motion.div
                  key={sub.id.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  data-ocid={`subjects.item.${i + 1}`}
                >
                  <Link
                    to="/class/$classId/subject/$subjectId"
                    params={{ classId, subjectId: sub.id.toString() }}
                    className={`block ${style.bg} ${style.text} rounded-2xl p-6 h-36 flex flex-col justify-between card-hover shadow-card`}
                    data-ocid={`subject.${i + 1}.link`}
                  >
                    <span className="text-4xl">{style.emoji}</span>
                    <div>
                      <div className="font-bold text-base">{sub.name}</div>
                      <div className="text-xs opacity-80 mt-0.5 line-clamp-2">
                        {sub.description}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="subjects.empty_state"
          >
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No subjects found for this class.</p>
          </div>
        )}
      </section>
    </div>
  );
}
