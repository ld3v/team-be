import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  IProgramRepository,
  I_PROGRAM_REPOSITORY,
} from 'src/app/datasource/interfaces';
import {
  IProgramResponse,
  IProgramService,
  TProgramPreview,
} from './interfaces';
import { CreateProgramDTO } from './dto';
import { Account, Program } from 'src/app/datasource/entities';
import ServiceError from 'common/errors/service.error';
import { IProjectService, I_PROJECT_SERVICE } from 'src/project/interfaces';
import { IAccountService, I_ACCOUNT_SERVICE } from 'src/account/interfaces';
import {
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
} from 'src/app/datasource/repositories';
import { TTransformResult } from 'src/app/interfaces/transform';

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
      return await this.programRepository.create({
        ...data,
        members: [account],
      });
    } catch (error) {
      throw new ServiceError(error.message, ProgramService.name);
    }
  }

  public async search(
    requester: Account,
    searchOptions: TSearchOptions,
    paginationOptions: TPaginationOptions,
  ): Promise<TPaginationResult<Program>> {
    try {
      return await this.programRepository.getPrograms(
        searchOptions,
        paginationOptions,
        requester,
      );
    } catch (error) {
      throw new ServiceError(error.message, ProgramService.name);
    }
  }

  public async getById(id: string, requester: Account): Promise<Program> {
    try {
      return await this.programRepository.getProgramById(id, requester);
    } catch (error) {
      throw new ServiceError(error.message, ProgramService.name);
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
    programs.forEach((prg) => {
      res.previews.push(this._transformPreview(prg));
      res.data.push(this._transform(prg));
    });
    return res;
  }
}
