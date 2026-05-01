import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';        // ← добавили
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Карточка сервиса',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Обзор платформы для поиска репетитора
      </>
    ),
    link: '/docs/scope',
    linkLabel: 'Открыть документацию',
  },
  {
    title: 'API Reference',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Интерактивная Swagger-документация REST API
      </>
    ),
    link: '/docs/api/real',
    linkLabel: 'Открыть API Reference',
  },
];

function Feature({Svg, title, description, link, linkLabel}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        {link && (
          <Link
            className="button button--primary button--outline button--sm"
            to={link}
            style={{marginTop: '1rem'}}
          >
            {linkLabel || 'Подробнее'}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}