import {
  Controller,
  Inject,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import {
  IProgramResponse,
  IProgramService,
  I_PROGRAM_SERVICE,
} from './interfaces';
import { JWTAuthGuard } from 'src/auth/guards';
import { CreateProgramDTO } from './dto';
import { IRequestWithAccount } from 'src/auth/interfaces';
import ResponseObject from 'common/response';
import { SearchPaginationDTO } from 'src/app/dto';
import MESSAGES from 'common/messages';

@Controller('programs')
export class ProgramController {
  constructor(
    @Inject(I_PROGRAM_SERVICE) private readonly programService: IProgramService,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  public async create(
    @Body() data: CreateProgramDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const newProgram = await this.programService.create(data, user);
      const programReturn = this.programService._transform(newProgram);

      return ResponseObject.success<IProgramResponse>(programReturn);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  public async search(
    @Query() { keyword, ...pagination }: SearchPaginationDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const { items, total } = await this.programService.search(
        { keyword },
        pagination,
        user,
      );
      const programsReturn = this.programService._transformMulti(items).data;

      return ResponseObject.pagination<IProgramResponse>(programsReturn, total);
    } catch (error) {
      throw error;
    }
  }

  @Get(':programId')
  @UseGuards(JWTAuthGuard)
  public async getById(
    @Param('programId') programId: string,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const program = await this.programService.getById(programId, user);
      if (!program) {
        throw new BadRequestException(MESSAGES.common.NOT_EXIST('program'));
      }
      const programsReturn = this.programService._transform(program);

      return ResponseObject.success<IProgramResponse>(programsReturn);
    } catch (error) {
      throw error;
    }
  }
}
