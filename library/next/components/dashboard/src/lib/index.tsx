'use client';

import {
  LinksGroup,
  NavLinkGroup,
} from '@ams/library/next/components/link-group';
import { ThemeToggle } from '@ams/library/next/components/theme-toggle';
import { UserButtonMenu } from '@ams/library/next/components/user-button';
import { IDashboardLinks, IUserDetails } from '@ams/library/node//types';
import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Image,
  rem,
  Text,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { readLocalStorageValue } from '@mantine/hooks';
import { IconArrowBack } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavDashboard({ nav }: { nav: IDashboardLinks[] }) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  const [user, setUser] = useState<IUserDetails | null>(null);
  const token = readLocalStorageValue({ key: 'token' });
  const [view, setView] = useState<React.ReactNode>();

  const getUserDetails = async (): Promise<IUserDetails | null> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const data = await fetch(`${apiUrl}/me`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.ok) {
      // success
      const res = (await data.json()) as IUserDetails;
      return res;
    }

    // error
    router.push('/');
    return null;
  };

  useEffect(() => {
    (async () => {
      const data = await getUserDetails();
      setUser(data);
    })();
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Image
              src={'http://localhost:4000/images/ams/nddu.png'}
              h={rem(50)}
              alt={'logo'}
            />
            <Text fw={700}>AMS</Text>
          </Group>
          <Group justify="flex-end">
            <ThemeToggle />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow my="md" component={ScrollArea}>
          {nav && <NavLinkGroup nav={nav} setView={setView} />}
        </AppShell.Section>
        <AppShell.Section>
          {user && <UserButtonMenu user={user} />}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{view}</AppShell.Main>
    </AppShell>
  );
}
