import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto, GetTasksQueryDto } from './tasks.dto';
import { PrismaService } from '../../../shared/prisma.service';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTask(dto: CreateTaskDto, actorId: string): Promise<{
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
    }>;
    getAllTasks(query: GetTasksQueryDto, actorId: string, actorRole: string): Promise<{
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
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getTaskById(taskId: string, actorId: string, actorRole: string): Promise<{
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
    }>;
    updateTask(taskId: string, dto: UpdateTaskDto, actorId: string): Promise<{
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
    }>;
    updateTaskStatus(taskId: string, dto: UpdateTaskStatusDto, actorId: string, actorRole: string): Promise<{
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
    }>;
    deleteTask(taskId: string, actorId: string): Promise<{
        id: string;
    }>;
    private assertUserExists;
    private serializeTask;
}
