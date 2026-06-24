export type ViewMode = "month" | "week";

export type CalendarPost = {
  id: string;
  content: string;
  status: string;
  scheduledFor: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  targets: {
    connectedAccount: { platform: string };
  }[];
};
