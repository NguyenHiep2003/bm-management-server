export interface IResponse {
  status: ResponseStatus;
  data?: any;
  message?: string;
}
export enum ResponseStatus {
  SUCCESS = 'Success',
  FAIL = 'Fail',
  ERROR = 'Error',
}
