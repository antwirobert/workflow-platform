import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrgState {
  activeOrgSlug: string | null;
  setActiveOrgSlug: (slug: string) => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      activeOrgSlug: null,
      setActiveOrgSlug: (slug) => set({ activeOrgSlug: slug }),
    }),
    { name: "organization-storage" },
  ),
);
