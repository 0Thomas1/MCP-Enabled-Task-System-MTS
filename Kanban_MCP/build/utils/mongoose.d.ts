import mongoose from "mongoose";
export declare const initDb: Promise<typeof mongoose>;
export interface CreateTaskParams {
    task_title: string;
    description: string;
}
export declare function createTask(params: CreateTaskParams): Promise<void>;
export declare function getTasks(): Promise<import("./Task.js").ITask[]>;
export declare function getTasksByStatus(status?: "todo" | "inProgress" | "done"): Promise<import("./Task.js").ITask[]>;
export declare function moveTask(taskId: string, newStatus: "todo" | "inProgress" | "done"): Promise<void>;
export declare function addTaskTag(taskId: string, tag: string): Promise<void>;
export declare function setTaskPriority(taskId: string, priority: "low" | "medium" | "high"): Promise<void>;
//# sourceMappingURL=mongoose.d.ts.map