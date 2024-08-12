"use client";

import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import Navbar from "../ui/Navbar";
import TaskList from "../ui/TaskList";
import TaskForm from "../ui/TaskForm";
import Loading from "../loading";

let socket;

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortCriteria, setSortCriteria] = useState("title");
    const [sortDirection, setSortDirection] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const { data: session } = useSession();
    const userId = session?.user?.id;

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (userId) {
            if (userId && Notification.permission !== 'granted') {
                Notification.requestPermission();
            }

            socket = io();

            socket.on('connect', () => {
                socket.emit('register', userId);
            });

            socket.on('reminder', (task) => {
                if (Notification.permission === 'granted') {
                    const notification = new Notification(`💼 Finish Up: ${task.title}`, {
                        body: `⏰ Don't forget! Due on ${moment(task.dueDate).format("DD MMM YYYY, hh:mm A")}.`
                    });

                    notification.onclick = () => {
                        window.open(task.link || "/", '_blank');
                    };
                }
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [userId]);

    const fetchTasks = async () => {
        setIsLoading(true);

        const res = await fetch("/api/tasks");
        const data = await res.json();

        setTasks(data.data);
        setIsLoading(false);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        const [criteria, direction] = e.target.value.split("_");

        setSortCriteria(criteria);
        setSortDirection(direction);
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const getSortedTasks = (tasks) => {
        return tasks.sort((a, b) => {
            if (sortCriteria === "title" || sortCriteria === "status") {
                const fieldA = a[sortCriteria].toLowerCase();
                const fieldB = b[sortCriteria].toLowerCase();

                if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
                if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
                return 0;
            } else if (sortCriteria === "dueDate") {
                const dateA = new Date(a[sortCriteria]);
                const dateB = new Date(b[sortCriteria]);

                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });
    };

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = statusFilter === "All" || task?.status === statusFilter;
        const matchesSearchTerm = task?.title?.toLowerCase().includes(searchTerm?.toLowerCase()) || task?.description?.toLowerCase().includes(searchTerm?.toLowerCase());

        return matchesStatus && matchesSearchTerm;
    });

    const sortedTasks = getSortedTasks(filteredTasks);

    if (isLoading) {
        return <Loading />;
    } else {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="p-4">
                    <div className="flex justify-between mb-4">
                        <h1 className="text-2xl">Tasks</h1>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between mb-4 items-center space-y-4 md:space-y-0">
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 w-full">
                            <div className="relative flex items-center w-full md:w-auto">
                                <label htmlFor="searchTerm" className="absolute left-3"><SearchIcon /></label>
                                <input
                                    type="text"
                                    id="searchTerm"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                    className="pl-10 pr-3 py-2 border border-gray-700 rounded-full bg-black text-white w-full md:w-auto"
                                    placeholder="Search tasks....."
                                />
                            </div>
                            <div className="relative flex items-center w-full md:w-auto">
                                <label htmlFor="statusFilter" className="absolute left-3"><FilterListIcon /></label>
                                <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange} className="pl-10 pr-3 py-2 border border-gray-700 rounded-full bg-black text-white w-full md:w-auto">
                                    <option value="All">All</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div className="relative flex items-center w-full md:w-auto">
                                <label htmlFor="sortCriteria" className="absolute left-3"><SortIcon /></label>
                                <select id="sortCriteria" onChange={handleSortChange} className="pl-10 pr-3 py-2 border border-gray-700 rounded-full bg-black text-white w-full md:w-auto">
                                    <option value="title_asc">Title ↑</option>
                                    <option value="title_desc">Title ↓</option>
                                    <option value="status_asc">Status ↑</option>
                                    <option value="status_desc">Status ↓</option>
                                    <option value="dueDate_asc">Due Date ↑</option>
                                    <option value="dueDate_desc">Due Date ↓</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                            <TaskForm fetchTasks={fetchTasks} taskOperation="add" />
                        </div>
                    </div>
                    {!sortedTasks.length ? (
                        <div className="flex justify-center items-center h-full mt-60">
                            <p>No tasks available.</p>
                        </div>
                    ) : (
                        <TaskList
                            tasks={sortedTasks}
                            fetchTasks={fetchTasks}
                        />
                    )}
                </div>
            </div>
        );
    }
}