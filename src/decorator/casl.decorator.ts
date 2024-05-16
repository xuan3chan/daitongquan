import { SetMetadata } from '@nestjs/common';

export const Subject = (...subject: string[]) => SetMetadata('Subject', subject);
export const Action = (...action: string[]) => SetMetadata('Action', action);