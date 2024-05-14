import {
  Body,
  Put,
  Patch,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from '../auth/dto/register.dto'
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { AuthGuard } from '../gaurd/auth.gaurd';

@ApiTags('authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConsumes('multipart/form-data', 'application/json')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'register successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('register')
  async registerController(@Body() register: RegisterDto) {
    return await this.authService.registerService(
      register.email,
      register.password,
      register.username,
     
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'login successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('login')
  async loginController(@Body() user: LoginDto) {
    const loginResult = await this.authService.loginService(
      user.account,
      user.password,
    );
    return { message: 'successfully', data: loginResult };
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'refresh token successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(AuthGuard)
  @Patch('refresh-token')
  async refreshTokenController(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshTokenService(
      refreshToken.refreshToken,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'logout successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete('logout')
  async logoutController(
    @Body() refreshToken: RefreshTokenDto,
  ): Promise<{ message: string }> {
    return await this.authService.logoutService(refreshToken.refreshToken);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ description: 'sent code successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('forgot-password')
  async forgotPasswordController(@Body() forgotPassword: ForgotPasswordDto) {
    return await this.authService.forgotPasswordService(forgotPassword.email);
  }
  
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'reset password successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Put('reset-password')
  async resetPasswordController(
    @Body() resetPassword: ResetPasswordDto,
  ): Promise<{ statusCode: number; message: string }> {
    const result = await this.authService.resetPasswordService(
      resetPassword.code,
      resetPassword.newPassword,
    );
    return {
      ...result,
      statusCode: 201, // Replace with the appropriate status code
    };
  }
}
