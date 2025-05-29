import { useState } from "react";
import { createTask, updateTask } from "src/api/tasks";
import { Button, TextField } from "src/components";
import styles from "src/components/TaskForm.module.css";

import type { Task } from "src/api/tasks";

export interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
  onSubmit?: (task: Task) => void;
}

interface TaskFormErrors {
  title?: boolean;
}

export function TaskForm({ mode, task, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(task?.description || "");
  const [assigneeId, setAssigneeId] = useState<string>(
    // Fix: If task?.assignee is a User, get its ID string, not the object
    typeof task?.assignee === "string"
      ? task.assignee
      : task?.assignee?._id || ""
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  const handleSubmit = () => {
    setErrors({});
    if (title.length === 0) {
      setErrors({ title: true });
      return;
    }
    setLoading(true);
  
    const request =
    mode === "create"
      ? createTask({
          title,
          description,
          assignee: assigneeId || undefined,
        })
      : updateTask({
          _id: task?._id || "",
          title,
          description,
          assignee: assigneeId || undefined,
          isChecked: task?.isChecked || false,
          dateCreated: task?.dateCreated || new Date(), // ✅ Use Date object, not string
        });
  
    request
      .then((result) => {
        if (result.success) {
          if (mode === "create") {
            setTitle("");
            setDescription("");
            setAssigneeId("");
          }
          if (onSubmit) onSubmit(result.data);
        } else {
          alert(result.error);
        }
        setLoading(false);
      })
      .catch((reason) => alert(reason));
  };
  

  const formTitle = mode === "create" ? "New task" : "Edit task";

  return (
    <form className={styles.form}>
      <span className={styles.formTitle}>{formTitle}</span>
      <div className={styles.formRow}>
        <TextField
          className={styles.textField}
          data-testid="task-title-input"
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <TextField
          className={`${styles.textField} ${styles.stretch}`}
          data-testid="task-description-input"
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className={styles.formRow}>
        <TextField
          className={styles.textField}
          data-testid="task-assignee-input"
          label="Assignee ID (optional)"
          value={assigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
        />
        <Button
          kind="primary"
          type="button"
          data-testid="task-save-button"
          label="Save"
          disabled={isLoading}
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
}
