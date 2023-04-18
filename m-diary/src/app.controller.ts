import { Body, Controller, Get, HttpCode, Logger, Param, Post, Query, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { AppStatusResponse, BareRecording, DiaryRecord, LoadRecordingsResponse, SaveRecordingRequest, SaveRecordingResponse } from './dto/reqres';
import { UserprofileService } from './s/userprofile/userprofile.service';
import { ClientPrincipal } from './e/userprofile';
import { RecordingService } from './s/recording/recording.service';
import { ConfigurationService } from './s/configuration/configuration.service';
import { DiaryRecording } from './e/diary';

@Controller("diary")
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly diaryService: RecordingService,
    private readonly confService: ConfigurationService,
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
    const savedDR: DiaryRecording = await this.diaryService.createOrUpdateRecording(this._buildFromRequestDTO(srRequest.record, up));
    ret.status = "OK";
    ret.record = this._buildResponseDTOFrom(savedDR);
    // ret.record.guid = "FINTAZZA";
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


  private _buildResponseDTOFrom(savedDR: DiaryRecording): DiaryRecord {
    var ret:DiaryRecord = new DiaryRecord();
    ret.guid = savedDR.guid;
    ret.matter = savedDR.matter;
    ret.measure = savedDR.measure;
    ret.cluster = savedDR.cluster;
    ret.status = savedDR.status;
    ret.recording = new BareRecording();
    ret.recording.datetime = savedDR.datetime;
    ret.recording.value = savedDR.value;
    return ret;
  }

  private _buildFromRequestDTO(record: DiaryRecord, up: ClientPrincipal): DiaryRecording {
    var ret:DiaryRecording = new DiaryRecording();
    ret.guid = record.guid;
    ret.matter = record.matter;
    ret.measure = record.measure;
    ret.cluster = record.cluster;
    ret.status = record.status;
    if(record.recording) {
      ret.datetime = record.recording.datetime;
      ret.value = record.recording.value;
    }
    ret.user = up;
    return ret;
  }
}
