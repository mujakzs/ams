'use client';

import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  NumberInput,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
  rem,
} from '@mantine/core';
import { IconHandFinger, IconHandStop } from '@tabler/icons-react';
import classes from './style.module.css';
import { useForm } from '@mantine/form';
import {
  ICreateStudentDetailsInput,
  INotificationMessages,
  INotificationTitles,
  IStudentDetails,
} from '@ams/library/node//types';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  loadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from '@ams/library/next/components/toasts';
import { readLocalStorageValue } from '@mantine/hooks';

// Connect to the WebSocket server

export default function Anthropometric() {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const weightManual = process.env.NEXT_PUBLIC_WEIGHT_MANUAL || 'false';
  const [wss, setWs] = useState<WebSocket | null>(null);
  const [checkManualWeight, _] = useState<boolean>(weightManual === 'true');

  const [nowMeasure, setNowMeasure] = useState<string>('');
  const searchParams = useSearchParams();
  const token = readLocalStorageValue({ key: 'token' });
  const details = readLocalStorageValue({
    key: 'details_update',
    serialize: JSON.stringify,
  });

  const [toUpdate, settoUpdate] = useState<IStudentDetails>({
    ID: 0,
    CreatedAt: '',
    UpdatedAt: '',
    DeletedAt: '',
    StudentId: 0,
    HeightStanding: 0,
    EyeHeight: 0,
    ShoulderHeight: 0,
    ElbowHeight: 0,
    KneeHeight: 0,
    SittingHeight: 0,
    VerticalReachHeight: 0,
    Weight: 0,
    Bmi: 0,
  });

  const input: ICreateStudentDetailsInput = {
    heightStanding: 0,
    eyeHeight: 0,
    shoulderHeight: 0,
    elbowHeight: 0,
    kneeHeight: 0,
    sittingHeight: 0,
    verticalReachHeight: 0,
    weight: 0,
    bmi: 0,
  };

  const form = useForm({
    initialValues: {
      ...input,
    },
  });

  const data = [
    {
      title: 'Standing Height',
      key: 'heightStanding',
      value: form.values.heightStanding,
    },
    {
      title: 'Eye Height',
      key: 'eyeHeight',
      value: form.values.eyeHeight,
    },
    {
      title: 'Shoulder Height',
      key: 'shoulderHeight',
      value: form.values.shoulderHeight,
    },
    {
      title: 'Elbow Height',
      key: 'elbowHeight',
      value: form.values.elbowHeight,
    },
    {
      title: 'Knee Height',
      key: 'kneeHeight',
      value: form.values.kneeHeight,
    },
    {
      title: 'Sitting Height',
      key: 'sittingHeight',
      value: form.values.sittingHeight,
    },
    {
      title: 'Vertical Reach Height',
      key: 'verticalReachHeight',
      value: form.values.verticalReachHeight,
    },
    { title: 'Weight', key: 'weight', value: form.values.weight },
    { title: 'BMI', key: 'bmi', value: form.values.bmi },
  ];

  const saveStudentDetails = async (): Promise<void> => {
    const tmpId = searchParams.get('studentId');
    const isUpdate = searchParams.get('update');

    // save new details
    if (tmpId) {
      const buffId = tmpId ? Buffer.from(tmpId, 'hex') : 0;
      const studentId = buffId.toString();

      const id = loadingNotification(
        INotificationTitles.LOADING,
        INotificationMessages.POST_LOADING
      );

      const data = await fetch(`${apiUrl}/students/details/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form.values),
      });

      if (data.ok) {
        // success
        const status = data.status;
        if (status === 201) {
          updateSuccessNotification(
            id,
            INotificationTitles.SUCCESSFUL,
            INotificationMessages.CREATE_STUDENT_DETAIL_SUCCESSFUL
          );

          setTimeout(() => {
            window.close();
          }, 2000);
        }

        return;
      }

      // error
      const errorMsg = await data.text();
      updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);
    }

    // update data
    if (isUpdate) {
      const boolString = 'true';
      if (isUpdate !== boolString) return;

      const id = loadingNotification(
        INotificationTitles.LOADING,
        INotificationMessages.POST_LOADING
      );

      const data = await fetch(`${apiUrl}/students/details/${toUpdate.ID}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form.values),
      });

      if (data.ok) {
        // success
        const status = data.status;
        if (status === 204) {
          localStorage.removeItem('details_update');
          updateSuccessNotification(
            id,
            INotificationTitles.SUCCESSFUL,
            INotificationMessages.UPDATE_STUDENT_DETAIL_SUCCESSFUL
          );

          setTimeout(() => {
            window.close();
          }, 2000);
        }

        return;
      }

      // error
      const errorMsg = await data.text();
      updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);
    }
  };

  const localStudentDetails = (): void => {
    const isUpdate = searchParams.get('update');
    const boolString = 'true';
    if (isUpdate !== boolString) return;

    if (details) {
      const data = JSON.parse(details) as IStudentDetails;
      settoUpdate(data);

      form.setFieldValue('heightStanding', data.HeightStanding);
      form.setFieldValue('eyeHeight', data.EyeHeight);
      form.setFieldValue('shoulderHeight', data.ShoulderHeight);
      form.setFieldValue('elbowHeight', data.ElbowHeight);
      form.setFieldValue('kneeHeight', data.KneeHeight);
      form.setFieldValue('sittingHeight', data.SittingHeight);
      form.setFieldValue('verticalReachHeight', data.VerticalReachHeight);
      form.setFieldValue('weight', data.Weight);
      form.setFieldValue('bmi', data.Bmi);
    }
  };

  if (!wss) setWs(new WebSocket(wsUrl));
  if (wss) {
    wss.onclose = (event) => {
      console.log(`Disconnected from WebSocket server.`);
    };
    wss.onmessage = async (event) => {
      const msg = JSON.parse(event.data) as {
        type: string;
        data: Buffer;
      };

      const { data } = msg;
      const buf = Buffer.from(data);
      const jsonString = JSON.parse(buf.toString('utf8')) as unknown as {
        height: number;
        weight: number;
      };

      const { height, weight } = jsonString;

      if (nowMeasure === 'weight') {
        form.setFieldValue(nowMeasure, parseFloat(weight.toFixed(2)));
      } else {
        form.setFieldValue(nowMeasure, parseFloat(height.toFixed(2)));
      }
    };
    wss.onopen = (event) => {
      console.log(`Connected to WebSocket server.`);
    };
  }

  useEffect(() => {
    const { heightStanding, weight } = form.values;
    if (heightStanding > 0 && weight > 0) {
      const heightStandingMeters = parseFloat(
        (heightStanding * 0.01).toFixed(2)
      );
      const bmi = parseFloat((weight / heightStandingMeters ** 2).toFixed(2));
      form.setFieldValue('bmi', bmi);
    }
  }, [form.values.heightStanding, form.values.weight]);

  useEffect(() => {
    localStudentDetails();
  }, []);

  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
        </Group>

        <Group align="flex-end" justify="space-between" gap="xs" mt={25}>
          <Group>
            {stat.key === 'weight' ? (
              <>
                {checkManualWeight ? (
                  <NumberInput
                    placeholder="Enter weight"
                    min={0}
                    w={rem(100)}
                    {...form.getInputProps('weight')}
                  />
                ) : (
                  <Text className={classes.value}>{stat.value}</Text>
                )}
              </>
            ) : (
              <Text className={classes.value}>{stat.value}</Text>
            )}
            <Text size="sm">
              {stat.key === 'weight'
                ? 'kg'
                : stat.key === 'bmi'
                ? 'kg/m2'
                : 'cm'}
            </Text>
          </Group>
          {stat.key === 'bmi' ? (
            <></>
          ) : stat.key === 'weight' && checkManualWeight ? (
            <></>
          ) : (
            <ActionIcon
              disabled={
                nowMeasure === ''
                  ? false
                  : nowMeasure !== stat.key
                  ? true
                  : false
              }
              autoContrast
              variant="filled"
              aria-label="Settings"
              color={nowMeasure !== stat.key ? 'lime.4' : 'red.4'}
              onClick={() => {
                if (nowMeasure === '') {
                  setNowMeasure(stat.key);
                } else {
                  setNowMeasure('');
                }
              }}
            >
              {nowMeasure !== stat.key ? (
                <IconHandFinger
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                />
              ) : (
                <IconHandStop
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                />
              )}
            </ActionIcon>
          )}
        </Group>
      </Paper>
    );
  });

  return (
    <>
      <Container mt={rem(120)} p={30} fluid>
        <div className={classes.root}>
          <Text fw={500} size="lg" mb={20}>
            Anthropometric
          </Text>
          <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>

          <Divider my="md" />
          <Group justify="flex-end">
            <Button disabled={!form.isDirty()} onClick={saveStudentDetails}>
              Save
            </Button>
          </Group>
        </div>
      </Container>
    </>
  );
}
