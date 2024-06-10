import { Module, forwardRef } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule)
    ]
    ,
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}