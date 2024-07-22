import { Group, rem, ActionIcon, Select, Text } from '@mantine/core';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import type { IPageInfo } from '@ams/library/node//types';
import { useEffect, useState } from 'react';

export function Paginator({
  pageSize,
  pageInfo,
  fetchData,
  queryParams,
}: {
  pageSize: string[];
  pageInfo: IPageInfo;
  fetchData: () => Promise<void>;
  queryParams: Record<string, any>;
}) {
  const [value, setValue] = useState<string | null>('');

  const handleNextPage = async (): Promise<void> => {
    if (queryParams.page !== undefined) {
      queryParams.page = pageInfo.currentPage + 1;
      await fetchData();
    }
  };

  const handlePreviousPage = async (): Promise<void> => {
    if (queryParams.page !== undefined) {
      queryParams.page = pageInfo.currentPage - 1;
      await fetchData();
    }
  };

  const handlePageSizeChange = async (value: string): Promise<void> => {
    if (queryParams.limit !== undefined) {
      queryParams.limit = value;
      await fetchData();
    }
  };

  useEffect(() => {
    if (value) {
      if (value !== '') handlePageSizeChange(value);
    }
  }, [value]);
  return (
    <Group justify="flex-end" gap="xs" mt={rem(20)}>
      <Select
        placeholder="Size"
        data={pageSize}
        w={rem(80)}
        defaultValue={pageSize[0]}
        onChange={setValue}
      />
      <ActionIcon
        disabled={!pageInfo.hasPreviousPage}
        onClick={handlePreviousPage}
      >
        <IconArrowLeft size={18} stroke={1.5} />
      </ActionIcon>
      <ActionIcon disabled={!pageInfo.hasNextPage} onClick={handleNextPage}>
        <IconArrowRight size={18} stroke={1.5} />
      </ActionIcon>
      <Text size="md">
        {pageInfo.currentPage} / {pageInfo.totalPages}
      </Text>
    </Group>
  );
}
