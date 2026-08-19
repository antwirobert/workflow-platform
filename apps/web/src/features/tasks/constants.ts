export const TASK_STATUS_OPTIONS = [
  { label: "Todo", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Done", value: "DONE" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

export const TASK_PRIORITY_OPTIONS = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
] as const;

export const ALL_STATUS_OPTIONS = [
  { label: "All statuses", value: "ALL" },
  { label: "Todo", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Done", value: "DONE" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

export const ALL_PRIORITY_OPTIONS = [
  { label: "All priorities", value: "ALL" },
  { label: "Urgent", value: "URGENT" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
] as const;
