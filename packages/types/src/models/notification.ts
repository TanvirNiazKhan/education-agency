export type NotificationType = "success" | "info" | "warning" | "message" | "update";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
