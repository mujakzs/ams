'use client';

import {
  ActionIcon,
  Button,
  Container,
  Group,
  Modal,
  NumberInput,
  Skeleton,
  Table,
  Text,
  Tooltip,
  rem,
} from '@mantine/core';
import { useState } from 'react';
import { formatTimestamp } from 'library/node/friendly-time-stamp/src/lib';
import {
  IconFileExport,
  IconPencil,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import {
  readLocalStorageValue,
  useDisclosure,
  useLocalStorage,
} from '@mantine/hooks';
import {
  IGetDetailsResponse,
  IGetEmployeeResponse,
  INotificationMessages,
  INotificationTitles,
  IStudentDetails,
} from '@ams/library/node//types';
import * as XLSX from 'xlsx';
import styles from './style.module.css';
import { ModalConfirmDelete } from '@ams/library/next/components/modals';
import {
  loadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from '@ams/library/next/components/toasts';

export default function ExportDetails() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = readLocalStorageValue({ key: 'token' });
  const [opened, { open, close }] = useDisclosure(false);
  const [openConfirm, { open: openConfirmModal, close: closeConfirmModal }] =
    useDisclosure(false);
  const [selected, setSelected] = useState<IStudentDetails>({
    ID: 0,
    CreatedAt: '',
    UpdatedAt: '',
    DeletedAt: '',
    StudentId: 0,
    HeightStanding: 0,
    EyeHeight: 0,
    ShoulderHeight: 0,
    ElbowHeight: 0,
    KneeHeight: 0,
    SittingHeight: 0,
    VerticalReachHeight: 0,
    Weight: 0,
    Bmi: 0,
  });
  const [_, setDetails, removeDetails] = useLocalStorage({
    key: 'details_update',
  });

  const [limit, setLimit] = useState(10);
  const [name, setName] = useState<{
    FirstName: string;
    LastName: string;
    Gender: string;
  }>({
    FirstName: '-----',
    LastName: '-----',
    Gender: '-----',
  });

  const [tableData, setTableData] = useState<IStudentDetails[]>([]);

  const fetchDetails = async (): Promise<void> => {
    const tmpId = searchParams.get('studentId');
    const buffId = tmpId ? Buffer.from(tmpId, 'hex') : 0;
    const studentId = buffId.toString();

    const data = await fetch(
      `${apiUrl}/students/details/${studentId}?limit=${limit}`,
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
      const res = (await data.json()) as IGetDetailsResponse;
      const { FirstName, LastName, Gender } = res.student;
      setName({
        FirstName,
        LastName,
        Gender,
      });

      setLoading(false);
      setTableData(res.data);
    }

    // error
    return;
  };

  const deleteStudentDetail = async (): Promise<void> => {
    const id = loadingNotification(
      INotificationTitles.LOADING,
      INotificationMessages.DELETE_LOADING
    );

    const data = await fetch(`${apiUrl}/students/details/${selected.ID}`, {
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
          INotificationMessages.DELETE_STUDENT_DETAIL_SUCCESSFUL
        );
      }

      return;
    }

    // error
    const errorMsg = await data.text();
    updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);

    return;
  };

  function getCurrentDateTimeString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDateTime = `${month}-${day}-${year}-${hours}-${minutes}`;
    return formattedDateTime;
  }

  const handleExport = () => {
    const details = tableData.map((data) => {
      return [
        formatTimestamp(data.UpdatedAt),
        data.HeightStanding,
        data.EyeHeight,
        data.ShoulderHeight,
        data.ElbowHeight,
        data.KneeHeight,
        data.SittingHeight,
        data.VerticalReachHeight,
        data.Weight,
        data.Bmi,
      ];
    });

    const wb = XLSX.utils.book_new();

    const data = [
      ['First Name', 'Last Name', 'Gender'],
      [name.FirstName, name.LastName, name.Gender],
      [],
      [],
      [],
      [
        'Date Taken',
        'Height Standing',
        'Eye Height',
        'Shoulder Height',
        'Elbow Height',
        'Knee Height',
        'Sitting Height',
        'Vertical Reach',
        'Weight',
        'BMI',
      ],
      ...details,
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(
      wb,
      `${name.FirstName}-${name.LastName}-${getCurrentDateTimeString()}.xlsx`
    );
  };

  return (
    <>
      <Modal
        title={'Choose'}
        opened={opened}
        onClose={close}
        withCloseButton={false}
      >
        <Group align="flex-end" justify="space-around">
          <Tooltip label={'Update'} withArrow>
            <ActionIcon
              size={'xl'}
              autoContrast
              color="teal.4"
              onClick={() => {
                setDetails(JSON.stringify(selected));
                window.open('/anthropometic?update=true', '_blank');
              }}
            >
              <IconPencil style={{ width: rem(25), height: rem(25) }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Delete'} withArrow>
            <ActionIcon
              size={'xl'}
              autoContrast
              color="red.4"
              onClick={() => {
                close();
                openConfirmModal();
              }}
            >
              <IconTrash style={{ width: rem(25), height: rem(25) }} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Modal>
      <ModalConfirmDelete
        deleteData={deleteStudentDetail}
        opened={openConfirm}
        close={closeConfirmModal}
      />
      <Container fluid p={20} my={rem(120)}>
        <Group align={'flex-end'} justify={'space-between'} mb={rem(20)}>
          <Group justify={'space-between'}>
            <NumberInput
              placeholder="Get latest 10 record (max 20)"
              min={10}
              max={20}
              mr={rem(30)}
              startValue={10}
              w={rem(250)}
              defaultValue={limit}
              onChange={(e) => {
                setLimit(parseInt(e.toString(), 10));
              }}
            />
            <Tooltip label={'Load'}>
              <ActionIcon autoContrast color="teal.4" onClick={fetchDetails}>
                <IconRefresh style={{ width: rem(14), height: rem(14) }} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <Group align={'flex-end'} justify={'space-between'} mb={rem(20)}>
          <Group>
            <strong>Student name:</strong>
            <Text size="lg" fw={500}>
              {name.FirstName} {name.LastName}
            </Text>
          </Group>

          <Group justify="flex-end">
            <Tooltip label={'Export'}>
              <ActionIcon autoContrast color="teal.4" onClick={handleExport}>
                <IconFileExport style={{ width: rem(14), height: rem(14) }} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <Skeleton visible={loading}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Last Updated</Table.Th>
                <Table.Th>Standing Height (cm)</Table.Th>
                <Table.Th>Eye Height (cm)</Table.Th>
                <Table.Th>Shoulder Height (cm)</Table.Th>
                <Table.Th>Elbow Height (cm)</Table.Th>
                <Table.Th>Knee Height (cm)</Table.Th>
                <Table.Th>Sitting Height (cm)</Table.Th>
                <Table.Th>Vertical Reach Height (cm)</Table.Th>
                <Table.Th>Weight (kg)</Table.Th>
                <Table.Th>BMI (kg/m2)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tableData &&
                tableData.map((e) => {
                  return (
                    <Table.Tr
                      key={e.ID}
                      onClick={() => {
                        open();
                        setSelected(e);
                      }}
                      className={styles.tableRow}
                    >
                      <Table.Td>{formatTimestamp(e.UpdatedAt)}</Table.Td>
                      <Table.Td>{e.HeightStanding}</Table.Td>
                      <Table.Td>{e.EyeHeight}</Table.Td>
                      <Table.Td>{e.ShoulderHeight}</Table.Td>
                      <Table.Td>{e.ElbowHeight}</Table.Td>
                      <Table.Td>{e.KneeHeight}</Table.Td>
                      <Table.Td>{e.SittingHeight}</Table.Td>
                      <Table.Td>{e.VerticalReachHeight}</Table.Td>
                      <Table.Td>{e.Weight}</Table.Td>
                      <Table.Td>{e.Bmi}</Table.Td>
                    </Table.Tr>
                  );
                })}
            </Table.Tbody>
          </Table>
        </Skeleton>
      </Container>
    </>
  );
}
