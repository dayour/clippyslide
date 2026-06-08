import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const TOKENS = [
  {label: 'periwinkle', hex: '#818EFF'},
  {label: 'cyan', hex: '#39B0FF'},
  {label: 'coral', hex: '#F77181'},
  {label: 'magenta', hex: '#CA5BCD'},
];

const CARDS = [
  {title: 'Design System', to: '/design-system/tokens', body: 'A CSS component library plus token profiles (JSON / XML / YAML), extracted verbatim from real OOXML.'},
  {title: 'Reproduction Method', to: '/reproduction/methodology', body: 'A .pptx is a zip of XML. Read the gradient stops, don\u2019t eyeball them. The whole philosophy.'},
  {title: 'Deck Generator', to: '/generator/overview', body: 'One content model, ten archetype renderers, a zero-dependency Node script \u2192 the full 24-slide deck.'},
  {title: 'Presenter', to: '/presenter/overview', body: 'Full-bleed slides on a viewport grid with a single floating header layer. No chrome.'},
  {title: 'Clawpilot Skill', to: '/skill/overview', body: 'Eight commands that encode the extract \u2192 build \u2192 render \u2192 validate \u2192 present loop.'},
  {title: 'TileSlide Extension', to: '/extension/coe-theme', body: 'A theme that puts the CoE look on live, editable Adaptive Cards.'},
];

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="ClippySlide" description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.kicker}>COPILOT AGENT DEVELOPMENT</div>
          <h1 className={styles.title}>ClippySlide</h1>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
          <div className={styles.swatches}>
            {TOKENS.map((t) => (
              <span key={t.hex} className={styles.swatch} style={{background: t.hex}} title={`${t.label} ${t.hex}`} />
            ))}
          </div>
          <div className={styles.buttons}>
            <Link className={styles.primaryBtn} to="/intro">Read the Wiki</Link>
            <Link className={styles.ghostBtn} to="/quick-start">Quick Start</Link>
            <Link className={styles.ghostBtn} to="/presenter/overview">Presenter</Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.grid}>
          {CARDS.map((c) => (
            <Link key={c.title} to={c.to} className={styles.card}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
