export interface TaskList {
  id: string;
  title: string;
  status: '1' | '2'; // 1: en proceso, 2: completado
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  taskListId: string;
  title: string;
  completed: boolean;
}
