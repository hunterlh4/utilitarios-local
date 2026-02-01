import { TaskList, Task } from './task.model';

export interface GetAllTaskListsResponse {
  data: TaskList[];
  total: number;
}

export interface GetTaskListByIdResponse {
  data: TaskList;
  tasks: Task[];
}
