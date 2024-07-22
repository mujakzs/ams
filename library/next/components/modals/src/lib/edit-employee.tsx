import {
  loadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from '@ams/library/next/components/toasts';
import {
  ICreateEmployeeInput,
  IEmployee,
  IGetRole,
  IGetRoleSelect,
  IGetRolesReponse,
  INotificationMessages,
  INotificationTitles,
} from '@ams/library/node//types';
import {
  Button,
  FocusTrap,
  Group,
  Input,
  Modal,
  PasswordInput,
  Select,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { readLocalStorageValue } from '@mantine/hooks';
import { IconAt } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function ModalEditEmployee({
  opened,
  close,
  data,
}: {
  opened: boolean;
  close: () => void;
  data: IEmployee;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = readLocalStorageValue({ key: 'token' });

  const [roleSelect, setRolesSelect] = useState<IGetRoleSelect[]>([]);

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

  const form = useForm({
    initialValues: {
      firstName: data.FirstName,
      lastName: data.LastName,
      email: data.Email,
      password: '',
      rePassword: '',
      roleId: 0,
    },
  });

  const updateEmployee = async (
    values: ICreateEmployeeInput
  ): Promise<void> => {
    const id = loadingNotification(
      INotificationTitles.LOADING,
      INotificationMessages.POST_LOADING
    );

    // change to int
    values.roleId = parseInt(values.roleId.toString(), 10);

    const req = await fetch(`${apiUrl}/employees/${data.ID}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (req.ok) {
      // success
      const status = req.status;
      if (status === 204) {
        updateSuccessNotification(
          id,
          INotificationTitles.SUCCESSFUL,
          INotificationMessages.UPDATE_EMPLOYEE_SUCCESSFUL
        );
        close();
      }

      return;
    }

    // error
    const errorMsg = await req.text();
    updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);
  };

  useEffect(() => {
    (async () => {
      await getRoles();
    })();
  }, []);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Update" centered>
        <form
          onSubmit={form.onSubmit((values) => {
            if (form.isDirty()) {
              form.resetDirty();
              updateEmployee(values);
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
