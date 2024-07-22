'use client';

import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

import { Login } from '@ams/library/next/components/login';
import {
  type ILoginProps,
  type ILoginInput,
  INotificationTitles,
  INotificationMessages,
  type ILoginResponse,
} from '@ams/library/node//types';
import {
  loadingNotification,
  updateErrorNotification,
  updateSuccessNotification,
} from '@ams/library/next/components/toasts';

export default function Index() {
  const [_, setToken, removeToken] = useLocalStorage({
    key: 'token',
  });
  const router = useRouter();

  const authenticate = async (values: ILoginInput): Promise<void> => {
    const id = loadingNotification(
      INotificationTitles.LOADING,
      INotificationMessages.AUTH_LOADING
    );

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const data = await fetch(`${apiUrl}/auth`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (data.ok) {
      // success
      const res = (await data.json()) as ILoginResponse;
      setToken(res.token);

      updateSuccessNotification(
        id,
        INotificationTitles.SUCCESSFUL,
        INotificationMessages.AUTH_SUCCESSFUL
      );
      router.push('/dashboard');
      return;
    }

    // error
    const errorMsg = await data.text();
    removeToken();
    updateErrorNotification(id, INotificationTitles.ERROR, errorMsg);
  };

  const loginProps: ILoginProps = {
    title: 'Anthropometric Measurement System',
    description: 'Physical measures made easy.',
    buttonText: 'Login',
    input: {
      email: '',
      password: '',
    },
    onLogin: authenticate,
  };

  return <Login {...loginProps} />;
}
