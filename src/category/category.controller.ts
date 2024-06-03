import { Body,Post, Controller, Req, UseGuards, Put, Delete, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCateDto } from './dto/CreateCate.dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from '../gaurd/member.gaurd';
import { UpdateCateDto} from './dto/UpdateCate.dto';


@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  private getUserIdFromToken(request: Request): string {
    const token = (request.headers as any).authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken._id;
  }

  @Post()
  @UseGuards(MemberGuard)
  async createSpendingCateController(
    @Req() request: Request,
    @Body() createCateDto: CreateCateDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.categoryService.createCateService(
      userId,
      createCateDto.name,
      createCateDto.type,
      createCateDto.description,
      createCateDto.icon,
    );
  }

  @Put()
  @UseGuards(MemberGuard)
  async updateSpendingCateController(
    @Req() request: Request,
    @Body() updateCateDto: UpdateCateDto,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.categoryService.updateCateService(
      userId,
      updateCateDto.CateId,
      updateCateDto.name,
      updateCateDto.description,
      updateCateDto.icon,
    );
  }
  @Delete(':CateId')
  @UseGuards(MemberGuard)
  async deleteCateController(
    @Req() request: Request,
    @Param('CateId') CateId: string,
  ): Promise<any> {
   const userId = this.getUserIdFromToken(request);
    return this.categoryService.deleteCateService(userId, CateId);
  }
  @Get()
  @UseGuards(MemberGuard)
  async viewCateController(@Req() request: Request): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.categoryService.viewSpendingCateService(userId);
  }
  @Get('/income')
  @UseGuards(MemberGuard)
  async getCateByTypeIcomeController(
    @Req() request: Request,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.categoryService.getCateByTypeIcomeService(userId);
  }

  @Get('/spend')
  @UseGuards(MemberGuard)
  async getCateByTypeSpendController(
    @Req() request: Request,
  ): Promise<any> {
    const userId = this.getUserIdFromToken(request);
    return this.categoryService.getCateByTypeSpendingService(userId);
  }
  
}
