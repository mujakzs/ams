'use client';

import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { rem } from '@mantine/core';
import classes from './style.module.css';

export const loadingNotification = (title: string, message: string): string => {
  return notifications.show({
    loading: true,
    title,
    message,
    autoClose: false,
    withCloseButton: false,
    classNames: classes,
  });
};

export const updateSuccessNotification = (
  id: string,
  title: string,
  message: string
): void => {
  notifications.update({
    id,
    color: 'teal',
    title,
    message,
    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
    loading: false,
    autoClose: 2000,
    classNames: classes,
  });
};

export const updateErrorNotification = (
  id: string,
  title: string,
  message: string
): void => {
  notifications.update({
    id,
    color: 'red',
    title,
    message,
    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
    loading: false,
    autoClose: 2000,
    classNames: classes,

  });
};
