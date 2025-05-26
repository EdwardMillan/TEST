import { useState } from "react";
import { Link } from "react-router-dom";
import { updateTask } from "src/api/tasks";
import { CheckButton } from "src/components";
import styles from "src/components/TaskItem.module.css";

import type { Task } from "src/api/tasks";

export interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task: initialTask }: TaskItemProps) {
  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleToggleCheck = async () => {
    setLoading(true);

    const updatedTask = {
      ...task,
      isChecked: !task.isChecked,
      assignee: task.assignee?._id,
    };

    const result = await updateTask(updatedTask);

    if (result.success) {
      setTask(result.data);
    } else {
      alert("Failed to update task: " + result.error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.item}>
      <CheckButton checked={task.isChecked} onPress={handleToggleCheck} disabled={isLoading} />
      <div
        className={
          task.isChecked ? `${styles.textContainer} ${styles.checked}` : styles.textContainer
        }
      >
        <Link to={`/task/${task._id}`} className={styles.titleLink}>
          <span className={styles.title}>{task.title}</span>
        </Link>
        {task.description && <span className={styles.description}>{task.description}</span>}
      </div>

      {/* User info display like in TaskDetail */}
      <div className={styles.assignee}>
        <span className={styles.avatar}>👤</span> {task.assignee?.name || "User Name"}
      </div>
    </div>
  );
}
