import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { GetAuditLogsQueryDto } from './audit-log.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getAuditLogs(@Query() query: GetAuditLogsQueryDto) {
    const result = await this.auditLogService.getAuditLogs(query);
    return {
      success: true,
      message: 'Audit logs fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get('task/:taskId')
  async getAuditLogsByTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    const data = await this.auditLogService.getAuditLogsByTask(taskId);
    return {
      success: true,
      message: 'Task audit logs fetched successfully',
      data,
    };
  }
}
