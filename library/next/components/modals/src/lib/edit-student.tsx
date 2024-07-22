import {
  loadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from '@ams/library/next/components/toasts';
import {
  ICreateStudentInput,
  INotificationMessages,
  INotificationTitles,
  IStudent,
} from '@ams/library/node//types';
import { Button, FocusTrap, Group, Modal, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { readLocalStorageValue } from '@mantine/hooks';

export function ModalEditStudent({
  opened,
  close,
  data,
}: {
  opened: boolean;
  close: () => void;
  data: IStudent;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = readLocalStorageValue({ key: 'token' });

  const form = useForm({
    initialValues: {
      firstName: data.FirstName,
      lastName: data.LastName,
      gender: data.Gender,
    },
  });

  const updateStudent = async (values: ICreateStudentInput): Promise<void> => {
    const id = loadingNotification(
      INotificationTitles.LOADING,
      INotificationMessages.POST_LOADING
    );

    const req = await fetch(`${apiUrl}/students/${data.ID}`, {
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
          INotificationMessages.UPDATE_STUDENT_SUCCESSFUL
        );
        close();
      }

      return;
    }

    // error
    const errorMsg = await req.text();
    updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Update" centered>
        <form
          onSubmit={form.onSubmit((values) => {
            if (form.isDirty()) {
              form.resetDirty();
              updateStudent(values);
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

          <Select
            label="Gender"
            placeholder="Please select"
            data={['Male', 'Female']}
            {...form.getInputProps('gender')}
          />

          <Group justify="flex-end" mt="lg">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
