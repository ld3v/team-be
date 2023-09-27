import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
  IProgramRepository,
  I_PROGRAM_REPOSITORY,
  Account,
  Program,
} from '@ld3v/nqh-shared';
import {
  IProgramResponse,
  IProgramService,
  TProgramPreview,
} from './interfaces';
import { CreateProgramDTO } from './dto';
import { IProjectService, I_PROJECT_SERVICE } from 'src/project/interfaces';
import { IAccountService, I_ACCOUNT_SERVICE } from 'src/account/interfaces';
import { TTransformResult } from 'src/app/interfaces/transform';
import MESSAGES from 'common/messages';

@Injectable()
export class ProgramService implements IProgramService {
  constructor(
    @Inject(I_PROGRAM_REPOSITORY)
    private readonly programRepository: IProgramRepository,
    @Inject(forwardRef(() => I_PROJECT_SERVICE))
    private readonly projectService: IProjectService,
    @Inject(I_ACCOUNT_SERVICE)
    private readonly accountService: IAccountService,
  ) {}

  public async create(
    data: CreateProgramDTO,
    account: Account,
  ): Promise<Program> {
    try {
      const newItem = await this.programRepository.create({
        ...data,
        members: [account],
      });
      return await this.getById(newItem.id);
    } catch (error) {
      throw error;
    }
  }

  public async search(
    searchOptions: TSearchOptions,
    paginationOptions: TPaginationOptions,
    requester?: Account,
  ): Promise<TPaginationResult<Program>> {
    try {
      return await this.programRepository.getItems(
        searchOptions,
        paginationOptions,
        requester,
      );
    } catch (error) {
      throw error;
    }
  }

  public async getById(
    id: string,
    requester?: Account,
    throwErrIfNotFound = false,
  ): Promise<Program> {
    try {
      const program = await this.programRepository.getById(id, requester);
      if (!program && throwErrIfNotFound) {
        throw new BadRequestException(MESSAGES.common.NOT_EXIST('program'));
      }
      return program;
    } catch (error) {
      throw error;
    }
  }

  public async getByProjectId(
    projectId: string,
    requester: Account,
  ): Promise<Program> {
    try {
      const program = await this.programRepository.getByProjectId(
        projectId,
        requester,
      );
      return program;
    } catch (error) {
      throw error;
    }
  }

  public _transform(program: Program): IProgramResponse {
    if (program === undefined) return undefined;
    const data = {
      ...program,
      members: this.accountService._transformMulti(program.members).previews,
      participants: this.accountService._transformMulti(program.participants)
        .previews,
      projects: this.projectService._transformMulti(program.projects).previews,
    };

    return data;
  }

  public _transformPreview(program: Program): TProgramPreview {
    return {
      id: program.id,
      name: program.name,
      description: program.description,
      countMembers: program.members?.length,
      countParticipants: program.participants?.length,
      countProjects: program.projects?.length,
    };
  }

  public _transformMulti(
    programs: Program[],
  ): TTransformResult<IProgramResponse, TProgramPreview> {
    const res = {
      previews: [],
      data: [],
    };
    programs?.forEach((prg) => {
      res.previews.push(this._transformPreview(prg));
      res.data.push(this._transform(prg));
    });
    return res;
  }
}
