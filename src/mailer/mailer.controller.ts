import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ApiConsumes, ApiProperty } from '@nestjs/swagger';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}


}
