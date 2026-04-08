import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants/index.';
import { GetUsersQueryDto } from './users.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Query() query: GetUsersQueryDto) {
    const result = await this.usersService.getAllUsers(query);
    return {
      success: true,
      message: 'Users fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }
}
