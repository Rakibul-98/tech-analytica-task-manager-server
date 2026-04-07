/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import config from '../config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let error: any = exception;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || exception.message;
      error = res;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2001':
        case 'P2015':
        case 'P2018':
        case 'P2025':
          message = 'Record not found.';
          statusCode = HttpStatus.NOT_FOUND;
          break;
        case 'P2002':
          message = 'Duplicate key error — unique constraint failed.';
          statusCode = HttpStatus.CONFLICT;
          break;
        case 'P2003':
          message = 'Foreign key constraint failed.';
          statusCode = HttpStatus.BAD_REQUEST;
          break;
        case 'P2011':
        case 'P2012':
        case 'P2013':
          message = 'Missing required field.';
          statusCode = HttpStatus.BAD_REQUEST;
          break;
        default:
          message = `Database error (code: ${exception.code}).`;
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      error = exception.meta || exception.message;
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      message = 'Validation error in database operation.';
      statusCode = HttpStatus.BAD_REQUEST;
      error = exception.message;
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      message = 'Failed to connect to database.';
      statusCode = HttpStatus.BAD_GATEWAY;
      error = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.stack;
    }

    this.logger.error(
      `[${request.method}] ${request.url} → ${statusCode}: ${message}`,
      error,
    );

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error: config.node_env === 'development' ? error : undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
