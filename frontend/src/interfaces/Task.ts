export interface Task {
  id: number;
  state: 'COMPLETE' | 'INCOMPLETE';
  description: string;
  createdAt: string;
  completedAt: string | null;
}