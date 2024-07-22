export interface IGetRole {
  id: string;
  role_name: string;
  updated_at: string;
}

export interface IGetRolesReponse {
  data: IGetRole[];
}

export interface IGetRoleSelect {
  value: string;
  label: string;
}


