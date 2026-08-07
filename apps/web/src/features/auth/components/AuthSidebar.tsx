import { Building2, FolderKanban, ListChecks } from "lucide-react";

const AuthSidebar = () => {
  return (
    <div className="relative hidden min-h-screen w-full flex-col justify-between overflow-hidden bg-black px-12 py-16 text-white md:flex md:w-1/2">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 20%, #0070f3 0%, transparent 45%), radial-gradient(circle at 80% 75%, #ff0080 0%, transparent 45%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-md">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
          Organizations · Workspaces · Projects · Tasks
        </p>

        <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white mt-5">
          One account. Every organization you work with.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/50">
          Join your team by invite or spin up your own organization. Workspaces,
          projects, and tasks stay neatly scoped, so you can switch context
          without signing out.
        </p>

        <div className="mt-10 space-y-4">
          <div className="flex gap-3">
            <Building2 className="mt-0.5 size-4 shrink-0 text-white/40" />
            <p className="text-sm leading-relaxed text-white/60">
              <span className="font-medium text-white/90">
                Multi-org by default
              </span>{" "}
              — owner, admin and member roles per organization.
            </p>
          </div>

          <div className="flex gap-3">
            <FolderKanban className="mt-0.5 size-4 shrink-0 text-white/40" />
            <p className="text-sm leading-relaxed text-white/60">
              <span className="font-medium text-white/90">
                Scoped workspaces
              </span>{" "}
              — projects always live inside the workspace they belong to.
            </p>
          </div>

          <div className="flex gap-3">
            <ListChecks className="mt-0.5 size-4 shrink-0 text-white/40" />
            <p className="text-sm leading-relaxed text-white/60">
              <span className="font-medium text-white/90">
                Tasks that stay in context
              </span>{" "}
              — comments, files and assignees in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-md mt-10">
        <blockquote className="border-l border-white/20 pl-4 text-sm leading-relaxed text-white/50">
          "We run three client organizations from one login. Fewer clicks, more
          shipped."
          <footer className="mt-2 text-[11px] font-medium uppercase tracking-wider text-white/30">
            Alex Chen · Head of Engineering
          </footer>
        </blockquote>
      </div>
    </div>
  );
};

export default AuthSidebar;
