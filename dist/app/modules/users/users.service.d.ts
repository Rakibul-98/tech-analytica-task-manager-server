import { GetUsersQueryDto } from './users.dto';
import { PrismaService } from '../../../shared/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllUsers(query: GetUsersQueryDto): Promise<{
        data: {
            email: string;
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
}
