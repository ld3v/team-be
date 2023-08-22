export default class ServiceError extends Error {
  name = `ServiceError`;

  constructor(message: string, serviceName?: string) {
    super(message);
    this.name = serviceName ? `${serviceName}Error` : this.name;
  }
}
