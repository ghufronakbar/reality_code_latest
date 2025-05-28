export interface Api<T = undefined> {
  status: number;
  message: string;
  data: T;
}
