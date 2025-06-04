import { get, handleAPIError, post, put } from "src/api/requests";

import { User } from "./users";

import type { APIResult } from "src/api/requests";

/**
 * Defines the "shape" of a Task object (what fields are present and their types) for
 * frontend components to use.
 */
export interface Task {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: Date;
  assignee?: User;
}

/**
 * JSON format of a Task received from the backend.
 */
interface TaskJSON {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: string;
  assignee?: User;
}

/**
 * Converts a raw JSON task into a Task object with a Date type.
 */
function parseTask(task: TaskJSON): Task {
  return {
    _id: task._id,
    title: task.title,
    description: task.description,
    isChecked: task.isChecked,
    dateCreated: new Date(task.dateCreated),
    assignee: task.assignee,
  };
}

/**
 * Interface for creating a new task.
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignee?: string;
}

/**
 * Interface for updating an existing task.
 */
export interface UpdateTaskRequest {
  _id: string;
  title: string;
  description?: string;
  isChecked: boolean;
  dateCreated: Date;
  assignee?: string;
}

/**
 * Sends a POST request to create a new task.
 */
export async function createTask(task: CreateTaskRequest): Promise<APIResult<Task>> {
  try {
    const response = await post("/api/task", task);
    const json = (await response.json()) as TaskJSON;
    return { success: true, data: parseTask(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetches a single task by its ID.
 */
export async function getTask(id: string): Promise<APIResult<Task>> {
  try {
    const response = await get(`/api/task/${id}`);
    const json = (await response.json()) as TaskJSON;
    return { success: true, data: parseTask(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetches all tasks from the backend.
 */
export async function getAllTasks(): Promise<APIResult<Task[]>> {
  try {
    const response = await get("/api/tasks");
    const json = await response.json();

    if (!json.success) {
      throw new Error(json.error || "Unknown error");
    }

    const tasks: Task[] = json.data.map(parseTask);
    return { success: true, data: tasks };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Updates an existing task.
 */
export async function updateTask(task: UpdateTaskRequest): Promise<APIResult<Task>> {
  try {
    const response = await put(`/api/task/${task._id}`, task);
    const json = (await response.json()) as TaskJSON;
    return { success: true, data: parseTask(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}
