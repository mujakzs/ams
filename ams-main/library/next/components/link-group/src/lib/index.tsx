'use client';

import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core';
import {  IconChevronRight } from '@tabler/icons-react';
import classes from './style.module.css';
import { IDashboardLinks } from '@ams/library/node//types';

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  view,
  setView,
}: IDashboardLinks & {
  setView: Dispatch<SetStateAction<ReactNode>>;
}) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const items = (hasLinks ? links : []).map((link) => (
    <Text<'a'>
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(e) => {
        e.preventDefault();
        setView(link.view);
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => {
          if (view) setView(view);
          setOpened((o) => !o);
        }}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

export function NavLinkGroup({
  nav,
  setView,
}: {
  nav: IDashboardLinks[];
  setView: Dispatch<SetStateAction<ReactNode>>;
}) {
  return (
    <>
      {nav.map((data, index) => {
        return <LinksGroup key={index} {...data} setView={setView} />;
      })}
    </>
  );
}
