import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Inject,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import {
  TProjectResponse,
  IProjectService,
  I_PROJECT_SERVICE,
} from './interfaces';
import { JWTAuthGuard } from 'src/auth/guards';
import { CreateProjectDTO, SearchProjectsDTO } from './dto';
import { IRequestWithAccount } from 'src/auth/interfaces';
import { IProgramService, I_PROGRAM_SERVICE } from 'src/program/interfaces';
import { common } from '@ld3v/nqh-shared';

const { ResponseObject } = common;

@Controller('projects')
export class ProjectController {
  constructor(
    @Inject(I_PROJECT_SERVICE) private readonly projectService: IProjectService,
    @Inject(forwardRef(() => I_PROGRAM_SERVICE))
    private readonly programService: IProgramService,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  public async create(
    @Body() data: CreateProjectDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      await this.programService.getById(data.programId, user, true);

      const newProject = await this.projectService.create(data, user);
      const projectReturn = this.projectService._transform(newProject);

      return ResponseObject.success<TProjectResponse>(projectReturn);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  public async search(
    @Query() { keyword, programId, ...pagination }: SearchProjectsDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      await this.programService.getById(programId, user, true);

      const { items, total } = await this.projectService.search(
        programId,
        { keyword },
        pagination,
      );
      const projectsReturn = this.projectService._transformMulti(items).data;

      return ResponseObject.pagination<TProjectResponse>(projectsReturn, total);
    } catch (error) {
      throw error;
    }
  }
}
