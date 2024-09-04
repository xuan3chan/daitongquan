import {
  Body,
  Put,
  Patch,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {RegisterDto,LoginDto,RefreshTokenDto,ForgotPasswordDto,ResetPasswordDto} from './dto/index';

@ApiTags('authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConsumes('application/json')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'register successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('register')
  async registerController(@Body() register:RegisterDto ) {
    return await this.authService.registerService(
      register.email,
      register.password,
      register.username,
      register.firstname,
      register.lastname,
     
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'login successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('login')
  async loginController(@Body() user: LoginDto,@Res({ passthrough: true }) response: Response) {
    const loginResult = await this.authService.loginService(
      user.account,
      user.password,
    );
      // Thiết lập cookie
      response.cookie('token', loginResult.access_token, {
        httpOnly: true, // Cookie chỉ có thể được truy cập bởi các yêu cầu HTTP, không thể truy cập bởi JavaScript trong trình duyệt
        maxAge: 3600000, // Thời gian sống của cookie (ví dụ: 1 giờ)
      });
    return { message: 'successfully', data: loginResult };
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: 'refresh token successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('refresh-token')
  async refreshTokenController(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshTokenService(
      refreshToken.refreshToken,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'logout successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('logout')
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
