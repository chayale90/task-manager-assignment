export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  user?: User; 
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface TaskTag {
  id: string;
  taskId: string;
  tagId: string;
  tag: Tag;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  userId: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  assignments?: TaskAssignment[];
  comments?: Comment[];
  tags?: TaskTag[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type { RegisterData } from '@shared/schemas/auth';

export interface TaskFilters {
  status?: string;
  priority?: string;
  [key: string]: string | undefined;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeIds?: string[];
  tagIds?: string[];
}

