class ApiResponse<T = unknown> {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly data: T;
  public readonly message: string;
  public readonly meta: unknown | null;

  constructor(
    statusCode: number,
    data: T,
    message: string = "Success",
    meta: unknown | null = null,
  ) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.data = data;
    this.message = message;
    this.meta = meta;
  }
}

export default ApiResponse;
