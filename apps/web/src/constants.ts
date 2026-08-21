export const PALETTE = [
  {
    bg: "bg-blue-600 dark:bg-blue-500",
    text: "text-white",
  },
  {
    bg: "bg-emerald-600 dark:bg-emerald-500",
    text: "text-white",
  },
  {
    bg: "bg-violet-600 dark:bg-violet-500",
    text: "text-white",
  },
  {
    bg: "bg-orange-600 dark:bg-orange-500",
    text: "text-white",
  },
  {
    bg: "bg-rose-600 dark:bg-rose-500",
    text: "text-white",
  },
  {
    bg: "bg-teal-600 dark:bg-teal-500",
    text: "text-white",
  },
  {
    bg: "bg-cyan-600 dark:bg-cyan-500",
    text: "text-white",
  },
  {
    bg: "bg-indigo-600 dark:bg-indigo-500",
    text: "text-white",
  },
];

export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
  "CANCELLED",
] as const;
export const PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const LIMIT_OPTIONS = [12, 24, 48, 96];
export const DEFAULT_PAGE = 1;
export const DEFAULT_SIDEBAR_LIMIT = 5;
export const DEFAULT_WORKSPACE_PROJECTS_LIMIT = 3;
export const DEFAULT_SUB_TABLE_LIMIT = 10;
export const DEFAULT_TABLE_LIMIT = 12;
export const SELECT_ITEMS_LIMIT = 50;

export const ROLE_OWNER = "OWNER";
export const ROLE_ADMIN = "ADMIN";
export const ROLES_MANAGEMENT = [ROLE_OWNER, ROLE_ADMIN];
