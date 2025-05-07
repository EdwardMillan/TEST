import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Page, TaskForm, TaskList } from "src/components";

export function Home() {
  return (
    <Page>
      <Helmet>
        <title>Home | TSE Todos</title>
      </Helmet>
      <p>
        <Link to="/about">About this app</Link>
      </p>
      <TaskForm mode="create" />
      <TaskList title="All tasks" />
    </Page>
  );
}
