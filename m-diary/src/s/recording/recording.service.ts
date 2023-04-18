import { Container, CosmosClient } from '@azure/cosmos';
import { Injectable, Logger } from '@nestjs/common';
import { DiaryRecording } from '../../e/diary';
import { ClientPrincipal } from '../../e/userprofile';

class UserReferenceCosmosDTO {
    id?: string;
    email?: string;
}

class InnerRecordingCosmosDTO {
    datetime?: Date;
    value?: number | string;
}

class DiaryRecordingCosmosDTO {
    id?:string;
    matter?: string;
    measure?: string;
    cluster?: string;
    status?: string;
    user?: UserReferenceCosmosDTO;
    recording?: InnerRecordingCosmosDTO;
}

@Injectable()
export class RecordingService {
    private readonly logger = new Logger(RecordingService.name);
    private cosmosContainer?: Container;

    constructor() {
        try {
            const comsmosClient: CosmosClient = new CosmosClient(
                process.env.COSMOS_DB_CONNECTION_STRING
            );
            this.cosmosContainer = comsmosClient
                .database("liquids")
                .container("recordings");
        } catch (error) {
            this.logger.error("Unable to create CosmosClient, this will prevent m-diary to work properly", error);
        }
    }

    async createOrUpdateRecording(dr: DiaryRecording): Promise<DiaryRecording> {
        return new Promise(async (ret, rej) => {
            if (dr.guid) {
                //update
                const cosmosItem = this.cosmosContainer.item(dr.guid);
                const iResp = await cosmosItem.replace(this._buildCosmosDTOFrom(dr))
                ret(this._buildFromCosmosDTO(iResp.resource, dr.user));
            } else {
                // create
                const iResp = await this.cosmosContainer.items.create(this._buildCosmosDTOFrom(dr));
                ret(this._buildFromCosmosDTO(iResp.resource, dr.user));
            }
        });
    }

    private _buildFromCosmosDTO(
        resource: DiaryRecordingCosmosDTO,
        userProfile?: ClientPrincipal
    ): DiaryRecording {
        var ret: DiaryRecording = new DiaryRecording();
        ret.guid = resource.id;
        ret.matter = resource.matter;
        ret.measure = resource.measure;
        ret.cluster = resource.cluster;
        ret.status = resource.status;
        if (resource.recording) {
            ret.datetime = resource.recording.datetime;
            ret.value = resource.recording.value;
        }

        ret.user = userProfile;
        
        return ret;
    }

    private _buildCosmosDTOFrom(dr: DiaryRecording): DiaryRecordingCosmosDTO {
        var ret: DiaryRecordingCosmosDTO = new DiaryRecordingCosmosDTO();
        ret.id = dr.guid;
        ret.matter = dr.matter;
        ret.measure = dr.measure;
        ret.cluster = dr.cluster;
        ret.status = dr.status;
        if (dr.user) {
            ret.user = new UserReferenceCosmosDTO();
            ret.user.id = dr.user.userGUID;
            ret.user.email = dr.user.username;
        }
        ret.recording = new InnerRecordingCosmosDTO();
        ret.recording.datetime = dr.datetime;
        ret.recording.value = dr.value;
        return ret;
    }
}
