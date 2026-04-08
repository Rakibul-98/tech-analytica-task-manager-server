import { AuditLogService } from './audit-log.service';
import { GetAuditLogsQueryDto } from './audit-log.dto';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    getAuditLogs(query: GetAuditLogsQueryDto): Promise<{
        success: boolean;
        message: string;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: ({
            task: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.TaskStatus;
            };
            actor: {
                email: string;
                id: string;
                name: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            actionType: import(".prisma/client").$Enums.AuditActionType;
            beforeData: import("@prisma/client/runtime/library").JsonValue | null;
            afterData: import("@prisma/client/runtime/library").JsonValue | null;
            actorId: string;
            taskId: string;
        })[];
    }>;
    getAuditLogsByTask(taskId: string): Promise<{
        success: boolean;
        message: string;
        data: ({
            task: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.TaskStatus;
            };
            actor: {
                email: string;
                id: string;
                name: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            actionType: import(".prisma/client").$Enums.AuditActionType;
            beforeData: import("@prisma/client/runtime/library").JsonValue | null;
            afterData: import("@prisma/client/runtime/library").JsonValue | null;
            actorId: string;
            taskId: string;
        })[];
    }>;
}
