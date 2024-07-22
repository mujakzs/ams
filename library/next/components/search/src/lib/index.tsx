import { TextInput, rem, Grid } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { ChangeEvent, useCallback, useState } from 'react';

export function SearchInput({
  queryParams,
  fetchData,
}: {
  queryParams: Record<string, any>;
  fetchData: () => Promise<void>;
}) {
  const [input, setInput] = useState('');

  const handleChange = (e: ChangeEvent): void => {
    const target = e.target as any & {
      value: string;
    };
    setInput(target.value);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (queryParams.name !== undefined) {
          queryParams['name'] = input;
          (async () => {
            await fetchData();
          })();
        }
      }
    },
    [input]
  );

  return (
    <Grid>
      <Grid.Col>
        <TextInput
          radius="xl"
          size="md"
          placeholder="Search"
          rightSectionWidth={42}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          leftSection={
            <IconSearch
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
        />
      </Grid.Col>
    </Grid>
  );
}
