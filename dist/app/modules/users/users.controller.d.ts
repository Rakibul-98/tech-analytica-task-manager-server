import { UsersService } from './users.service';
import { GetUsersQueryDto } from './users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(query: GetUsersQueryDto): Promise<{
        success: boolean;
        message: string;
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            email: string;
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        }[];
    }>;
}
