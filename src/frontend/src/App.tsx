import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import AdminPage from "@/pages/AdminPage";
import ClassPage from "@/pages/ClassPage";
import HomePage from "@/pages/HomePage";
import LessonPage from "@/pages/LessonPage";
import SubjectPage from "@/pages/SubjectPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const classRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/class/$classId",
  component: ClassPage,
});
const subjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/class/$classId/subject/$subjectId",
  component: SubjectPage,
});
const lessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lesson/$lessonId",
  component: LessonPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  classRoute,
  subjectRoute,
  lessonRoute,
  adminRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
