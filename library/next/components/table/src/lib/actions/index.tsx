import { ModalConfirmDelete } from '@ams/library/next/components/modals';
import { ITableHeader } from '@ams/library/node//types';
import { ActionIcon, Menu, Table, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react';

export function TableAction({
  row,
  h,
  deleteData,
  fetchData,
  showEditModal,
  children: Children,
}: {
  row: Record<string, any>;
  h: ITableHeader;
  deleteData: (id: string) => Promise<void>;
  fetchData: () => Promise<void>;
  showEditModal: (data: any) => void;
  children?: ({ id }: { id: string }) => JSX.Element[];
}) {
  const [showDeleteModal, { close: closeDeleteModal, open: openDeleteModal }] =
    useDisclosure(false);

  const handleDeleteData = async (): Promise<void> => {
    await deleteData(row.ID);
    await fetchData();
  };

  const handleShowEditModal = (): void => {
    showEditModal(row);
  };

  return (
    <>
      <ModalConfirmDelete
        opened={showDeleteModal}
        close={closeDeleteModal}
        deleteData={handleDeleteData}
      />
      <Table.Td key={`${row.ID}-${h.value}`}>
        <Menu
          withArrow
          transitionProps={{
            transition: 'rotate-right',
            duration: 150,
          }}
          shadow="md"
        >
          <Menu.Target>
            <ActionIcon variant="light" size="sm" aria-label="actions">
              <IconDots style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              onClick={handleShowEditModal}
              leftSection={
                <IconPencil style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Update
            </Menu.Item>

            {Children && <Children id={row.ID} />}

            <Menu.Divider />

            <Menu.Label>Danger</Menu.Label>

            <Menu.Item
              onClick={openDeleteModal}
              leftSection={
                <IconTrash
                  color="red"
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </>
  );
}
