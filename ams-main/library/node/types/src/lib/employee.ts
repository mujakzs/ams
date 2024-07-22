import { IPageInfo } from './table';

export interface IEmployee {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  FirstName: string;
  LastName: string;
  Email: string;
}

export interface IGetEmployeeResponse {
  data: IEmployee[];
  pageInfo: IPageInfo;
}

// same 
export interface IGetDefaultQueryParams {
  page: number;
  limit: number;
  name: string;
}

// same input during update
export interface ICreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
  roleId: number;
}
