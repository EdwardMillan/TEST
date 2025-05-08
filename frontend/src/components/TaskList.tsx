import { useEffect, useState } from "react";
import { getAllTasks } from "src/api/tasks";
import { TaskItem } from "src/components";
import styles from "src/components/TaskList.module.css";

import type { Task } from "src/api/tasks";

export interface TaskListProps {
  title: string;
}

export function TaskList({ title }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false); // avoid flickering empty state

  useEffect(() => {
    const fetchTasks = async () => {
      const result = await getAllTasks();
      if (result.success) {
        setTasks(result.data);
      } else {
        alert("Failed to fetch tasks.");
      }
      setLoaded(true);
    };
    fetchTasks();
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>
      <div className={styles.items}>
        {!loaded || tasks.length === 0 ? (
          <p>No tasks yet. Create one above!</p>
        ) : (
          tasks.map((task) => <TaskItem key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
}
