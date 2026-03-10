"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const mongooseUtils = __importStar(require("./utils/mongoose"));
const server = new mcp_js_1.McpServer({
    name: "kanban-mcp",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    },
});
server.resource("tasks", "tasks://all", {
    description: "Get all tasks from the database",
    title: "Tasks",
    mimeType: "application/json",
}, async (uri) => {
    // Don't block on DB init here; getTasks will fall back to cache if needed
    let tasks = await mongooseUtils.getTasks();
    return {
        contents: [
            {
                uri: uri.href,
                text: JSON.stringify(tasks),
                mimeType: "application/json",
            },
        ],
    };
});
// Create a new task
server.tool("create-task", "create a new todo task", {
    task_title: zod_1.z.string(),
    description: zod_1.z.string(),
}, {
    title: "create a todo task",
    readonlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
}, async (params) => {
    try {
        await mongooseUtils.createTask(params);
        return {
            content: [
                {
                    type: "text",
                    text: `Task "${params.task_title}" created successfully!`,
                },
            ],
        };
    }
    catch {
        return {
            content: [
                { type: "text", text: "An error occurred while creating the task." },
            ],
        };
    }
});
// set status
server.tool("move-task", "move a task to a different status", {
    task_id: zod_1.z.string(),
    new_status: zod_1.z.enum(["todo", "inProgress", "done"]),
}, {
    title: "move a task to a different status",
    readonlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
}, async (params) => {
    try {
        await mongooseUtils.moveTask(params.task_id, params.new_status);
        return {
            content: [
                {
                    type: "text",
                    text: `Task "${params.task_id}" moved to "${params.new_status}" successfully!`,
                },
            ],
        };
    }
    catch {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to move task "${params.task_id}" to "${params.new_status}".`,
                },
            ],
        };
    }
});
// set priority
server.tool("set-prioity", "set a task to a different priority", {
    task_id: zod_1.z.string(),
    new_priority: zod_1.z.enum(["low", "medium", "high"]),
}, {
    title: "set a task to a different priority",
    readonlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
}, async (params) => {
    try {
        await mongooseUtils.setTaskPriority(params.task_id, params.new_priority);
        return {
            content: [
                {
                    type: "text",
                    text: `Set task "${params.task_id}" Priority to "${params.new_priority}" successfully!`,
                },
            ],
        };
    }
    catch {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to set task "${params.task_id}" priority to "${params.new_priority}".`,
                },
            ],
        };
    }
});
// show analytics
server.prompt("tasks-analytics", "get analytics for users tasks", async () => {
    let tasks_stats = await getTasksStats();
    const statsString = JSON.stringify(tasks_stats, null, 2);
    return {
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `analize the lead time and current tasks status distribution from the given tasks stats and present them in a table:${statsString}`,
                },
            },
        ],
    };
});
//add tag
server.tool("add-tag", "add tags to a tasks", {
    task_tag: zod_1.z.string(),
    task_id: zod_1.z.string()
}, async (params) => {
    try {
        await mongooseUtils.addTaskTag(params.task_id, params.task_tag);
        return {
            content: [
                {
                    type: "text",
                    text: `Added tag "${params.task_tag}" to tasks"${params.task_id}" successfully.`,
                },
            ],
        };
    }
    catch {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to add tag "${params.task_tag}" to tasks"${params.task_id}".`,
                },
            ],
        };
    }
});
// analytics
async function getTasksStats() {
    const tasks = await mongooseUtils.getTasks();
    const tasks_count = tasks.length;
    let inProgress_count = 0;
    let done_count = 0;
    tasks.forEach((task) => {
        if (task.taskStatus == "done") {
            done_count++;
        }
        if (task.taskStatus == "inProgress") {
            inProgress_count++;
        }
    });
    return {
        all_tasks: tasks,
        tasks_count: tasks_count,
        inProgress_count: inProgress_count,
        todo_count: tasks_count - inProgress_count - done_count,
        done_count: done_count,
    };
}
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    // Initialize DB in the background so we don't block MCP initialize handshake
    mongooseUtils.initDb.catch((err) => {
        console.error("DB initialization failed:", err);
    });
}
main();
