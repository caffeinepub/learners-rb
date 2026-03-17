import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin, useSearch } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const debouncedSearch = useDebounce(searchQuery, 400);
  const { data: searchResults } = useSearch(debouncedSearch);

  const isLoggedIn = loginStatus === "success" && !!identity;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults =
    searchResults &&
    (searchResults.lessons.length > 0 || searchResults.chapters.length > 0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-foreground tracking-tight hidden sm:block">
            LEARNERS-<span className="text-primary">RB</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1 text-sm font-medium"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            data-ocid="nav.home.link"
          >
            Home
          </Link>
          <Link
            to="/"
            className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            data-ocid="nav.classes.link"
          >
            Classes
          </Link>
          <Link
            to="/"
            className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            data-ocid="nav.materials.link"
          >
            Study Materials
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-primary flex items-center gap-1"
              data-ocid="nav.admin.link"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Search */}
        <div
          ref={searchRef}
          className="relative flex-1 max-w-xs hidden md:block"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 rounded-full bg-secondary border-0 focus-visible:ring-1 text-sm"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            data-ocid="nav.search_input"
          />
          {showDropdown && searchQuery.length > 1 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50"
              data-ocid="nav.search_results.popover"
            >
              {hasResults ? (
                <div className="py-1">
                  {searchResults.chapters.slice(0, 3).map((ch) => (
                    <button
                      type="button"
                      key={ch.id.toString()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary text-left"
                      onClick={() => {
                        setShowDropdown(false);
                        setSearchQuery("");
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{ch.title}</span>
                    </button>
                  ))}
                  {searchResults.lessons.slice(0, 3).map((l) => (
                    <button
                      type="button"
                      key={l.id.toString()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary text-left"
                      onClick={() => {
                        navigate({
                          to: "/lesson/$lessonId",
                          params: { lessonId: l.id.toString() },
                        });
                        setShowDropdown(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="w-3.5 h-3.5 text-xs text-muted-foreground shrink-0">
                        📄
                      </span>
                      <span className="truncate">{l.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="rounded-full text-xs"
              data-ocid="nav.logout.button"
            >
              Log out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90 text-xs"
              data-ocid="nav.login.button"
            >
              {loginStatus === "logging-in" ? "Logging in..." : "Sign In"}
            </Button>
          )}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pb-4">
          <div className="pt-3 pb-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 rounded-full bg-secondary border-0"
              placeholder="Search..."
              data-ocid="nav.mobile_search_input"
            />
          </div>
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg hover:bg-secondary text-sm font-medium"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.mobile_home.link"
            >
              Home
            </Link>
            <Link
              to="/"
              className="px-3 py-2 rounded-lg hover:bg-secondary text-sm font-medium"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.mobile_classes.link"
            >
              Classes
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-lg hover:bg-secondary text-sm font-medium text-primary"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile_admin.link"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
