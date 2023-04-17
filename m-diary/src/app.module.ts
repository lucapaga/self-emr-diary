import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserprofileService } from './s/userprofile/userprofile.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserprofileService],
})
export class AppModule {}
