"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditActionType = exports.TaskStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "PENDING";
    TaskStatus["PROCESSING"] = "PROCESSING";
    TaskStatus["DONE"] = "DONE";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var AuditActionType;
(function (AuditActionType) {
    AuditActionType["TASK_CREATED"] = "TASK_CREATED";
    AuditActionType["TASK_UPDATED"] = "TASK_UPDATED";
    AuditActionType["TASK_DELETED"] = "TASK_DELETED";
    AuditActionType["STATUS_UPDATED"] = "STATUS_UPDATED";
    AuditActionType["ASSIGNMENT_UPDATED"] = "ASSIGNMENT_UPDATED";
})(AuditActionType || (exports.AuditActionType = AuditActionType = {}));
//# sourceMappingURL=index.js.map