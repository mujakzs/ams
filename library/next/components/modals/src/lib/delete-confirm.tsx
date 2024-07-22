import { Button, Modal, TextInput } from '@mantine/core';
import { useState } from 'react';

export function ModalConfirmDelete({
  deleteData,
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
  deleteData: () => Promise<void>;
}) {
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  async function handleConfirm(): Promise<void> {
    if (confirm === 'confirm') {
      await deleteData();
      close();
    } else {
      setError('Write the word "confirm".');
    }
  }
  return (
    <>
      <Modal opened={opened} onClose={close} title="Confirm" centered>
        <TextInput
          placeholder="Please type confirm"
          data-autofocus
          onChange={(e) => {
            setConfirm(e.target.value);
          }}
          error={error}
        />
        <Button color="red" fullWidth mt="md" onClick={handleConfirm}>
          Delete
        </Button>
      </Modal>
    </>
  );
}
