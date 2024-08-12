import { NextResponse } from "next/server";
import moment from "moment";
import dbConnect from "../../lib/mongodb";
import { getUserId } from "../../lib/user";
import Task from "../../models/Task";

export async function GET() {
    await dbConnect();

    const userId = await getUserId();

    const tasks = await Task.find({ userId });
    return NextResponse.json({ data: tasks });
}

export async function POST(req) {
    console.log("inside add task api function");
    await dbConnect();

    const userId = await getUserId();

    const { title, description, status, dueDate } = await req.json();
    const errors = {};

    if (!title) errors.title = "Title is required";

    if (!["To Do", "In Progress", "Done"].includes(status)) {
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

    const newTask = new Task({
        userId,
        title,
        description,
        status,
        dueDate,
    });

    await newTask.save();

    return NextResponse.json(newTask, { status: 201 });
}