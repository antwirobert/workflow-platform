import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  activeWorkspaceSlug: string | null;
  setActiveWorkspaceSlug: (slug: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceSlug: null,
      setActiveWorkspaceSlug: (slug) => set({ activeWorkspaceSlug: slug }),
    }),
    { name: "workspace-storage" },
  ),
);
