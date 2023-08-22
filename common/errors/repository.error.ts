export default class RepositoryError extends Error {
  name = 'RepositoryError';

  constructor(message: string, repositoryName?: string) {
    super(message);
    this.name = repositoryName ? `${repositoryName}Error` : this.name;
  }
}
