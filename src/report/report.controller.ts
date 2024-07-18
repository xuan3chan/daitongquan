import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from 'src/gaurd/member.gaurd';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { CreateReportDto } from './dto/report.dto';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';
import { Subject,Action } from 'src/decorator/casl.decorator';

@ApiTags('report')
@ApiBearerAuth()
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Post(':postId')
  @UseGuards(MemberGuard)
  async createReportController(
    @Req() request: Request,
    @Param('postId') postId: string,
    @Body() dto : CreateReportDto,
  ): Promise<{ message: string }> {
    const userId = this.getUserIdFromToken(request);
    return await this.reportService.createReportService(
      userId,
      postId,
      dto.reportType,
      dto.reportContent,
    );
  }
  
  @Get('list-report')
  @UseGuards(PermissionGuard)
  @Subject('report')
  @Action('read')
  async getReportsController(): Promise<{ reports: any }> {
    return { reports: await this.reportService.getReportsService() };
  }

  @Delete(':reportId')
  @UseGuards(PermissionGuard)
  @Subject('report')
  @Action('delete')
  async deleteReportController(
    @Param('reportId') reportId: string,
  ): Promise<{ message: string }> {
    return await this.reportService.deleteReportService(reportId);
  }
  
  @Patch('block-user/:reportId')
  @UseGuards(PermissionGuard)
  @Subject('report')
  @Action('block')
  async blockUserByReportController(
    @Param('reportId') reportId: string,
  ): Promise<{ message: string }> {
    return await this.reportService.blockUserByReportService(reportId);
  }
  @Patch('block-post/:reportId')
  @UseGuards(PermissionGuard)
  @Subject('report')
  @Action('block')
  async blockPostByReportController(
    @Param('reportId') reportId: string,
  ): Promise<{ message: string }> {
    return await this.reportService.blockPostByReportService(reportId);
  }

  @Patch('reject/:reportId')
  @UseGuards(PermissionGuard)
  @Subject('report')
  @Action('read')
  async rejectReportController(
    @Param('reportId') reportId: string,
  ): Promise<{ message: string }> {
    return await this.reportService.rejectReportService(reportId);
  }
}
