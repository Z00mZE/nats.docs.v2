import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <img
          src="/img/nats-icon.svg"
          alt="Логотип NATS"
          className={styles.heroLogo}
        />
        <h1 className={clsx("hero__title", styles.heroTitle)}>
          Добро пожаловать в документацию NATS
        </h1>
        <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
          Всё для разработки с NATS — простой, безопасной и высокопроизводительной системой обмена сообщениями
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/concepts/intro"
          >
            Начать работу
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/concepts/what-is-nats"
          >
            Основные понятия
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Документация NATS`}
      description="Полная документация NATS — простой, безопасной и высокопроизводительной системы обмена сообщениями с открытым исходным кодом для облачных приложений, Интернета вещей и микросервисных архитектур."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

