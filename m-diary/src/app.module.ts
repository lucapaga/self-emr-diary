import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserprofileService } from './s/userprofile/userprofile.service';
import { ConfigurationService } from './s/configuration/configuration.service';
import { RecordingService } from './s/recording/recording.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserprofileService, ConfigurationService, RecordingService],
})
export class AppModule {}
