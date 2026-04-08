/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { AuditActionType as PrismaAuditActionType } from '@prisma/client';
import { paginationHelper } from '../../helper/paginationHelper';
import { GetAuditLogsQueryDto } from './audit-log.dto';
import { PrismaService } from '../../../shared/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async getAuditLogs(query: GetAuditLogsQueryDto) {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(query);

    const validSortFields = ['createdAt', 'actionType'];
    const orderBy = validSortFields.includes(sortBy)
      ? { [sortBy]: sortOrder as 'asc' | 'desc' }
      : { createdAt: 'desc' as const };

    const where: any = {};

    if (query.actionType) {
      where.actionType = query.actionType as PrismaAuditActionType;
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

  async getAuditLogsByTask(taskId: string) {
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
}
