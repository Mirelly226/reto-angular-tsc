export interface IApiResponse<T> {
  data: T;
}

export interface IApiListResponse<T> {
  data: T[];
}

export interface IApiMessageResponse<T> {
  message: string;
  data: T;
}

export interface IApiDeleteResponse {
  message: string;
}

export interface IApiError {
  name: string;
  message: string;
  errors?: Record<string, string[]>;
}
