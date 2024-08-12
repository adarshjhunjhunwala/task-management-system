import { NextResponse } from "next/server";
import moment from "moment";
import dbConnect from "../../../lib/mongodb";
import Task from "../../../models/Task";

export async function GET(req, { params }) {
    await dbConnect();

    const { id } = params;
    const task = await Task.findById(id);

    return NextResponse.json({ data: task });
}

export async function PUT(req, { params }) {
    await dbConnect();

    const { id } = params;
    const { title, description, status, dueDate } = await req.json();
    const errors = {};

    if (!title) errors.title = "Title is required";

    if (!['To Do', 'In Progress', 'Done'].includes(status)) {
        errors.status = "Invalid status";
    }

    if (dueDate) {
        const currentDateTime = moment();

        if (moment(dueDate).diff(currentDateTime, "minutes") < 0) {
            errors.dueDate = "Due date cannot be in the past";
        }
    }

    if (Object.keys(errors).length > 0) {
        return NextResponse.json({ errors }, { status: 400 });
    }

    const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, status, dueDate }
    );

    if (!updatedTask) {
        return NextResponse.json(
            { message: 'Task not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });
}

export async function DELETE(req, { params }) {
    await dbConnect();

    const { id } = params;
    const task = await Task.findById(id);

    if (!task) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    await task.deleteOne();

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
}