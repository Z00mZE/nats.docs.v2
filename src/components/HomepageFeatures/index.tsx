import type {ComponentType, CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {
  RocketIcon,
  LightbulbIcon,
  LearnIcon,
  TutorialsIcon,
  ReferenceIcon,
  UsersIcon,
} from '@site/src/components/Icons';
import type {IconProps} from '@site/src/components/Icons';
import styles from './styles.module.css';

type DocSection = {
  title: string;
  Icon: ComponentType<IconProps>;
  description: ReactNode;
  link: string;
  accent: string;
};

const DocSections: DocSection[] = [
  {
    title: "Начало работы",
    Icon: RocketIcon,
    accent: '#27AAE1',
    description: (
      <>
        Впервые работаете с NATS? Начните здесь: изучите основы и запустите первое приложение за несколько минут.
      </>
    ),
    link: '/concepts/intro',
  },
  {
    title: "Основные понятия",
    Icon: LightbulbIcon,
    accent: '#F59E0B',
    description: (
      <>
        Познакомьтесь с основными понятиями и архитектурой обмена сообщениями NATS и JetStream.
      </>
    ),
    link: '/concepts/what-is-nats',
  },
  {
    title: "Изучение",
    Icon: LearnIcon,
    accent: '#8B5CF6',
    description: (
      <>
        Подробные курсы по Core NATS, JetStream и промышленной эксплуатации NATS.
      </>
    ),
    link: '/learn',
  },
  {
    title: "Практические руководства",
    Icon: TutorialsIcon,
    accent: '#34A574',
    description: (
      <>
        Пошаговые руководства для обучения на реальных приложениях с NATS.
      </>
    ),
    link: '/tutorials',
  },
  {
    title: "Справочник",
    Icon: ReferenceIcon,
    accent: '#375C93',
    description: (
      <>
        Полный справочник по конфигурации сервера, протоколам и спецификациям API.
      </>
    ),
    link: '/reference',
  },
  {
    title: "Сообщество",
    Icon: UsersIcon,
    accent: '#EC4899',
    description: (
      <>
        Общайтесь с сообществом NATS в Slack, участвуйте в разработке на GitHub и получайте помощь коллег.
      </>
    ),
    link: 'https://nats.io/community/',
  },
];

function DocSectionCard({title, Icon, description, link, accent}: DocSection) {
  const isExternal = link.startsWith('http');

  return (
    <div className={clsx('col col--4', styles.docSection)}>
      <Link to={link} className={styles.docSectionLink}>
        <div
          className={styles.docSectionCard}
          style={{['--card-accent' as string]: accent} as CSSProperties}
        >
          <div className={styles.docSectionIcon}>
            <Icon width={28} height={28} />
          </div>
          <Heading as="h3" className={styles.docSectionTitle}>{title}</Heading>
          <p className={styles.docSectionDescription}>{description}</p>
          <div className={styles.docSectionArrow}>
            {isExternal ? '↗' : '→'}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">Изучайте документацию</Heading>
          <p>Всё необходимое для разработки с NATS</p>
        </div>
        <div className="row">
          {DocSections.map((props, idx) => (
            <DocSectionCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
