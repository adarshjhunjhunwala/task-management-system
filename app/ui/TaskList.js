"use client";

import { useState } from "react";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import moment from "moment";
import TaskForm from "./TaskForm";

const TaskList = ({ tasks, fetchTasks }) => {
    const baseBadgeClasses =
        "inline-flex items-center rounded-full px-2 py-1 text-xs border";

    const statusClasses = {
        "To Do": "text-yellow-500 border-yellow-500",
        "In Progress": "text-sky-500 border-sky-500",
        "Done": "text-green-500 border-green-500",
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteClick = (task) => {
        setSelectedTask(task);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);

        const res = await fetch(`/api/tasks/${selectedTask._id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            fetchTasks();
            toast.success(`Task deleted successfully!`);
        } else {
            toast.error(`An error occurred while deleting the task.`);
        }

        setIsLoading(false);
        setShowDeleteModal(false);
        setSelectedTask(null);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {tasks.length &&
                    tasks.map((task) => (
                        <div
                            key={task._id}
                            className="relative p-4 bg-black border border-gray-700 rounded-2xl"
                        >
                            <div className="absolute top-2 right-2 flex space-x-1">
                                <TaskForm
                                    fetchTasks={fetchTasks}
                                    taskOperation="update"
                                    oldTaskData={task}
                                />
                                <button
                                    onClick={() => handleDeleteClick(task)}
                                    className="text-red-500 hover:text-red-600 border border-gray-700 rounded-full p-1"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                            <div className="grid grid-rows-2 gap-2">
                                <div className="row-span-1">
                                    <h2 className="text-lg font-bold">{task.title}</h2>
                                </div>
                                <div className="row-span-1">
                                    <p>
                                        <EventIcon />{" "}
                                        {task.dueDate ? moment(task.dueDate).format(
                                            "DD MMM YYYY, hh:mm A"
                                        ) : "N/A"}
                                    </p>
                                </div>
                                <div className="row-span-1">
                                    <span
                                        className={`${baseBadgeClasses} ${statusClasses[task.status]}`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                                <div className="row-span-1">
                                    {task.description && <p>{task.description}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
                    <div className="p-8 rounded-full shadow-md border border-gray-700">
                        <h2 className="text-lg font-bold mb-4">Delete Task</h2>
                        <p>Are you sure you want to delete this task?</p>
                        <div className="flex justify-end mt-4 mr-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 mr-2 text-sm text-white bg-gray-700 rounded-full hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 text-sm text-white bg-red-500 rounded-full hover:bg-red-600"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <RingLoader
                                        loading={isLoading}
                                        color="#FFFFFF"
                                        size={15}
                                    />
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskList;