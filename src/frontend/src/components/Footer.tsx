import { Link } from "@tanstack/react-router";
import { GraduationCap, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "learners-rb";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-white border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                LEARNERS-<span className="text-primary">RB</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A modern learning platform for students from Class 1 to Class 12.
              Explore subjects, chapters, and lessons at your own pace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary transition-colors"
                  data-ocid="footer.home.link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-primary transition-colors"
                  data-ocid="footer.classes.link"
                >
                  Browse Classes
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-primary transition-colors"
                  data-ocid="footer.admin.link"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-foreground">
              About
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LEARNERS-RB is a student-friendly educational platform built for
              curious minds. Study smarter, not harder.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {year}. Built with{" "}
          <Heart
            className="inline w-3 h-3 text-rose-500 mx-0.5"
            fill="currentColor"
          />{" "}
          using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
