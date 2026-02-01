export interface CreateTaskListDto {
  id: string;
  title: string;
  status: '1' | '2';
  createdAt: string;
}

export interface UpdateTaskListDto extends Partial<CreateTaskListDto> {}

export interface CreateTaskDto {
  id: string;
  taskListId: string;
  title: string;
  completed: boolean;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}
