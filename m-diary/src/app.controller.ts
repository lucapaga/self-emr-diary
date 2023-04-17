import { Body, Controller, Get, HttpCode, Logger, Param, Post, Query, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { AppStatusResponse, LoadRecordingsResponse, SaveRecordingRequest, SaveRecordingResponse } from './dto/reqres';
import { UserprofileService } from './s/userprofile/userprofile.service';
import { ClientPrincipal } from './e/userprofile';

@Controller("diary")
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly userProfileService: UserprofileService
  ) { }

  @Get("status")
  @HttpCode(200)
  getStatus(): AppStatusResponse {
    this.logger.log("Providing status ...");

    return {
      resource: "DIARY",
      status: "OK"
    };
  }

  @Post("recording")
  async saveRecording(
    @Headers("x-ms-client-principal") base64ClientPrincipal: string,
    @Body() srRequest: SaveRecordingRequest
  ): Promise<SaveRecordingResponse> {
    const up: ClientPrincipal = this.userProfileService.buildClientPrincipal(base64ClientPrincipal);
    this.logger.debug(`Processing new recording from ${up.username}`);
    var ret: SaveRecordingResponse = new SaveRecordingResponse();
    ret.status = "OK";
    ret.record = srRequest.record;
    ret.record.guid="FINTAZZA";
    return ret;
  }

  @Get("recording")
  async loadRecordings(
    @Headers("x-ms-client-principal") base64ClientPrincipal: string,
    @Query("cluster") cluster: string,
    @Query("t_from") tFrom: string,
    @Query("t_to") tTo: string
  ): Promise<LoadRecordingsResponse> {
    const up: ClientPrincipal = this.userProfileService.buildClientPrincipal(base64ClientPrincipal);
    var ret: LoadRecordingsResponse = new LoadRecordingsResponse();
    return ret;
  }
}
