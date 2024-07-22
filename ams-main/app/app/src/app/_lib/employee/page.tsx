'use client';

import {
  ModalAddEmployee,
  ModalEditEmployee,
} from '@ams/library/next/components/modals';
import { SEO } from '@ams/library/next/components/seo';
import { DataTable } from '@ams/library/next/components/table';
import {
  loadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from '@ams/library/next/components/toasts';
import {
  INotificationTitles,
  type IGetDefaultQueryParams,
  type IGetEmployeeResponse,
  type ITableHeader,
  INotificationMessages,
  IEmployee,
} from '@ams/library/node//types';
import {
  readLocalStorageValue,
  useDisclosure,
  useToggle,
} from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Text, rem } from '@mantine/core';

export default function Employee() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = readLocalStorageValue({ key: 'token' });

  const [isShowAddModal, toggleShowAddModal] = useToggle<boolean>([
    false,
    true,
  ]);
  const [isShowEditModal, { close: closeEditModal, open: openEditModal }] =
    useDisclosure(false);

  const headers: ITableHeader[] = [
    {
      label: 'Last Updated',
      value: 'UpdatedAt',
    },
    {
      label: 'First Name',
      value: 'FirstName',
    },
    {
      label: 'Last Name',
      value: 'LastName',
    },
    {
      label: 'Email',
      value: 'Email',
    },
    {
      label: 'Actions',
      value: 'Actions',
    },
  ];

  const defaultGetQueryParams: IGetDefaultQueryParams = {
    page: 1,
    limit: 5,
    name: '',
  };
  const pageSize: string[] = ['5', '10', '15', '20'];

  const [employee, setEmployee] = useState<IGetEmployeeResponse>({
    data: [],
    pageInfo: {
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 0,
      totalPages: 0,
    },
  });

  const [updateEmployee, setUpdateEmployee] = useState<IEmployee>();

  const getEmployees = async (): Promise<void> => {
    const data = await fetch(
      `${apiUrl}/employees?page=${defaultGetQueryParams.page}&limit=${defaultGetQueryParams.limit}&name=${defaultGetQueryParams.name}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.ok) {
      // success
      const res = (await data.json()) as IGetEmployeeResponse;
      setEmployee(res);
    }

    // error
    return;
  };

  const deleteEmployee = async (employeeId: string): Promise<void> => {
    const id = loadingNotification(
      INotificationTitles.LOADING,
      INotificationMessages.DELETE_LOADING
    );

    const data = await fetch(`${apiUrl}/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.ok) {
      // success
      const status = data.status;
      if (status === 204) {
        updateSuccessNotification(
          id,
          INotificationTitles.SUCCESSFUL,
          INotificationMessages.DELETE_EMPLOYEE_SUCCESSFUL
        );
      }

      return;
    }

    // error
    const errorMsg = await data.text();
    updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);

    return;
  };

  function popUpModalEditEmployee(data: IEmployee): void {
    setUpdateEmployee(data);
    openEditModal();
  }
  useEffect(() => {
    (async () => {
      await getEmployees();
    })();
  }, []);

  return (
    <>
      <SEO title="Employee | AMS" defaultTitle="Dashboard | AMS" />

      {isShowAddModal && <ModalAddEmployee toogle={toggleShowAddModal} />}
      {isShowEditModal && updateEmployee && (
        <ModalEditEmployee
          opened={isShowEditModal}
          close={closeEditModal}
          data={updateEmployee}
        />
      )}
      <Text c="teal.4" mb={rem(20)}>Employees</Text>
      <DataTable
        {...employee}
        headers={headers}
        queryParams={defaultGetQueryParams}
        pageSize={pageSize}
        fetchData={getEmployees}
        showAddModal={toggleShowAddModal}
        deleteData={deleteEmployee}
        showEditModal={popUpModalEditEmployee}
      />
    </>
  );
}
