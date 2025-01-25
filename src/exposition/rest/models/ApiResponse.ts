export class ApiResponse<T> {
  constructor(
    public readonly data: T,
    public readonly metadata: {
      timestamp: Date;
      path: string;
      version: string;
    }
  ) {}

  static success<T>(data: T, path: string): ApiResponse<T> {
    return new ApiResponse(data, {
      timestamp: new Date(),
      path,
      version: '1.0'
    });
  }

  static error(message: string, path: string): ApiResponse<null> {
    return new ApiResponse(null, {
      timestamp: new Date(),
      path,
      version: '1.0'
    });
  }
}