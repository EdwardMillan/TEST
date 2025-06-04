import { useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import { HeaderBar } from "src/components/HeaderBar";
import { TaskForm } from "src/components/TaskForm";
import { UserTag } from "src/components/UserTag";

import styles from "./TaskDetail.module.css";
import { getTask } from "../api/tasks";
import type { Task } from "src/api/tasks";

export function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null | undefined>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getTask(id)
        .then((res) => {
          if (res.success) {
            setTask(res.data);
          } else {
            setTask(undefined);
          }
        })
        .catch(() => setTask(undefined));
    }
  }, [id]);

  if (task === undefined) {
    return (
      <>
        <HeaderBar />
        <div className={styles.container}>
          <p className={styles.notFound}>Task not found.</p>
        </div>
      </>
    );
  }

  if (!task) return null;

  return (
    <>
      <HeaderBar />
      <div className={styles.container}>
        <Helmet>
          <title>{task.title} | TSE Todos</title>
        </Helmet>

        {isEditing ? (
          <TaskForm
            mode="edit"
            task={task}
            onSubmit={(updatedTask) => {
              setTask(updatedTask);
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            <div className={styles.topBar}>
              <Link to="/" className={styles.backLink}>
                Back to home
              </Link>
              <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                Edit task
              </button>
            </div>

            <h1 className={styles.title}>{task.title}</h1>
            <p className={styles.description}>{task.description || "No description provided."}</p>

            <div className={styles.meta}>
              <div className={styles.row}>
                <strong>Assignee</strong>
                {task.assignee ? (
                  <UserTag
                    user={
                      typeof task.assignee === "string"
                        ? { _id: task.assignee, name: "Unknown User" } // fallback for string IDs
                        : task.assignee
                    }
                  />
                ) : (
                  <span>Unassigned</span>
                )}
              </div>

              <div className={styles.row}>
                <strong>Status</strong>
                <p>{task.isChecked ? "Done" : "Not done"}</p>
              </div>

              <div className={styles.row}>
                <strong>Date created</strong>
                <p>
                  {new Date(task.dateCreated).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
