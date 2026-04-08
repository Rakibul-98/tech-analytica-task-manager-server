import { TaskStatus } from '../../constants';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    assignedUserId?: string;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    assignedUserId?: string;
}
export declare class UpdateTaskStatusDto {
    status: TaskStatus | undefined;
}
export declare class GetTasksQueryDto {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: TaskStatus;
    search?: string;
}
