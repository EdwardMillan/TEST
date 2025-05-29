import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createTask, updateTask } from "src/api/tasks";
import { TaskForm } from "src/components/TaskForm";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CreateTaskRequest, Task, UpdateTaskRequest } from "src/api/tasks";
import type { TaskFormProps } from "src/components/TaskForm";

const TITLE_INPUT_ID = "task-title-input";
const DESCRIPTION_INPUT_ID = "task-description-input";
const ASSIGNEE_INPUT_ID = "task-assignee-input";
const SAVE_BUTTON_ID = "task-save-button";

// Updated mock: include updateTask alongside createTask
vi.mock("src/api/tasks", () => ({
  createTask: vi.fn((_params: CreateTaskRequest) =>
    Promise.resolve({ success: true, data: { _id: "new-id", ..._params, isChecked: false, dateCreated: new Date() } })
  ),
  updateTask: vi.fn((_task: UpdateTaskRequest) =>
    Promise.resolve({ success: true, data: _task })
  ),
}));

const mockTask: Task = {
  _id: "task123",
  title: "My task",
  description: "Very important",
  assignee: { _id: "assignee123", name: "User Name" }, // ✅ A mock User object
  isChecked: false,
  dateCreated: new Date(),
};

function mountComponent(props: TaskFormProps) {
  render(<TaskForm {...props} />);
}

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("TaskForm", () => {
  it("renders create mode", () => {
    mountComponent({ mode: "create" });
    expect(screen.queryByText("New task")).toBeInTheDocument();
  });

  it("renders edit mode", () => {
    mountComponent({
      mode: "edit",
      task: mockTask,
    });
    expect(screen.queryByText("Edit task")).toBeInTheDocument();
    expect(screen.queryByTestId(TITLE_INPUT_ID)).toHaveValue("My task");
    expect(screen.queryByTestId(DESCRIPTION_INPUT_ID)).toHaveValue("Very important");
    expect(screen.queryByTestId(ASSIGNEE_INPUT_ID)).toHaveValue("assignee123");
  });

  it("calls createTask in create mode", async () => {
    mountComponent({ mode: "create" });
    fireEvent.change(screen.getByTestId(TITLE_INPUT_ID), { target: { value: "New title" } });
    fireEvent.change(screen.getByTestId(DESCRIPTION_INPUT_ID), {
      target: { value: "New description" },
    });
    fireEvent.change(screen.getByTestId(ASSIGNEE_INPUT_ID), {
      target: { value: "assignee999" },
    });
    const saveButton = screen.getByTestId(SAVE_BUTTON_ID);
    fireEvent.click(saveButton);
    expect(createTask).toHaveBeenCalledTimes(1);
    expect(createTask).toHaveBeenCalledWith({
      title: "New title",
      description: "New description",
      assignee: "assignee999",
    });
    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });
  });

  it("calls updateTask in edit mode", async () => {
    mountComponent({
      mode: "edit",
      task: mockTask,
    });
    fireEvent.change(screen.getByTestId(TITLE_INPUT_ID), { target: { value: "Updated title" } });
    fireEvent.change(screen.getByTestId(DESCRIPTION_INPUT_ID), {
      target: { value: "Updated description" },
    });
    fireEvent.change(screen.getByTestId(ASSIGNEE_INPUT_ID), {
      target: { value: "newAssignee123" },
    });
    const saveButton = screen.getByTestId(SAVE_BUTTON_ID);
    fireEvent.click(saveButton);
    expect(updateTask).toHaveBeenCalledTimes(1);
    expect(updateTask).toHaveBeenCalledWith({
      _id: "task123",
      title: "Updated title",
      description: "Updated description",
      assignee: "newAssignee123",
      isChecked: false,
      dateCreated: mockTask.dateCreated,
    });
    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });
  });

  it("catches invalid title", async () => {
    mountComponent({ mode: "create" });
    const saveButton = screen.getByTestId(SAVE_BUTTON_ID);
    fireEvent.click(saveButton);
    expect(createTask).not.toHaveBeenCalled();
    expect(updateTask).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });
  });
});
