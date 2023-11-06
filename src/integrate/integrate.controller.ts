import {
  Inject,
  Controller,
  Post,
  Query,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Delete,
  Logger,
} from '@nestjs/common';
import { CreateSPGEventsDTO } from './dto';
import {
  IAppIntegrateService,
  IIntegrateService,
  I_APP_INTEGRATE_SERVICE,
  I_INTEGRATE_SERVICE,
} from './interfaces';
import { JWTAuthGuard } from 'src/auth/guards';
import { IRequestWithAccount } from 'src/auth/interfaces';
import { CreateAppDTO } from './dto/create-app.dto';
import { generateAPIKey } from 'common/func';
import { common } from '@ld3v/nqh-shared';
import { generateId } from '@ld3v/nqh-shared/dist/common';

const { ResponseObject } = common;

@Controller('integrate')
export class IntegrateController {
  constructor(
    @Inject(I_APP_INTEGRATE_SERVICE)
    private readonly appIntegrateService: IAppIntegrateService,
    @Inject(I_INTEGRATE_SERVICE)
    private readonly integrateService: IIntegrateService,
  ) {}

  @Get('apps')
  @UseGuards(JWTAuthGuard)
  async getApps(@Req() { user }: IRequestWithAccount) {
    const apps = await this.integrateService.getMyApps(user);
    return ResponseObject.success(this.integrateService.transformMulti(apps));
  }

  @Post('apps')
  @UseGuards(JWTAuthGuard)
  async createNewApp(
    @Req() { user }: IRequestWithAccount,
    @Body() data: CreateAppDTO,
  ) {
    const preAppId = generateId('APP');
    const { publicKey, secretKey } = await generateAPIKey(preAppId);
    const app = await this.integrateService.create(
      {
        id: preAppId,
        ...data,
        privateKey: secretKey,
      },
      user,
    );

    return ResponseObject.success({
      ...this.integrateService.transform(app),
      APIKey: publicKey,
    });
  }

  @Delete('apps/:id')
  @UseGuards(JWTAuthGuard)
  async deleteApp(@Param('id') id: string) {
    const isDeleted = await this.integrateService.deleteById(id);

    return ResponseObject.success(isDeleted);
  }

  // For integrated app
  // Google Calendar - Events
  @Post('g-events/passive-sync')
  public async syncGEvents(
    @Query() { appId, APIKey }: { appId?: string; APIKey?: string },
    @Body() { events }: CreateSPGEventsDTO,
  ) {
    await this.integrateService.validate(appId, APIKey);
    if (events.length === 0) {
      Logger.log('No events to create!');
      return ResponseObject.success([]);
    }

    const newEvents = await this.appIntegrateService.createEventsIfNotExist(
      events,
    );
    return ResponseObject.success({ events: newEvents });
  }
  @Post('g-events/trigger')
  public async triggerGEvent(
    @Query() { appId, APIKey }: { appId?: string; APIKey?: string },
    @Body()
    {
      isIncludeHosted = false,
      env = 'DEV',
    }: { isIncludeHosted?: boolean; env?: string },
  ) {
    await this.integrateService.validate(appId, APIKey);

    const isSuccess = await this.appIntegrateService.triggerDS({
      isIncludeHosted,
      env,
    });
    return ResponseObject.success(isSuccess);
  }

  @Post('g-events/hosted')
  public async getGEventHosted(
    @Query() { appId, APIKey }: { appId?: string; APIKey?: string },
  ) {
    await this.integrateService.validate(appId, APIKey);

    const members = await this.appIntegrateService.getHosted();
    return ResponseObject.success({ members });
  }
}
