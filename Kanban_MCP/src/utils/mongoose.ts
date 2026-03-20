import mongoose from "mongoose";
import User from "./User.js";
import Task from "./Task.js";


// Prefer environment variable over hard-coded credentials. Fallback kept for now.
const uri = process.env.MONGODB_URI || "your_mongoDB_uri";

const username = process.env.KANBAN_USERNAME || "your_Kanban_username"; 

const options = {
  dbName: process.env.DB_NAME || "your_db_name",
};

// Expose a promise so callers can await DB readiness before serving requests.
export const initDb: Promise<typeof mongoose> = (async () => {
  if (mongoose.connection.readyState === 0) {
    return mongoose.connect(uri, options);
  }

  return mongoose;
})();

export interface CreateTaskParams {
  task_title: string;
  description: string;
}

// create a task and associate it with the user
export async function createTask(params: CreateTaskParams): Promise<void> {
  const newTask = await Task.create({
    title: params.task_title,
    description: params.description,
    taskStatus: "todo",
  });

  // You may need to adjust how you get the user
  const user = await User.findOne({
    username: username,
  });

  if (user) {
    newTask.user = user;
    await newTask.save();
    user.tasks.push(newTask);
    await user.save();
  }
}
// get all tasks for the user
export async function getTasks() {
  try {
    const user = await User.findOne({
      username: username,
    });
    if (!user) {
      throw new Error("User not found");
    }

    const tasks = await Task.find({ user: user._id });

    return tasks;
  } catch {
    throw new Error("Failed to retrieve tasks");
  }
}
// get tasks by status
export async function getTasksByStatus(
  status?: "todo" | "inProgress" | "done"
) {
  const all = await getTasks();
  if (!status) return all;
  return all.filter((t: any) => t.taskStatus === status);
}

//move a task to a new status
export async function moveTask(
  taskId: string,
  newStatus: "todo" | "inProgress" | "done"
) {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    task.taskStatus = newStatus;
    await task.save();
  } catch {
    throw new Error("Failed to move task");
  }
}

// add a tag to a task
export async function addTaskTag(taskId: string, tag: string) {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.tags.includes(tag.toLowerCase())) {
      task.tags.push(tag.toLowerCase());
      await task.save();
    }
  } catch {
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

// set task priority
export async function setTaskPriority(
  taskId: string,
  priority: "low" | "medium" | "high"
) {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    task.priority = priority;
    await task.save();
  } catch {
    throw new Error("Failed to set priority");
  }
}
