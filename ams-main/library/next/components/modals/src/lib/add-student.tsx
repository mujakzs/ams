import { readLocalStorageValue, useDisclosure } from '@mantine/hooks';
import {
  Modal,
  Button,
  FocusTrap,
  TextInput,
  Input,
  PasswordInput,
  Select,
  Group,
} from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import {
  IGetRolesReponse,
  IGetRoleSelect,
  IGetRole,
  ICreateEmployeeInput,
  INotificationTitles,
  INotificationMessages,
} from '@ams/library/node//types';
import { useEffect, useState } from 'react';
import {
  loadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from '@ams/library/next/components/toasts';

export function ModalAddEmployee({ toogle }: { toogle: () => any }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = readLocalStorageValue({ key: 'token' });

  const [opened, { open, close }] = useDisclosure(true);
  const [roleSelect, setRolesSelect] = useState<IGetRoleSelect[]>([]);

  function onClose() {
    toogle();
    close();
  }

  function mutateRoles(data: IGetRole[]): void {
    function capitalizeFirstLetter(str: string) {
      if (str.length === 0) {
        return str;
      }

      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const tmp: IGetRoleSelect[] = [];
    data.forEach((e) => {
      tmp.push({
        value: e.id,
        label: capitalizeFirstLetter(e.role_name),
      });
    });
    setRolesSelect(tmp);
  }

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      rePassword: '',
      roleId: 0,
    },
  });

  const getRoles = async (): Promise<void> => {
    const data = await fetch(`${apiUrl}/roles`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.ok) {
      // success
      const res = (await data.json()) as IGetRolesReponse;
      mutateRoles(res.data);
    }

    // error
    return;
  };

  const addEmployee = async (values: ICreateEmployeeInput): Promise<void> => {
    const id = loadingNotification(
      INotificationTitles.LOADING,
      INotificationMessages.POST_LOADING
    );

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // change to int
    values.roleId = parseInt(values.roleId.toString(), 10);

    const data = await fetch(`${apiUrl}/employees`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (data.ok) {
      // success
      const status = data.status;
      if (status === 201) {
        updateSuccessNotification(
          id,
          INotificationTitles.SUCCESSFUL,
          INotificationMessages.CREATE_EMPLOYEE_SUCCESSFUL
        );
        onClose();
      }

      return;
    }

    // error
    const errorMsg = await data.text();
    updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);
  };

  useEffect(() => {
    (async () => {
      await getRoles();
    })();
  }, []);

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        withCloseButton={false}
        title={'Add Employee'}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (form.isDirty()) {
              form.resetDirty();
              addEmployee(values);
            }
          })}
        >
          <FocusTrap.InitialFocus />
          <TextInput
            data-autofocus
            placeholder="First name"
            mt="md"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            data-autofocus
            placeholder="Last name"
            mt="md"
            {...form.getInputProps('lastName')}
          />
          <Input
            placeholder="Email"
            leftSection={<IconAt size={16} />}
            mt="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            placeholder="Password"
            mt="md"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            placeholder="Re enter password"
            mt="md"
            {...form.getInputProps('rePassword')}
          />
          <Select
            data={roleSelect}
            mt="md"
            placeholder="Select role"
            {...form.getInputProps('roleId')}
          />

          <Group justify="flex-end" mt="lg">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
