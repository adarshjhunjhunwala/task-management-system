"use client";

import { useState } from "react";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const TaskForm = ({ fetchTasks, taskOperation, oldTaskData = {} }) => {
    const [taskData, setTaskData] = useState({
        title: oldTaskData?.title || null,
        description: oldTaskData?.description || null,
        status: oldTaskData?.status || "To Do",
        dueDate: oldTaskData?.dueDate ? moment(oldTaskData?.dueDate) : null,
    });
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const method = taskOperation === "add" ? "POST" : "PUT";
        const url =
            taskOperation === "add"
                ? "/api/tasks"
                : `/api/tasks/${oldTaskData?._id}`;

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        const data = await res.json();

        setIsLoading(false);

        if (res.ok) {
            fetchTasks();

            setShowForm(false);

            toast.success(
                `Task ${
                    taskOperation === "add" ? "added" : "updated"
                } successfully!`
            );
        } else {
            if (Object.keys(data.errors).length) {
                setErrors(data.errors || {});
            } else {
                toast.error(
                    `An error occurred while ${
                        taskOperation === "add" ? "adding" : "updating"
                    } the task.`
                );
            }
        }
    };

    const handleCancel = () => {
        setTaskData({
            title: null,
            description: null,
            status: "To Do",
            dueDate: null,
        });

        setShowForm(false);
    };

    return (
        <>
            {taskOperation === "add" ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="px-3 py-2 text-xs md:text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600 flex items-center space-x-2 whitespace-nowrap"
                >
                    <AddIcon fontSize="small" /> Add Task
                </button>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="text-blue-500 hover:text-blue-600 border border-gray-700 rounded-full p-1"
                >
                    <EditIcon />
                </button>
            )}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
                    <div className="bg-black border border-gray-700 p-2 rounded-2xl w-3/4 md:w-1/2">
                        <h2 className="text-xl font-bold my-4 ml-2">
                            {taskOperation === "add"
                                ? "Add Task"
                                : "Update Task"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 ml-2">
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-white"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    className={`w-full px-3 py-2 mt-1 border ${
                                        errors.title
                                            ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            : "border-gray-700"
                                    } rounded-full bg-black text-white`}
                                    value={taskData?.title}
                                    onChange={handleChange}
                                    autoFocus={!!errors.title}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4 ml-2">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-white"
                                >
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    className={`w-full px-3 py-2 mt-1 border border-gray-700 rounded-full bg-black text-white`}
                                    value={taskData?.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4 ml-2">
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-white"
                                >
                                    Status
                                </label>
                                <select
                                    name="status"
                                    className={`w-full px-3 py-2 mt-1 border ${
                                        errors.status
                                            ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            : "border-gray-700"
                                    } rounded-full bg-black text-white`}
                                    value={taskData?.status}
                                    onChange={handleChange}
                                    autoFocus={!!errors.status}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">
                                        In Progress
                                    </option>
                                    <option value="Done">Done</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4 ml-2">
                                <label
                                    htmlFor="dueDate"
                                    className="block text-sm font-medium text-white"
                                >
                                    Due Date
                                </label>
                                <DateTimePicker
                                    name="dueDate"
                                    format="DD-MM-YYYY hh:mm A"
                                    disablePast
                                    slotProps={{
                                        field: {
                                            size: "small",
                                            autoFocus: !!errors.dueDate,
                                            fullWidth: true,
                                            InputProps: {
                                                sx: {
                                                    border: `1px solid ${
                                                        errors.dueDate
                                                            ? "rgb(239 68 68)"
                                                            : "rgb(55 65 81)"
                                                    }`,
                                                    borderRadius: "9999px",
                                                    color: "#FFFFFF",
                                                    marginTop: "0.25rem",
                                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                        {
                                                            borderColor: `${
                                                                errors.dueDate
                                                                    ? "rgb(239 68 68)"
                                                                    : "#FFFFFF"
                                                            }`,
                                                        },
                                                    "& .MuiSvgIcon-root": {
                                                        color: "#FFFFFF",
                                                    },
                                                },
                                            },
                                        },
                                        dialog: {
                                            sx: {
                                                "& .MuiPaper-root": {
                                                    backgroundColor:
                                                        "#000000",
                                                    color: "#FFFFFF",
                                                    border: "1px solid rgb(55 65 81)",
                                                    borderRadius: "12px",
                                                },
                                                "& .MuiPickersDay-root": {
                                                    color: "#FFFFFF",
                                                },
                                                "& .MuiPickersDay-root.MuiPickersDay-today": {
                                                    borderColor: "rgb(55 65 81)",
                                                },
                                                "& .MuiPaper-root.Mui-disabled, .MuiPickersDay-root.Mui-disabled, .MuiPickersYear-yearButton.Mui-disabled":
                                                    {
                                                        color: "#808080",
                                                    },
                                                "& .MuiPickersYear-yearButton.Mui-selected, .MuiClock-pin, .MuiClockPointer-root": {
                                                    backgroundColor: "rgb(59 130 246)",
                                                },
                                                "& .MuiButton-root": {
                                                    color: "rgb(59 130 246)",
                                                },
                                                "& .MuiSvgIcon-root:hover, .MuiPickersDay-root:hover, .MuiPickersDay-root.Mui-selected:hover, .MuiPickersYear-yearButton:hover, .MuiMenuItem-root:hover,":
                                                    {
                                                        backgroundColor:
                                                            "rgb(55 65 81)",
                                                        borderRadius: "9999px",
                                                    },
                                                "& .MuiPickersDay-root.Mui-selected, .Mui-selected":
                                                    {
                                                        backgroundColor:
                                                            "rgb(59 130 246)",
                                                        borderRadius: "9999px",
                                                        padding: "5px",
                                                    },
                                                "& .MuiTabs-indicator": {
                                                    display: "none"
                                                },
                                                "& .MuiPickersToolbarText-root, .MuiPickersToolbarText-root.Mui-selected": {
                                                    margin: "2px",
                                                },
                                                "& .MuiPickersToolbar-root, .MuiDialog-container": {
                                                    backgroundColor: "#000000",
                                                },
                                                "& .MuiTypography-root, .MuiClockNumber-root": {
                                                    color: "#FFFFFF",
                                                },
                                                "& .MuiSvgIcon-root, .Mui-selected>.MuiSvgIcon-root": {
                                                    backgroundColor: "transparent",
                                                    color: "#FFFFFF",
                                                },
                                            },
                                        },
                                        popper: {
                                            sx: {
                                                "& .MuiPaper-root": {
                                                    backgroundColor:
                                                        "#000000 !important",
                                                    color: "#FFFFFF",
                                                    border: "1px solid rgb(55 65 81)",
                                                    borderRadius: "12px",
                                                    padding: "0.5rem",
                                                },
                                                "& .MuiPickersDay-root": {
                                                    color: "#FFFFFF",
                                                },
                                                "& .MuiPickersDay-root.MuiPickersDay-today": {
                                                    borderColor: "rgb(55 65 81)",
                                                },
                                                "& .MuiPaper-root.Mui-disabled, .MuiPickersDay-root.Mui-disabled, .MuiPickersYear-yearButton.Mui-disabled":
                                                    {
                                                        color: "#808080",
                                                    },
                                                "& .MuiPickersYear-yearButton.Mui-selected": {
                                                    backgroundColor: "rgb(59 130 246)"
                                                },
                                                "& .MuiButton-root": {
                                                    color: "rgb(59 130 246)",
                                                },
                                                "& .MuiSvgIcon-root:hover, .MuiPickersDay-root:hover, .MuiPickersDay-root.Mui-selected:hover, .MuiPickersYear-yearButton:hover, .MuiMenuItem-root:hover,":
                                                    {
                                                        backgroundColor:
                                                            "rgb(55 65 81)",
                                                        borderRadius: "9999px",
                                                    },
                                                "& .MuiPickersDay-root.Mui-selected, .Mui-selected":
                                                    {
                                                        backgroundColor:
                                                            "rgb(59 130 246)",
                                                        borderRadius: "9999px",
                                                    },
                                                "& .MuiPickersToolbar-root": {
                                                    backgroundColor: "#000000",
                                                },
                                                "& .MuiTypography-root": {
                                                    color: "#FFFFFF",
                                                },
                                                "& .MuiSvgIcon-root": {
                                                    color: "#FFFFFF",
                                                },
                                            },
                                        },
                                        layout: {
                                            sx: {
                                                ul: {
                                                    "::-webkit-scrollbar": {
                                                        width: "6px",
                                                    },
                                                    "::-webkit-scrollbar-track":
                                                        {
                                                            backgroundColor:
                                                                "black",
                                                            border: "1px solid rgb(55 65 81)",
                                                            borderRadius: "8px",
                                                        },
                                                    "::-webkit-scrollbar-thumb":
                                                        {
                                                            backgroundColor:
                                                                "rgb(59 130 246)",
                                                            borderRadius: "8px",
                                                        },
                                                    "::-webkit-scrollbar-thumb:hover":
                                                        {
                                                            backgroundColor:
                                                                "rgb(59 130 246)",
                                                        },
                                                },
                                            },
                                        },
                                    }}
                                    value={taskData?.dueDate}
                                    onChange={(date) =>
                                        handleChange({
                                            target: {
                                                name: "dueDate",
                                                value: date,
                                            },
                                        })
                                    }
                                />
                                {errors.dueDate && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.dueDate}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 mr-2 text-sm text-white bg-gray-700 rounded-full hover:bg-gray-800"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <RingLoader
                                            loading={isLoading}
                                            color="#FFFFFF"
                                            size={15}
                                        />
                                    ) : taskOperation === "add" ? (
                                        "Add"
                                    ) : (
                                        "Update"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskForm;