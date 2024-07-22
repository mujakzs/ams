import {
  Image,
  Text,
  Container,
  ThemeIcon,
  Title,
  SimpleGrid,
  Anchor,
} from '@mantine/core';
import IMAGES from './images';
import classes from './style.module.css';

const data = [
  {
    image: 'auditors',
    title: 'School Nurse',
    description:
      "The school nurse can use this during the student's yearly checkup.",
  },
  {
    image: 'lawyers',
    title: 'Students',
    description: 'They can request for their personal data to be exported.',
  },
  {
    image: 'accountants',
    title: 'Alumni',
    description:
      'They can request for their data to be exported or deleted.',
  },
  {
    image: 'others',
    title: 'Others',
    description: 'For personal use of their body measurements.',
  },
];

export default function Home() {
  const items = data.map((item) => (
    <div className={classes.item} key={item.image}>
      <ThemeIcon
        variant="light"
        className={classes.itemIcon}
        size={60}
        radius="md"
      >
        <Image src={IMAGES[item.image]} />
      </ThemeIcon>

      <div>
        <Text fw={700} fz="lg" className={classes.itemTitle}>
          {item.title}
        </Text>
        <Text c="dimmed">{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>Use cases</Text>

      <Title className={classes.title} order={2}>
        <span className={classes.highlight}>Anthropometric</span> Measurement
        System <br />
        for everyone
      </Title>

      <Container size={660} p={0}>
        <Text c="dimmed" className={classes.description}>
          Measurement of the human individual. It has been used for
          identification, for the purposes of understanding human physical
          variation, in paleoanthropology and in various attempts to correlate
          physical with racial and psychological traits.
          <Anchor
            href="https://en.wikipedia.org/wiki/Anthropometry"
            target="_blank"
          >
            Wikipedia
          </Anchor>
        </Text>
      </Container>

      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
