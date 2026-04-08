"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_service_1 = require("../../../shared/prisma.service");
let AuditLogService = class AuditLogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAuditLogs(query) {
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(query);
        const validSortFields = ['createdAt', 'actionType'];
        const orderBy = validSortFields.includes(sortBy)
            ? { [sortBy]: sortOrder }
            : { createdAt: 'desc' };
        const where = {};
        if (query.actionType) {
            where.actionType = query.actionType;
        }
        if (query.actorId) {
            where.actorId = query.actorId;
        }
        if (query.taskId) {
            where.taskId = query.taskId;
        }
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    actor: { select: { id: true, name: true, email: true, role: true } },
                    task: { select: { id: true, title: true, status: true } },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return { data: logs, meta: { page, limit, total } };
    }
    async getAuditLogsByTask(taskId) {
        const logs = await this.prisma.auditLog.findMany({
            where: { taskId },
            orderBy: { createdAt: 'desc' },
            include: {
                actor: { select: { id: true, name: true, email: true, role: true } },
                task: { select: { id: true, title: true, status: true } },
            },
        });
        return logs;
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map