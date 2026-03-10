declare const _exports: mongoose.Model<{
    taskStatus: "todo" | "inProgress" | "done";
    priority: "low" | "medium" | "high";
    tags: string[];
    dueDate: NativeDate;
    createdAt: NativeDate;
    startDate: NativeDate;
    title?: string | null | undefined;
    description?: string | null | undefined;
    user?: mongoose.Types.ObjectId | null | undefined;
    updatedAt?: NativeDate | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    taskStatus: "todo" | "inProgress" | "done";
    priority: "low" | "medium" | "high";
    tags: string[];
    dueDate: NativeDate;
    createdAt: NativeDate;
    startDate: NativeDate;
    title?: string | null | undefined;
    description?: string | null | undefined;
    user?: mongoose.Types.ObjectId | null | undefined;
    updatedAt?: NativeDate | null | undefined;
}, {}, mongoose.DefaultSchemaOptions> & {
    taskStatus: "todo" | "inProgress" | "done";
    priority: "low" | "medium" | "high";
    tags: string[];
    dueDate: NativeDate;
    createdAt: NativeDate;
    startDate: NativeDate;
    title?: string | null | undefined;
    description?: string | null | undefined;
    user?: mongoose.Types.ObjectId | null | undefined;
    updatedAt?: NativeDate | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    taskStatus: "todo" | "inProgress" | "done";
    priority: "low" | "medium" | "high";
    tags: string[];
    dueDate: NativeDate;
    createdAt: NativeDate;
    startDate: NativeDate;
    title?: string | null | undefined;
    description?: string | null | undefined;
    user?: mongoose.Types.ObjectId | null | undefined;
    updatedAt?: NativeDate | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    taskStatus: "todo" | "inProgress" | "done";
    priority: "low" | "medium" | "high";
    tags: string[];
    dueDate: NativeDate;
    createdAt: NativeDate;
    startDate: NativeDate;
    title?: string | null | undefined;
    description?: string | null | undefined;
    user?: mongoose.Types.ObjectId | null | undefined;
    updatedAt?: NativeDate | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    taskStatus: "todo" | "inProgress" | "done";
    priority: "low" | "medium" | "high";
    tags: string[];
    dueDate: NativeDate;
    createdAt: NativeDate;
    startDate: NativeDate;
    title?: string | null | undefined;
    description?: string | null | undefined;
    user?: mongoose.Types.ObjectId | null | undefined;
    updatedAt?: NativeDate | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export = _exports;
import mongoose = require("mongoose");
//# sourceMappingURL=Task.d.ts.map