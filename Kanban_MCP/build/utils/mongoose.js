"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = void 0;
exports.createTask = createTask;
exports.getTasks = getTasks;
exports.getTasksByStatus = getTasksByStatus;
exports.moveTask = moveTask;
exports.addTaskTag = addTaskTag;
exports.setTaskPriority = setTaskPriority;
const mongoose_1 = __importDefault(require("mongoose"));
const User_js_1 = __importDefault(require("./User.js"));
const Task_js_1 = __importDefault(require("./Task.js"));
// Prefer environment variable over hard-coded credentials. Fallback kept for now.
const uri = process.env.MONGODB_URI || "your_mongoDB_uri";
const username = process.env.KANBAN_USERNAME || "your_Kanban_username"; // Replace with actual username / env var.
const options = {
    dbName: process.env.DBNAME || "your_db_name",
};
// Expose a promise so callers can await DB readiness before serving requests.
exports.initDb = (async () => {
    if (mongoose_1.default.connection.readyState === 0) {
        return mongoose_1.default.connect(uri, options);
    }
    return mongoose_1.default;
})();
async function createTask(params) {
    const newTask = await Task_js_1.default.create({
        title: params.task_title,
        description: params.description,
        taskStatus: "todo",
    });
    // You may need to adjust how you get the user
    const user = await User_js_1.default.findOne({
        username: username,
    });
    if (user) {
        newTask.user = user;
        await newTask.save();
        user.tasks.push(newTask);
        await user.save();
    }
}
async function getTasks() {
    try {
        const user = await User_js_1.default.findOne({
            username: username,
        });
        if (!user) {
            throw new Error("User not found");
        }
        const tasks = await Task_js_1.default.find({ user: user._id });
        return tasks;
    }
    catch {
        throw new Error("Failed to retrieve tasks");
    }
}
async function getTasksByStatus(status) {
    const all = await getTasks();
    if (!status)
        return all;
    return all.filter((t) => t.taskStatus === status);
}
async function moveTask(taskId, newStatus) {
    try {
        const task = await Task_js_1.default.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        task.taskStatus = newStatus;
        await task.save();
    }
    catch {
        throw new Error("Failed to move task");
    }
}
async function addTaskTag(taskId, tag) {
    try {
        const task = await Task_js_1.default.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        if (!task.tags.includes(tag.toLowerCase())) {
            task.tags.push(tag.toLowerCase());
            await task.save();
        }
    }
    catch {
        throw new Error("Failed to add tag");
    }
}
// export async function removeTaskTag(taskId: string, tag: string) {
//   try {
//     const task = await Task.findById(taskId);
//     if (!task) {
//       throw new Error("Task not found");
//     }
//     task.tags = task.tags.filter((t) => t !== tag.toLowerCase());
//     await task.save();
//   } catch {
//     throw new Error("Failed to remove tag");
//   }
// }
async function setTaskPriority(taskId, priority) {
    try {
        const task = await Task_js_1.default.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        task.priority = priority;
        await task.save();
    }
    catch {
        throw new Error("Failed to set priority");
    }
}
