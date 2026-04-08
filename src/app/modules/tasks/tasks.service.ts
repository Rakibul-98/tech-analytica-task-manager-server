/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  AuditActionType,
  TaskStatus as PrismaTaskStatus,
} from '@prisma/client';
import { paginationHelper } from '../../helper/paginationHelper';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  GetTasksQueryDto,
} from './tasks.dto';
import { UserRole } from '../../constants';
import { PrismaService } from '../../../shared/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(dto: CreateTaskDto, actorId: string) {
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
        actionType: AuditActionType.TASK_CREATED,
        beforeData: undefined,
        afterData: this.serializeTask(task),
      },
    });

    return task;
  }

  async getAllTasks(
    query: GetTasksQueryDto,
    actorId: string,
    actorRole: string,
  ) {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(query);

    const validSortFields = ['title', 'status', 'createdAt', 'updatedAt'];
    const orderBy = validSortFields.includes(sortBy)
      ? { [sortBy]: sortOrder as 'asc' | 'desc' }
      : { createdAt: 'desc' as const };

    const where: any = {};

    if (actorRole === UserRole.USER) {
      where.assignedUserId = actorId;
    }

    if (query.status) {
      where.status = query.status as PrismaTaskStatus;
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

  async getTaskById(taskId: string, actorId: string, actorRole: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    if (actorRole === UserRole.USER && task.assignedUserId !== actorId) {
      throw new ForbiddenException('You can only view your own assigned tasks');
    }

    return task;
  }

  async updateTask(taskId: string, dto: UpdateTaskDto, actorId: string) {
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });
    if (!existing) throw new NotFoundException('Task not found');

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

    const assignmentChanged =
      dto.assignedUserId !== undefined &&
      dto.assignedUserId !== existing.assignedUserId;

    await this.prisma.auditLog.create({
      data: {
        actorId,
        taskId,
        actionType: assignmentChanged
          ? AuditActionType.ASSIGNMENT_UPDATED
          : AuditActionType.TASK_UPDATED,
        beforeData: this.serializeTask(existing),
        afterData: this.serializeTask(updated),
      },
    });

    return updated;
  }

  async updateTaskStatus(
    taskId: string,
    dto: UpdateTaskStatusDto,
    actorId: string,
    actorRole: string,
  ) {
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });
    if (!existing) throw new NotFoundException('Task not found');

    if (actorRole === UserRole.USER && existing.assignedUserId !== actorId) {
      throw new ForbiddenException(
        'You can only update the status of your assigned tasks',
      );
    }

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: { status: dto.status as PrismaTaskStatus },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        taskId,
        actionType: AuditActionType.STATUS_UPDATED,
        beforeData: { status: existing.status },
        afterData: { status: updated.status },
      },
    });

    return updated;
  }

  async deleteTask(taskId: string, actorId: string) {
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });
    if (!existing) throw new NotFoundException('Task not found');

    await this.prisma.auditLog.create({
      data: {
        actorId,
        taskId,
        actionType: AuditActionType.TASK_DELETED,
        beforeData: this.serializeTask(existing),
        afterData: undefined,
      },
    });

    await this.prisma.task.delete({ where: { id: taskId } });

    return { id: taskId };
  }

  private async assertUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      throw new NotFoundException(`User with id "${userId}" not found`);
  }

  private serializeTask(task: any) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignedUserId: task.assignedUserId,
      assignedUser: task.assignedUser,
    };
  }
}
