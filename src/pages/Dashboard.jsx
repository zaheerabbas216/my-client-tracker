import React from "react";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {
  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <h1>Dashboard</h1>
          <div className="task-form-component">
            <TaskForm />
          </div>
        </div>

        <div className="col-md-8">
          <div className="task-card-component">
            <TaskCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
