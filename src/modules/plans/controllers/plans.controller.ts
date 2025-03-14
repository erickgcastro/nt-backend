import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { PlansService } from '../services/plans.service';
import { CreatePlanDto } from '../dto/create-plan.dto';
import { PlanResponseDto } from '../dto/plan-response.dto';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new plan (admin only)' })
  @ApiResponse({ status: 201, description: 'Plan created successfully', type: PlanResponseDto })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all available plans' })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
    type: [PlanResponseDto],
  })
  async findAll(): Promise<PlanResponseDto[]> {
    return this.plansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific plan' })
  @ApiResponse({ status: 200, description: 'Plan retrieved successfully', type: PlanResponseDto })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async findOne(@Param('id') id: string): Promise<PlanResponseDto> {
    return this.plansService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a plan (admin only)' })
  @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.plansService.remove(id);
  }
}
