/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  GetTasksQueryDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './tasks.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserRole } from '../../constants/index.';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createTask(
    @Body() dto: CreateTaskDto,
    @CurrentUser('id') actorId: string,
  ) {
    const data = await this.tasksService.createTask(dto, actorId);
    return { success: true, message: 'Task created successfully', data };
  }

  @Get()
  async getAllTasks(
    @Query() query: GetTasksQueryDto,
    @CurrentUser('id') actorId: string,
    @CurrentUser('role') actorRole: string,
  ) {
    const result = await this.tasksService.getAllTasks(
      query,
      actorId,
      actorRole,
    );
    return {
      success: true,
      message: 'Tasks fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  async getTaskById(
    @Param('id', ParseUUIDPipe) taskId: string,
    @CurrentUser('id') actorId: string,
    @CurrentUser('role') actorRole: string,
  ) {
    const data = await this.tasksService.getTaskById(
      taskId,
      actorId,
      actorRole,
    );
    return { success: true, message: 'Task fetched successfully', data };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async updateTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser('id') actorId: string,
  ) {
    const data = await this.tasksService.updateTask(taskId, dto, actorId);
    return { success: true, message: 'Task updated successfully', data };
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser('id') actorId: string,
    @CurrentUser('role') actorRole: string,
  ) {
    const data = await this.tasksService.updateTaskStatus(
      taskId,
      dto,
      actorId,
      actorRole,
    );
    return { success: true, message: 'Task status updated successfully', data };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @CurrentUser('id') actorId: string,
  ) {
    const data = await this.tasksService.deleteTask(taskId, actorId);
    return { success: true, message: 'Task deleted successfully', data };
  }
}
