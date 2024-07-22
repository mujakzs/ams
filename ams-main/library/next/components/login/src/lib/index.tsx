'use client';

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';

import { useForm } from '@mantine/form';

import type { ILoginProps } from '@ams/library/node//types';
import { ThemeToggle } from '@ams/library/next/components/theme-toggle';
import classes from './style.module.css';

export function Login(props: ILoginProps) {
  const { title, description, buttonText, input, onLogin } = props;

  const form = useForm({
    initialValues: {
      ...input,
    },
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        {title}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {description}{' '}
      </Text>

      <form
        onSubmit={form.onSubmit((values) => {
          if (form.isDirty()) {
            form.resetDirty();
            onLogin(values);
          }
        })}
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email"
            placeholder="you@email.dev"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="lg">
            <ThemeToggle />
            <Button type="submit">{buttonText}</Button>
          </Group>
        </Paper>
      </form>
    </Container>
  );
}
