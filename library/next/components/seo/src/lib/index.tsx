import { useEffect, useState } from 'react';

interface ISEOProps {
  title?: string;
  defaultTitle: string;
}

export const SEO = ({ title, defaultTitle }: ISEOProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) document.title = title ? title : defaultTitle;
  }, [mounted]);

  return <></>;
};
