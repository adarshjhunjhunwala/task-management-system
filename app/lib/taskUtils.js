const moment = require("moment");
const dbConnect = require("./mongodb");
const Task = require("../models/Task");

const getTasksDueSoon = async () => {
    await dbConnect();

    const now = moment().startOf("minute");

    const tasks = await Task.find({
        dueDate: {
            $gt: now.clone().add(10, "minutes").toDate(),
            $lte: now.clone().add(11, "minutes").toDate(),
        },
        status: {
            $ne: "Done",
        },
    });

    return tasks;
};

module.exports = { getTasksDueSoon };