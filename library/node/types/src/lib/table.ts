export interface ITableHeader {
  label: string;
  value: string;
  children?: ({ id }: { id: string }) => JSX.Element[];
}

export interface IPageInfo {
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface IDataTableProp {
  headers: ITableHeader[];
  data: Record<string, any>[];
  pageInfo: IPageInfo;
  queryParams: Record<string, any>;
  pageSize: string[];
  fetchData: () => Promise<void>;
  showAddModal: () => any;
  deleteData: (id: string) => Promise<void>;
  showEditModal: (data: any) => void;
}
