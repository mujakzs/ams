import { readLocalStorageValue, useDisclosure } from '@mantine/hooks';
import {
  Modal,
  Button,
  FocusTrap,
  TextInput,
  Group,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  INotificationTitles,
  INotificationMessages,
  ICreateStudentInput,
} from '@ams/library/node//types';
import {
  loadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from '@ams/library/next/components/toasts';

export function ModalAddStudent({ toogle }: { toogle: () => any }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = readLocalStorageValue({ key: 'token' });

  const [opened, { open, close }] = useDisclosure(true);

  function onClose() {
    toogle();
    close();
  }

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      gender: '',
    },
  });

  const addStudent = async (values: ICreateStudentInput): Promise<void> => {
    const id = loadingNotification(
      INotificationTitles.LOADING,
      INotificationMessages.POST_LOADING
    );

    const data = await fetch(`${apiUrl}/students`, {
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
          INotificationMessages.CREATE_STUDENT_SUCCESSFUL
        );
        onClose();
      }

      return;
    }

    // error
    const errorMsg = await data.text();
    updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        withCloseButton={false}
        title={'Add Student'}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (form.isDirty()) {
              form.resetDirty();
              addStudent(values);
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
