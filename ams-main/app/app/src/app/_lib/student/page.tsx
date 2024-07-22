'use client';

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
  type ITableHeader,
  INotificationMessages,
  IGetStudentsResponse,
  IStudent,
} from '@ams/library/node//types';
import {
  readLocalStorageValue,
  useDisclosure,
  useToggle,
} from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Menu, Text, rem } from '@mantine/core';
import {
  ModalAddStudent,
  ModalEditStudent,
} from '@ams/library/next/components/modals';
import { IconFileExport, IconScaleOutline } from '@tabler/icons-react';

export default function Student() {
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
      label: 'Gender',
      value: 'Gender',
    },
    {
      label: 'Actions',
      value: 'Actions',
      children: ({ id }: { id: string }): JSX.Element[] => {
        const menuItems = [
          {
            text: 'Anthropometric',
            icon: (
              <IconScaleOutline style={{ width: rem(14), height: rem(14) }} />
            ),
            path: '/anthropometic',
          },
          {
            text: 'Export',
            icon: (
              <IconFileExport style={{ width: rem(14), height: rem(14) }} />
            ),
            path: '/export',
          },
        ];

        return menuItems.map((item) => (
          <Menu.Item
            key={item.text}
            onClick={() => {
              const buf = Buffer.from(id.toString(), 'utf8');
              const encodedStudentId = buf.toString('hex');
              window.open(
                `${item.path}?studentId=${encodedStudentId}`,
                '_blank'
              );
            }}
            leftSection={item.icon}
          >
            {item.text}
          </Menu.Item>
        ));
      },
    },
  ];

  const defaultGetQueryParams: IGetDefaultQueryParams = {
    page: 1,
    limit: 5,
    name: '',
  };

  const pageSize: string[] = ['5', '10', '15', '20'];

  const [students, setStudents] = useState<IGetStudentsResponse>({
    data: [],
    pageInfo: {
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 0,
      totalPages: 0,
    },
  });

  const [updateStudent, setUpdateStudent] = useState<IStudent>();

  const getStudents = async (): Promise<void> => {
    const data = await fetch(
      `${apiUrl}/students?page=${defaultGetQueryParams.page}&limit=${defaultGetQueryParams.limit}&name=${defaultGetQueryParams.name}`,
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
      const res = (await data.json()) as IGetStudentsResponse;
      setStudents(res);
    }

    // error
    return;
  };

  const deleteStudent = async (studentId: string): Promise<void> => {
    const id = loadingNotification(
      INotificationTitles.LOADING,
      INotificationMessages.DELETE_LOADING
    );

    const data = await fetch(`${apiUrl}/students/${studentId}`, {
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
          INotificationMessages.DELETE_STUDENT_SUCCESSFUL
        );
      }

      return;
    }

    // error
    const errorMsg = await data.text();
    updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);

    return;
  };

  function popUpModalEditStudent(data: IStudent): void {
    setUpdateStudent(data);
    openEditModal();
  }

  useEffect(() => {
    (async () => {
      await getStudents();
    })();
  }, []);

  return (
    <>
      <SEO title="Students | AMS" defaultTitle="Dashboard | AMS" />

      {isShowAddModal && <ModalAddStudent toogle={toggleShowAddModal} />}
      {isShowEditModal && updateStudent && (
        <ModalEditStudent
          opened={isShowEditModal}
          close={closeEditModal}
          data={updateStudent}
        />
      )}

      <Text c="teal.4" mb={rem(20)}>
        Students
      </Text>
      <DataTable
        {...students}
        headers={headers}
        queryParams={defaultGetQueryParams}
        pageSize={pageSize}
        fetchData={getStudents}
        showAddModal={toggleShowAddModal}
        deleteData={deleteStudent}
        showEditModal={popUpModalEditStudent}
      />
    </>
  );
}
