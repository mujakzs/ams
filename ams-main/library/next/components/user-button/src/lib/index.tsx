'use client';

import { UnstyledButton, Group, Avatar, Text, rem, Menu } from '@mantine/core';
import { IconArrowBack, IconChevronRight } from '@tabler/icons-react';
import { IUserDetails } from '@ams/library/node//types';
import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';

function getFirstLetters(firstName: string, lastName: string): string {
  const first = firstName.charAt(0).toUpperCase();
  const second = lastName.charAt(0).toUpperCase();
  return first + second;
}

const UserButton = forwardRef<HTMLButtonElement, IUserDetails>(
  ({ firstName, lastName, email, ...others }: IUserDetails, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        padding: 'var(--mantine-spacing-md)',
        color: 'var(--mantine-color-text)',
        borderRadius: 'var(--mantine-radius-sm)',
      }}
      {...others}
    >
      <Group>
        <Avatar color="blue" radius="xl">
          {getFirstLetters(firstName, lastName)}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {firstName} {lastName}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {<IconChevronRight size="1rem" />}
      </Group>
    </UnstyledButton>
  )
);

export function UserButtonMenu({ user }: { user: IUserDetails }) {
  const router = useRouter();

  function handleLogout(): void {
    localStorage.removeItem('token');
    router.push('/');
  }

  return (
    <Menu withArrow position="right-end">
      <Menu.Target>
        <UserButton {...user} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

        <Menu.Item
          color="red"
          leftSection={
            <IconArrowBack style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
