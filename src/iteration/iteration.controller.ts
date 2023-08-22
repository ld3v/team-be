import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Param,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  IIterationService,
  IIterationResponse,
  I_ITERATION_SERVICE,
} from './interfaces';
import { JwtAuthGuard } from 'src/auth/guards';
import ResponseObject from 'common/response';
import { CreateIterationDTO, SearchProjectsDTO } from './dto';
import { IRequestWithAccount } from 'src/auth/interfaces';
import * as moment from 'moment';

@Controller('iterations')
export class IterationController {
  constructor(
    @Inject(I_ITERATION_SERVICE)
    private readonly iterationService: IIterationService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(
    @Body() input: CreateIterationDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const newIteration = await this.iterationService.create(
        {
          ...input,
          startAt: moment(input.startAt).startOf('day').toDate(),
          finishAt: moment(input.finishAt).startOf('day').toDate(),
        },
        user,
      );
      const data = this.iterationService._transform(newIteration);

      return ResponseObject.success<IIterationResponse>(data);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async search(
    @Query() { projectId }: SearchProjectsDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const items = await this.iterationService.search(projectId, user);
      const data = this.iterationService._transformMulti(items).data;

      return ResponseObject.success<IIterationResponse[]>(data);
    } catch (error) {
      throw error;
    }
  }

  @Get(':iterationId')
  @UseGuards(JwtAuthGuard)
  public async getById(
    @Param('iterationId') id: string,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const item = await this.iterationService.getById(id, user);
      const data = this.iterationService._transform(item);

      return ResponseObject.success<IIterationResponse>(data);
    } catch (error) {
      throw error;
    }
  }
}
