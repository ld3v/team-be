import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  IProjectResponse,
  IProjectService,
  I_PROJECT_SERVICE,
} from './interfaces';
import { JwtAuthGuard } from 'src/auth/guards';
import ResponseObject from 'common/response';
import { CreateProjectDTO, SearchProjectsDTO } from './dto';
import { IRequestWithAccount } from 'src/auth/interfaces';

@Controller('projects')
export class ProjectController {
  constructor(
    @Inject(I_PROJECT_SERVICE) private readonly projectService: IProjectService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(
    @Body() data: CreateProjectDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const newProject = await this.projectService.create(data, user);
      const projectReturn = this.projectService._transform(newProject);

      return ResponseObject.success<IProjectResponse>(projectReturn);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async search(
    @Query() { keyword, programId, ...pagination }: SearchProjectsDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const { items, total } = await this.projectService.search(
        programId,
        user,
        { keyword },
        pagination,
      );
      const projectsReturn = this.projectService._transformMulti(items).data;

      return ResponseObject.pagination<IProjectResponse>(projectsReturn, total);
    } catch (error) {
      throw error;
    }
  }
}
