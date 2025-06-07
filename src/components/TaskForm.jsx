import React, { useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import { create_single_task, get_all_tasks } from "../api/tasks";

const TaskForm = () => {
  const { addTask } = useTaskContext();
  const [taskData, setTaskData] = useState({
    date: "",
    clientName: "",
    clientTask: "",
    clienttaskdetails: "",
    clienttaskstatus: "",
  });

  const [errors, setErrors] = useState({});

  const handleformchange = (e) => {
    const { id, value } = e.target;
    setTaskData({
      ...taskData,
      [id]: value,
    });
  };

  const taskformvalidate = () => {
    const newErrors = {};
    if (!taskData.date) newErrors.date = "Date is required";
    if (!taskData.clientName) newErrors.clientName = "Client Name is required";
    if (!taskData.clientTask) newErrors.clientTask = "Client Task is required";
    if (!taskData.clienttaskdetails)
      newErrors.clienttaskdetails = "Client Task Details is required";
    if (!taskData.clienttaskstatus)
      newErrors.clienttaskstatus = "Client Task Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskformvalidate()) return;

    console.log("Submitted Form Data:", taskData);
    // addTask(taskData);
    try {
      await create_single_task(taskData);
      setTaskData({
        date: "",
        clientName: "",
        clientTask: "",
        clienttaskdetails: "",
        clienttaskstatus: "",
      });
      setErrors({});
      location.reload();
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
    return;
    // Optionally reset the form
  };

  return (
    <>
      <div className="task-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label for="task-date">Select Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              aria-describedby="emailHelp"
              value={taskData.date}
              onChange={handleformchange}
            />
            {errors.date && (
              <small className="text-danger">{errors.date}</small>
            )}
          </div>
          <div className="form-group">
            <label for="clientName">Client Name</label>
            <input
              type="Client Name"
              className="form-control"
              id="clientName"
              value={taskData.clientName}
              onChange={handleformchange}
            />
            {errors.clientName && (
              <small className="text-danger">{errors.clientName}</small>
            )}
          </div>
          <div className="form-group">
            <label for="clientTask">Client Task</label>
            <input
              type="Client Task"
              className="form-control"
              id="clientTask"
              value={taskData.clientTask}
              onChange={handleformchange}
            />
            {errors.clientTask && (
              <small className="text-danger">{errors.clientTask}</small>
            )}
          </div>

          <div className="form-group">
            <label for="clienttaskdetails">Client Task Details</label>
            <textarea
              id="clienttaskdetails"
              name="clienttaskdetails"
              rows="5"
              cols="33"
              value={taskData.clienttaskdetails}
              onChange={handleformchange}
            >
              Enter the task details here...
            </textarea>

            {errors.clienttaskdetails && (
              <small className="text-danger">{errors.clienttaskdetails}</small>
            )}
          </div>
          <div className="form-group">
            <label for="clienttaskstatus">Task Status</label>
            <select
              className="form-control"
              id="clienttaskstatus"
              value={taskData.clienttaskstatus}
              onChange={handleformchange}
            >
              <option value="">Select an Option</option>
              <option value="readytostart">Ready to start</option>
              <option value="inprogress">In Progress</option>
              <option value="onhold">On Hold</option>
              <option value="pendingdeploy">Pending Deploy</option>
              <option value="waitingforreview">Waiting for review</option>
              <option value="completed">Completed</option>
            </select>
            {errors.clienttaskstatus && (
              <small className="text-danger">{errors.clienttaskstatus}</small>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default TaskForm;
