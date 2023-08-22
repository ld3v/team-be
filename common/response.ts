import { TPaginationResult } from 'src/app/datasource/repositories';

export default class ResponseObject {
  public static success<T>(data: T, message?: string): TResponseObject<T> {
    return {
      isSuccess: true,
      data,
      message,
    };
  }

  public static pagination<T>(
    data: T[],
    total: number,
    message?: string,
  ): TResponseObject<TPaginationResult<T>> {
    return {
      isSuccess: true,
      data: {
        items: data,
        total,
      },
      message,
    };
  }

  public static fail<T>(
    message: string,
    data?: Record<string, any>,
  ): TResponseObject<T> {
    return {
      isSuccess: false,
      error: data,
      message,
    };
  }
}

export type TResponseObject<T> =
  | {
      isSuccess: true;
      data: T;
      message?: string;
    }
  | {
      isSuccess: false;
      error?: Record<string, any>;
      message: string;
    };
