import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import {
  TProjectResponse,
  IProjectService,
  TProjectPreview,
  I_MEMBER_SERVICE,
  IMemberService,
  TAccessibleAs,
} from './interfaces';
import {
  IProjectRepository,
  I_PROJECT_REPOSITORY,
  TSearchOptions,
  TPaginationOptions,
  TPaginationResult,
  Account,
  Iteration,
  Project,
  Member,
} from '@ld3v/nqh-shared';
import { CreateProjectDTO } from './dto';
import { IProgramService, I_PROGRAM_SERVICE } from 'src/program/interfaces';
import { TTransformResult } from 'src/app/interfaces/transform';
import MESSAGES from 'common/messages';
import {
  IIterationService,
  I_ITERATION_SERVICE,
} from 'src/iteration/interfaces';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    @Inject(I_PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(forwardRef(() => I_ITERATION_SERVICE))
    private readonly iterationService: IIterationService,
    @Inject(forwardRef(() => I_PROGRAM_SERVICE))
    private readonly programService: IProgramService,
    @Inject(I_MEMBER_SERVICE)
    private readonly memberService: IMemberService,
  ) {}

  public async create(
    data: CreateProjectDTO,
    account: Account,
  ): Promise<Project> {
    try {
      const program = await this.programService.getById(
        data.programId,
        account,
        true,
      );
      const newPrj = await this.projectRepository.create({
        ...data,
        program,
      });
      return await this.getById(newPrj.id);
    } catch (error) {
      throw error;
    }
  }

  public async search(
    programId: string,
    searchOptions: TSearchOptions,
    paginationOptions: TPaginationOptions,
  ): Promise<TPaginationResult<Project>> {
    try {
      return await this.projectRepository.getProjects(
        programId,
        searchOptions,
        paginationOptions,
      );
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string): Promise<Project> {
    try {
      const project = await this.projectRepository.findById(id);
      return project;
    } catch (error) {
      throw error;
    }
  }

  public async isAccessible(
    id: string,
    requester: Account,
    accessAs: TAccessibleAs = 'project',
  ): Promise<Project> {
    let projectId: string;
    switch (accessAs) {
      case 'backlog':
        const prjByBlk = await this.projectRepository.getByBacklogId(id);
        projectId = prjByBlk.id;
        break;
      case 'iteration':
        const prjByItr = await this.projectRepository.getByBacklogId(id);
        projectId = prjByItr.id;
        break;
      default:
        projectId = id;
        break;
    }

    const prg = await this.programService.getByProjectId(projectId, requester);
    if (!prg) {
      throw new BadRequestException(MESSAGES.common.NOT_EXIST('program'));
    }

    return await this.getById(projectId);
  }

  public async getMembers(project: Project): Promise<Member[]> {
    try {
      return await this.memberService.findByProject(project);
    } catch (error) {
      throw error;
    }
  }

  public async getIterations(project: Project): Promise<Iteration[]> {
    try {
      return await this.iterationService.findByProject(project);
    } catch (error) {
      throw error;
    }
  }

  public _transform(project: Project): TProjectResponse {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      iterations: this.iterationService._transformMulti(project.iterations)
        .previews,
      members: this.memberService._transformMulti(project.members),
      createdAt: project.createdAt,
    };
  }

  public _transformPreview(project: Project): TProjectPreview {
    return {
      id: project.id,
      name: project.name,
    };
  }

  public _transformMulti(
    projects: Project[],
  ): TTransformResult<TProjectResponse, TProjectPreview> {
    const res = {
      previews: [],
      data: [],
    };
    projects?.forEach((prj) => {
      res.data.push(this._transform(prj));
      res.previews.push(this._transformPreview(prj));
    });

    return res;
  }
}
