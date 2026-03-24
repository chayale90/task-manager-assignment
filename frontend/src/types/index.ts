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
}

