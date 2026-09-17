import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const TOKENS = [
  {label: 'cyan', hex: '#00CFE6'},
  {label: 'nitrous', hex: '#2986FF'},
  {label: 'purple', hex: '#7B3DFF'},
  {label: 'magenta', hex: '#DF29FF'},
  {label: 'green', hex: '#1EAE79'},
];

const CARDS = [
  {title: 'ClippyFlow Design System', to: '/design-system/tokens', body: 'A deep-navy spectrum canvas, translucent cards, nitrous structure, and ClippyFlow token profiles.'},
  {title: 'ClippyDeck Harvest', to: '/harvest/overview', body: 'Extract layouts, design tokens, diagrams, dataflows, and media while keeping real and synthetic content in separate JSON profiles.'},
  {title: 'Reproduction Method', to: '/reproduction/methodology', body: 'Read exact source geometry, colors, gradients, and relationships instead of approximating a design by eye.'},
  {title: 'Deck Generator', to: '/generator/overview', body: 'One content model, ten archetype renderers, and a zero-dependency Node script for the ClippyFlow deck.'},
  {title: 'Presenter', to: '/presenter/overview', body: 'Full-bleed slides on a viewport grid with a single floating header layer. No chrome.'},
  {title: 'Clawpilot Skill', to: '/skill/overview', body: 'Eight commands that encode the build, render, validate, export, and present loop.'},
  {title: 'Adaptive Card Extensions', to: '/harvest/plugin', body: 'Content binding, synthetic profile switching, privacy audit, and legacy TileSlide theme support.'},
];

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="ClippySlide" description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.kicker}>CLIPPYFLOW DEFAULT</div>
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
            <Link className={styles.ghostBtn} to="/harvest/overview">Harvest</Link>
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
