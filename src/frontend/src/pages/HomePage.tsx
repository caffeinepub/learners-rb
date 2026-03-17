import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddSeedData, useAllClasses } from "@/hooks/useQueries";
import { getClassColor } from "@/utils/colors";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, Trophy, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

const STATS = [
  { icon: BookOpen, label: "Subjects", value: "50+" },
  { icon: Trophy, label: "Chapters", value: "200+" },
  { icon: Users, label: "Students", value: "10K+" },
];

export default function HomePage() {
  const { data: classes, isLoading } = useAllClasses();
  const seedMutation = useAddSeedData();
  const seededRef = useRef(false);

  useEffect(() => {
    if (classes && classes.length === 0 && !seededRef.current) {
      seededRef.current = true;
      seedMutation.mutate();
    }
  }, [classes, seedMutation]);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Class 1 to Class 12
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-4">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
                  LEARNERS-RB!
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Your complete learning companion. Explore subjects, read
                chapters, and master lessons — all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-primary text-primary-foreground gap-2 hover:opacity-90"
                  asChild
                  data-ocid="hero.primary_button"
                >
                  <Link to="/">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full gap-2"
                  asChild
                  data-ocid="hero.secondary_button"
                >
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              </div>
              <div className="flex gap-8 mt-10">
                {STATS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-extrabold text-foreground">
                      {value}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src="/assets/generated/hero-students.dim_600x400.png"
                alt="Students learning"
                className="w-full h-auto rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-16" data-ocid="classes.section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-foreground mb-2">
              Explore Your Classes
            </h2>
            <p className="text-muted-foreground">
              Choose your grade and start learning
            </p>
          </div>
          {isLoading || seedMutation.isPending ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="classes.loading_state"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(classes ?? [])
                .sort((a, b) => Number(a.grade) - Number(b.grade))
                .map((cls, i) => {
                  const color = getClassColor(i);
                  return (
                    <motion.div
                      key={cls.id.toString()}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      data-ocid={`classes.item.${i + 1}`}
                    >
                      <Link
                        to="/class/$classId"
                        params={{ classId: cls.id.toString() }}
                        className={`block ${color.bg} ${color.text} rounded-2xl p-5 h-28 flex flex-col justify-between card-hover shadow-card`}
                        data-ocid={`class.${i + 1}.link`}
                      >
                        <span className="text-2xl">🎓</span>
                        <div>
                          <div className="font-bold text-base leading-tight">
                            {cls.name}
                          </div>
                          <div className="text-xs opacity-80 mt-0.5 line-clamp-1">
                            {cls.description}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
            </div>
          )}
          {!isLoading &&
            !seedMutation.isPending &&
            (classes ?? []).length === 0 && (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="classes.empty_state"
              >
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No classes found. Loading sample content...</p>
              </div>
            )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: "📖",
                title: "Structured Learning",
                desc: "Organized chapters and lessons for every subject across all classes.",
              },
              {
                emoji: "🎯",
                title: "Focused Content",
                desc: "Concise study materials aligned to curriculum standards.",
              },
              {
                emoji: "🚀",
                title: "Learn at Your Pace",
                desc: "Browse any chapter or lesson whenever you want, as many times as you need.",
              },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-card">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-base mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
