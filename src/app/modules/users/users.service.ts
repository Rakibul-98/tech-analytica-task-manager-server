import { Injectable } from '@nestjs/common';
import { GetUsersQueryDto } from './users.dto';
import { paginationHelper } from '../../helper/paginationHelper';
import { PrismaService } from '../../../shared/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(query: GetUsersQueryDto) {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(query);

    const validSortFields = ['name', 'email', 'role', 'createdAt'];
    const orderBy = validSortFields.includes(sortBy)
      ? { [sortBy]: sortOrder as 'asc' | 'desc' }
      : { createdAt: 'desc' as const };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: { page, limit, total },
    };
  }
}
