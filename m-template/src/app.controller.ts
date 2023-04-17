import { Controller, Get, HttpCode, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { AppStatusResponse } from './dto/reqres';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  
  constructor(private readonly appService: AppService) {}

  @Get("/status")
  @HttpCode(200)
  getStatus(): AppStatusResponse {
    this.logger.log("Providing status ...");

    // ******* CHANGE ME ******* 
    return {
      resource: "YOUR_MICROSERVICE_NAME",
      status: "OK"
    };
  }
}
