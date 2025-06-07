import React, { useEffect, useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import {
  delete_single_task,
  edit_single_task,
  get_all_tasks,
} from "../api/tasks";
import * as XLSX from "xlsx";

const TaskCard = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      let get_result = await get_all_tasks();
      if (get_result) {
        if (get_result?.data?.status === 200) {
          let sorted_results = get_result?.data?.result.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setAllTasks(sorted_results);
          console.log("🚀 ~ allTasks ~ allTasks:", sorted_results);
        }
      }
    } catch (error) {
      console.log("🚀 ~ getTasks ~ error:", error);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask({ ...task }); // opens modal
  };

  const handleSaveEdit = async () => {
    try {
      console.log("the data to edit is", selectedTask);
      const response = await edit_single_task(selectedTask.id, selectedTask);
      if (response.data.status === 200) {
        console.log("Task Edited Successfully!", response);
        document.getElementById("close-edit-modal").click();
        getTasks();
      }
      if (response.data.status === 400) {
        console.log("Error Editing the data", selectedTask);
      }
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleDelete = async (taskId) => {
    // Logic to delete task (confirmation + API call)
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the task with ID: ${taskId}?`
    );
    console.log("Deleting task with ID:", taskId);
    if (confirmDelete) {
      try {
        let delete_result = await delete_single_task(taskId);
        if (delete_result.data.status === 200) {
          getTasks();
          console.log("Deleted the task successfully!");
        }
      } catch (error) {
        console.log("🚀 ~ handleDelete ~ error:", error);
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allTasks.length / pageSize);
  const paginatedTasks = allTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportToExcel = () => {
    const dataToExport = allTasks.map((task) => {
      const urlMatch = task.clienttaskdetails.match(/https?:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : "";
      const descriptionWithoutUrl = task.clienttaskdetails
        .replace(url, "")
        .trim();

      return {
        "Ticket Number": url,
        Date: new Date(task.date).toLocaleDateString(),
        "Concern Person": "Zaheer Abbas",
        "Working On Project": task.clientName,
        "Task Description": `${task.clientTask} - ${descriptionWithoutUrl}`,
        "Time in Hours": "", // Leave blank
        "Work Detail": "PHP and WordPress",
        "Client Name": "DDH",
        POC: "Eddie",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "tasks_export.xlsx");
  };

  return (
    <>
      <div className="task-card">
        <div class="card">
          <div class="card-body">
            <div className="container mt-4">
              <h3>All Tasks</h3>

              {/* Page Size Selector */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2">Show:</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="form-select w-auto"
                >
                  {[10, 20, 30, 40, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="ms-2">records per page</span>

                <div className="mb-3 text-end">
                  <button
                    className="btn btn-success"
                    onClick={handleExportToExcel}
                  >
                    Export to Excel
                  </button>
                </div>
              </div>

              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>Task</th>
                    <th>Details & URL</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.length > 0 ? (
                    paginatedTasks.map((task, index) => (
                      <tr key={task.id}>
                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                        <td>{new Date(task.date).toLocaleDateString()}</td>
                        <td>{task.clientName}</td>
                        <td>{task.clientTask}</td>
                        <td>{task.clienttaskdetails}</td>
                        <td>{task.clienttaskstatus}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm me-2"
                            onClick={() => handleEdit(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination">
                    <li
                      className={`page-item ${currentPage === 1 && "disabled"}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          currentPage === i + 1 && "active"
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages && "disabled"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedTask && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button
                  type="button"
                  className="btn btn-danger"
                  id="close-edit-modal"
                  onClick={() => setSelectedTask(null)}
                >
                  X
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Client Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedTask.clientName}
                      onChange={(e) =>
                        setSelectedTask({
                          ...selectedTask,
                          clientName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Client Task</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedTask.clientTask}
                      onChange={(e) =>
                        setSelectedTask({
                          ...selectedTask,
                          clientTask: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Task Details</label>
                    <textarea
                      className="form-control"
                      value={selectedTask.clienttaskdetails}
                      onChange={(e) =>
                        setSelectedTask({
                          ...selectedTask,
                          clienttaskdetails: e.target.value,
                        })
                      }
                    />
                  </div>
                  <select
                    className="form-control"
                    value={selectedTask.clienttaskstatus}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        clienttaskstatus: e.target.value,
                      })
                    }
                  >
                    <option value="">Select an Option</option>
                    <option value="readytostart">Ready to start</option>
                    <option value="inprogress">In Progress</option>
                    <option value="onhold">On Hold</option>
                    <option value="pendingdeploy">Pending Deploy</option>
                    <option value="waitingforreview">Waiting for review</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveEdit}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
