import { GetAuditLogsQueryDto } from './audit-log.dto';
import { PrismaService } from '../../../shared/prisma.service';
export declare class AuditLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAuditLogs(query: GetAuditLogsQueryDto): Promise<{
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
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getAuditLogsByTask(taskId: string): Promise<({
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
    })[]>;
}
