export class FailResult {
  public message: string;
  constructor(message: string) {
    this.message = message;
  }
}
export class EntityNotFound extends FailResult {}
export class UpdateFail extends FailResult {}
export class CreateFail extends FailResult {}
