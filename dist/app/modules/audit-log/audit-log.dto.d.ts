import { AuditActionType } from '../../constants';
export declare class GetAuditLogsQueryDto {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    actionType?: AuditActionType;
    actorId?: string;
    taskId?: string;
}
