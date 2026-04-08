import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AuditActionType } from '../../constants';

export class GetAuditLogsQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: string;

  @IsOptional()
  @IsEnum(AuditActionType)
  actionType?: AuditActionType;

  @IsOptional()
  @IsUUID('4')
  actorId?: string;

  @IsOptional()
  @IsUUID('4')
  taskId?: string;
}
