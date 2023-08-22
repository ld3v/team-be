import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import {
  IProjectResponse,
  IProjectService,
  TProjectPreview,
} from './interfaces';
import {
  Account,
  Iteration,
  Project,
  ProjectMember,
} from 'src/app/datasource/entities';
import { CreateProjectDTO } from './dto';
import {
  IIterationRepository,
  IProjectMemberRepository,
  IProjectRepository,
  I_ITERATION_REPOSITORY,
  I_PROJECT_MEMBER_REPOSITORY,
  I_PROJECT_REPOSITORY,
} from 'src/app/datasource/interfaces';
import { IProgramService, I_PROGRAM_SERVICE } from 'src/program/interfaces';
import {
  TSearchOptions,
  TPaginationOptions,
  TPaginationResult,
} from 'src/app/datasource/repositories';
import MESSAGES from 'common/messages';
import { TTransformResult } from 'src/app/interfaces/transform';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(
    @Inject(I_PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(I_PROJECT_MEMBER_REPOSITORY)
    private readonly memberRepository: IProjectMemberRepository,
    @Inject(I_ITERATION_REPOSITORY)
    private readonly iterationRepository: IIterationRepository,
    @Inject(forwardRef(() => I_PROGRAM_SERVICE))
    private readonly programService: IProgramService,
  ) {}

  public async create(
    data: CreateProjectDTO,
    account: Account,
  ): Promise<Project> {
    try {
      const program = await this.programService.getById(
        data.programId,
        account,
      );
      if (!program) {
        throw new BadRequestException(MESSAGES.program.NOT_EXIST);
      }
      return await this.projectRepository.create({
        ...data,
        program,
      });
    } catch (error) {
      throw error;
    }
  }

  public async search(
    programId: string,
    requester: Account,
    searchOptions: TSearchOptions,
    paginationOptions: TPaginationOptions,
  ): Promise<TPaginationResult<Project>> {
    try {
      const program = await this.programService.getById(programId, requester);
      if (!program) {
        throw new BadRequestException(MESSAGES.program.NOT_EXIST);
      }
      return await this.projectRepository.getProjects(
        programId,
        requester,
        searchOptions,
        paginationOptions,
      );
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string, requester: Account): Promise<Project> {
    try {
      return await this.projectRepository.getProjectById(id, requester);
    } catch (error) {
      throw error;
    }
  }

  public async getMemberByAccount(
    id: string,
    requester: Account,
  ): Promise<ProjectMember> {
    try {
      return await this.memberRepository.getMemberByAccount(id, requester);
    } catch (error) {
      throw error;
    }
  }

  public async getIterationsById(
    requester: ProjectMember,
  ): Promise<Iteration[]> {
    try {
      return await this.iterationRepository.getIterations(requester);
    } catch (error) {
      throw error;
    }
  }

  public _transform(project: Project): IProjectResponse {
    if (project === undefined) return undefined;
    const data = {
      ...project,
      programId: project.program?.id || undefined,
    };
    delete data.program;

    return data;
  }

  public _transformPreview(project: Project): TProjectPreview {
    return {
      id: project.id,
      name: project.name,
      // iterations: project.iterations,
    };
  }

  public _transformMulti(
    projects: Project[],
  ): TTransformResult<IProjectResponse, TProjectPreview> {
    const res = {
      previews: [],
      data: [],
    };
    projects.forEach((prj) => {
      res.data.push(this._transform(prj));
      res.previews.push(this._transformPreview(prj));
    });

    return res;
  }
}
