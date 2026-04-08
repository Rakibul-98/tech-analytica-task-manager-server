"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../config"));
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Something went wrong!';
        let error = exception;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const res = exception.getResponse();
            message =
                typeof res === 'string'
                    ? res
                    : res.message || exception.message;
            error = res;
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2001':
                case 'P2015':
                case 'P2018':
                case 'P2025':
                    message = 'Record not found.';
                    statusCode = common_1.HttpStatus.NOT_FOUND;
                    break;
                case 'P2002':
                    message = 'Duplicate key error — unique constraint failed.';
                    statusCode = common_1.HttpStatus.CONFLICT;
                    break;
                case 'P2003':
                    message = 'Foreign key constraint failed.';
                    statusCode = common_1.HttpStatus.BAD_REQUEST;
                    break;
                case 'P2011':
                case 'P2012':
                case 'P2013':
                    message = 'Missing required field.';
                    statusCode = common_1.HttpStatus.BAD_REQUEST;
                    break;
                default:
                    message = `Database error (code: ${exception.code}).`;
                    statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            }
            error = exception.meta || exception.message;
        }
        else if (exception instanceof client_1.Prisma.PrismaClientValidationError) {
            message = 'Validation error in database operation.';
            statusCode = common_1.HttpStatus.BAD_REQUEST;
            error = exception.message;
        }
        else if (exception instanceof client_1.Prisma.PrismaClientInitializationError) {
            message = 'Failed to connect to database.';
            statusCode = common_1.HttpStatus.BAD_GATEWAY;
            error = exception.message;
        }
        else if (exception instanceof Error) {
            message = exception.message;
            error = exception.stack;
        }
        this.logger.error(`[${request.method}] ${request.url} → ${statusCode}: ${message}`, error);
        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            error: config_1.default.node_env === 'development' ? error : undefined,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=GlobalExceptionFilter.js.map