export type CreateTaskInput = {
  title: string;
  description: string;
  dueDate: string; // ← expected as string from API (e.g., "2025-12-31")
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
};