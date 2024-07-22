import {
  ActionIcon,
  Container,
  Group,
  Table,
  rem,
  Tooltip,
  Menu,
} from '@mantine/core';
import { IDataTableProp } from '@ams/library/node//types';
import { formatTimestamp } from 'library/node/friendly-time-stamp/src/lib';
import { SearchInput } from '@ams/library/next/components/search';
import { Paginator } from '@ams/library/next/components/pagination';
import {
  IconPhoto,
  IconPlus,
  IconDots,
  IconSettings,
  IconMessageCircle,
} from '@tabler/icons-react';
import { TableAction } from './actions';

export function DataTable(props: IDataTableProp) {
  const {
    data,
    pageInfo,
    headers,
    pageSize,
    queryParams,
    fetchData,
    showAddModal,
    deleteData,
    showEditModal,
  } = props;

  const rows = data.map((row) => (
    <Table.Tr key={row.ID}>
      {headers.map((h) => {
        let header: React.ReactNode;
        switch (h.value) {
          case 'UpdatedAt':
            header = (
              <Table.Td key={`${row.ID}-${h.value}`}>
                {formatTimestamp(row[h.value])}
              </Table.Td>
            );
            break;
          case 'Actions':
            header = (
              <TableAction
                key={row.ID}
                row={row}
                h={h}
                deleteData={deleteData}
                fetchData={fetchData}
                showEditModal={showEditModal}
                children={h.children}
              />
            );
            break;

          default:
            header = (
              <Table.Td key={`${row.ID}-${h.value}`}>{row[h.value]}</Table.Td>
            );
            break;
        }
        return header;
      })}
    </Table.Tr>
  ));

  const containerProps = {
    fluid: true,
    mt: 'md',
  };

  return (
    <Container {...containerProps}>
      <Group justify="space-between" mb={rem(20)}>
        <SearchInput queryParams={queryParams} fetchData={fetchData} />

        <Tooltip label="Add">
          <ActionIcon onClick={showAddModal}>
            <IconPlus size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Table striped highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {headers.map((data) => {
              return <Table.Th key={data.value}>{data.label}</Table.Th>;
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Paginator
        pageSize={pageSize}
        pageInfo={pageInfo}
        fetchData={fetchData}
        queryParams={queryParams}
      />
    </Container>
  );
}
