import { IPageInfo } from './table';

export interface IStudent {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  FirstName: string;
  LastName: string;
  Gender: string;
}

export interface IGetStudentsResponse {
  data: IStudent[];
  pageInfo: IPageInfo;
}

// same input with update
export interface ICreateStudentInput {
  firstName: string;
  lastName: string;
}

export interface IStudentDetails {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  StudentId: number;
  HeightStanding: number;
  EyeHeight: number;
  ShoulderHeight: number;
  ElbowHeight: number;
  KneeHeight: number;
  SittingHeight: number;
  VerticalReachHeight: number;
  Weight: number;
  Bmi: number;
}
export interface IGetDetailsResponse {
  student: IStudent;
  data: IStudentDetails[];
}
