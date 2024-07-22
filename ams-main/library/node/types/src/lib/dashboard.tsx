'use client';

export interface IDashboardLinks {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  view?: React.ReactNode;
  links?: { label: string; link: string; view: React.ReactNode }[];
}
