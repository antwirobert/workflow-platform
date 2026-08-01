import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrgState {
  activeOrgId: string | null;
  setActiveOrgId: (id: string) => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      activeOrgId: null,
      setActiveOrgId: (id) => set({ activeOrgId: id }),
    }),
    { name: "organization-storage" },
  ),
);
