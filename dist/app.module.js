"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const GlobalExceptionFilter_1 = require("./app/middlewares/GlobalExceptionFilter");
const prisma_module_1 = require("./shared/prisma.module");
const auth_module_1 = require("./app/modules/auth/auth.module");
const users_module_1 = require("./app/modules/users/users.module");
const tasks_module_1 = require("./app/modules/tasks/tasks.module");
const audit_log_module_1 = require("./app/modules/audit-log/audit-log.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, users_module_1.UsersModule, tasks_module_1.TasksModule, audit_log_module_1.AuditLogModule],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: GlobalExceptionFilter_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_PIPE,
                useValue: new common_2.ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transform: true,
                    transformOptions: { enableImplicitConversion: true },
                }),
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map