'use client';

import { IDashboardLinks } from '@ams/library/node//types';
import {
  IconHome,
  IconUsersGroup,
  IconScaleOutline,
} from '@tabler/icons-react';
import { NavDashboard } from '@ams/library/next/components/dashboard';

import Student from '../_lib/student/page';
import Employee from '../_lib/employee/page';
import Home from '../_lib/home/page';
import { SEO } from '@ams/library/next/components/seo';

const nav: IDashboardLinks[] = [
  {
    label: 'Home',
    icon: IconHome,
    view: <Home />,
  },
  {
    label: 'Employee',
    icon: IconUsersGroup,
    view: <Employee />,
  },
  {
    label: 'Measure',
    icon: IconScaleOutline,
    links: [{ label: 'Student', link: '/', view: <Student /> }],
  },
];

export default function Dashboard() {
  return (
    <>
      <SEO title="Dashboard | AMS" defaultTitle="Dashboard | AMS" />
      <NavDashboard nav={nav} />
    </>
  );
}
