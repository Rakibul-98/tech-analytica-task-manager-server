import { TasksService } from './tasks.service';
import { CreateTaskDto, GetTasksQueryDto, UpdateTaskDto, UpdateTaskStatusDto } from './tasks.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    createTask(dto: CreateTaskDto, actorId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            assignedUser: {
                email: string;
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            assignedUserId: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
        };
    }>;
    getAllTasks(query: GetTasksQueryDto, actorId: string, actorRole: string): Promise<{
        success: boolean;
        message: string;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: ({
            assignedUser: {
                email: string;
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            assignedUserId: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
        })[];
    }>;
    getTaskById(taskId: string, actorId: string, actorRole: string): Promise<{
        success: boolean;
        message: string;
        data: {
            assignedUser: {
                email: string;
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            assignedUserId: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
        };
    }>;
    updateTask(taskId: string, dto: UpdateTaskDto, actorId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            assignedUser: {
                email: string;
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            assignedUserId: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
        };
    }>;
    updateTaskStatus(taskId: string, dto: UpdateTaskStatusDto, actorId: string, actorRole: string): Promise<{
        success: boolean;
        message: string;
        data: {
            assignedUser: {
                email: string;
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            assignedUserId: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
        };
    }>;
    deleteTask(taskId: string, actorId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
        };
    }>;
}
