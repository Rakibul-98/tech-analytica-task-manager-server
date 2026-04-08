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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../helper/paginationHelper");
const constants_1 = require("../../constants");
const prisma_service_1 = require("../../../shared/prisma.service");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTask(dto, actorId) {
        if (dto.assignedUserId) {
            await this.assertUserExists(dto.assignedUserId);
        }
        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                assignedUserId: dto.assignedUserId,
            },
            include: {
                assignedUser: { select: { id: true, name: true, email: true } },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId,
                taskId: task.id,
                actionType: client_1.AuditActionType.TASK_CREATED,
                beforeData: undefined,
                afterData: this.serializeTask(task),
            },
        });
        return task;
    }
    async getAllTasks(query, actorId, actorRole) {
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(query);
        const validSortFields = ['title', 'status', 'createdAt', 'updatedAt'];
        const orderBy = validSortFields.includes(sortBy)
            ? { [sortBy]: sortOrder }
            : { createdAt: 'desc' };
        const where = {};
        if (actorRole === constants_1.UserRole.USER) {
            where.assignedUserId = actorId;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    assignedUser: { select: { id: true, name: true, email: true } },
                },
            }),
            this.prisma.task.count({ where }),
        ]);
        return { data: tasks, meta: { page, limit, total } };
    }
    async getTaskById(taskId, actorId, actorRole) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                assignedUser: { select: { id: true, name: true, email: true } },
            },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (actorRole === constants_1.UserRole.USER && task.assignedUserId !== actorId) {
            throw new common_1.ForbiddenException('You can only view your own assigned tasks');
        }
        return task;
    }
    async updateTask(taskId, dto, actorId) {
        const existing = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                assignedUser: { select: { id: true, name: true, email: true } },
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Task not found');
        if (dto.assignedUserId && dto.assignedUserId !== existing.assignedUserId) {
            await this.assertUserExists(dto.assignedUserId);
        }
        const updated = await this.prisma.task.update({
            where: { id: taskId },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.assignedUserId !== undefined && {
                    assignedUserId: dto.assignedUserId,
                }),
            },
            include: {
                assignedUser: { select: { id: true, name: true, email: true } },
            },
        });
        const assignmentChanged = dto.assignedUserId !== undefined &&
            dto.assignedUserId !== existing.assignedUserId;
        await this.prisma.auditLog.create({
            data: {
                actorId,
                taskId,
                actionType: assignmentChanged
                    ? client_1.AuditActionType.ASSIGNMENT_UPDATED
                    : client_1.AuditActionType.TASK_UPDATED,
                beforeData: this.serializeTask(existing),
                afterData: this.serializeTask(updated),
            },
        });
        return updated;
    }
    async updateTaskStatus(taskId, dto, actorId, actorRole) {
        const existing = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                assignedUser: { select: { id: true, name: true, email: true } },
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Task not found');
        if (actorRole === constants_1.UserRole.USER && existing.assignedUserId !== actorId) {
            throw new common_1.ForbiddenException('You can only update the status of your assigned tasks');
        }
        const updated = await this.prisma.task.update({
            where: { id: taskId },
            data: { status: dto.status },
            include: {
                assignedUser: { select: { id: true, name: true, email: true } },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId,
                taskId,
                actionType: client_1.AuditActionType.STATUS_UPDATED,
                beforeData: { status: existing.status },
                afterData: { status: updated.status },
            },
        });
        return updated;
    }
    async deleteTask(taskId, actorId) {
        const existing = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                assignedUser: { select: { id: true, name: true, email: true } },
            },
        });
        if (!existing)
            throw new common_1.NotFoundException('Task not found');
        await this.prisma.auditLog.create({
            data: {
                actorId,
                taskId,
                actionType: client_1.AuditActionType.TASK_DELETED,
                beforeData: this.serializeTask(existing),
                afterData: undefined,
            },
        });
        await this.prisma.task.delete({ where: { id: taskId } });
        return { id: taskId };
    }
    async assertUserExists(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException(`User with id "${userId}" not found`);
    }
    serializeTask(task) {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            assignedUserId: task.assignedUserId,
            assignedUser: task.assignedUser,
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map