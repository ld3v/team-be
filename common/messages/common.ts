type TModule =
  | 'program'
  | 'project'
  | 'iteration'
  | 'backlog'
  | 'task'
  | 'account';

const COMMON_MESSAGES = {
  NOT_EXIST: (module: TModule) =>
    `This ${module} is not exist, or you have no permission to access it!`,
};

export default COMMON_MESSAGES;
