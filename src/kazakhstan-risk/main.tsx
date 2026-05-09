import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Gauge,
  Globe2,
  Landmark,
  LockKeyhole,
  PackageCheck,
  Route,
  SearchCheck,
  ShieldAlert,
  Timer,
  Users,
} from 'lucide-react';
import './styles.css';

const CTA_LABEL = 'Send one Kazakhstan counterparty for review';
const EMAIL = 'hello@doscode.kz';

const researchPoints = [
  {
    label: 'Pattern 1',
    title: 'Enterprise compliance pages lead with risk reduction, not visuals',
    evidence:
      'Dow Jones due diligence pages package trust around report depth, source quality, and audit readiness. GOV.UK guidance reinforces that sanctions compliance requires more than a list check.',
  },
  {
    label: 'Pattern 2',
    title: 'Specialist screening pages educate on hidden ownership and network risk',
    evidence:
      'Sayari-style sanctions pages focus on ownership, control, networks, and export-control gaps that basic name matching can miss.',
  },
  {
    label: 'Pattern 3',
    title: 'B2B conversion depends on clarity, credibility, and low-friction next steps',
    evidence:
      'NN/g credibility guidance emphasizes accurate representation, transparent content, and trustworthy presentation. Contentsquare benchmarks are based on large cross-industry session data, so speed, scannability, and mobile clarity matter.',
  },
];

const designDirections = [
  {
    name: 'Enterprise Risk Desk',
    score: 'Best fit',
    summary:
      'Sober, compliance-style page with a report preview, source checklist, pricing, and proof of process. Optimized for consultants and exporters who need trust before they buy.',
  },
  {
    name: 'Founder Pilot Offer',
    score: 'Fastest test',
    summary:
      'Lean one-screen sales page built around a $249 pilot. Faster to scan, but weaker for compliance trust and white-label buyers.',
  },
  {
    name: 'Intelligence Dashboard Concept',
    score: 'Most visual',
    summary:
      'Dark OSINT dashboard aesthetic with maps, risk scores, and network graphics. Looks modern, but risks overpromising SaaS and automation.',
  },
];

const checks = [
  ['Kazakhstan entity snapshot', 'Legal name, BIN, registration date, address, status, activity profile.'],
  ['Sanctions and watchlists', 'OFAC, U.S. CSL, BIS lists, EU/UK where feasible, plus source dates.'],
  ['Russia-affiliation signals', 'Owners, directors, phones, emails, domains, addresses, and Russian-language footprint.'],
  ['Product and shipment risk', 'CHPL relevance, dual-use sensitivity, route, payment party, end user, and end-use clarity.'],
  ['Credibility signals', 'Website, employees, office or warehouse signs, public footprint, operating history.'],
  ['Red flags and evidence', 'Post-2022 entity creation, mismatched activity, vague freight route, third-party payment, unusual order size.'],
];

const output = [
  'Entity and counterparty risk rating',
  'Product and shipment risk rating',
  'Data completeness and confidence rating',
  'Evidence links with source dates',
  'Recommended next step: proceed, request more docs, escalate, or pause',
  'Clear limitations and compliance disclaimer',
];

const pricing = [
  {
    name: 'Basic Pilot Screen',
    price: '$249',
    description: 'One Kazakhstan counterparty, 24-48h turnaround, practical first pass for paid validation.',
    bullets: ['Entity snapshot', 'Core watchlist checks', 'Initial red flags', 'Short PDF memo'],
  },
  {
    name: 'Full Counterparty Report',
    price: '$499',
    featured: true,
    description: 'The main offer for exporters, forwarders, and consultants who need a documented review.',
    bullets: ['All pilot checks', 'Russia-affiliation signals', 'Product and shipment notes', 'Evidence links and next steps'],
  },
  {
    name: 'Urgent or High-Risk Review',
    price: '$999',
    description: 'For sensitive goods, complex routing, unclear end users, high-value shipments, or urgent deadlines.',
    bullets: ['Priority handling', 'Deeper analyst review', 'Expanded source checks', 'Escalation-ready memo'],
  },
];

const buyers = [
  ['U.S. exporters', 'Before shipping sensitive goods to a Kazakhstan buyer or distributor.'],
  ['Freight forwarders and customs brokers', 'As an add-on check when the cargo, route, or buyer raises questions.'],
  ['Trade compliance consultants', 'White-label local Kazakhstan research support for clients.'],
  ['Export-control lawyers', 'Evidence package to support legal review, not replace it.'],
];

function App() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kazakhstan Export Risk Reports home">
          <span className="brand-mark">KR</span>
          <span>
            <strong>Kazakhstan Risk Reports</strong>
            <small>Human-reviewed export risk intelligence</small>
          </span>
        </a>
        <nav aria-label="Page navigation">
          <a href="#checks">Checks</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-cta" href={`mailto:${EMAIL}?subject=Kazakhstan counterparty risk report`}>Request review</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><ShieldAlert size={16} /> Russia-diversion red flag review for Kazakhstan shipments</div>
          <h1>Before shipping to Kazakhstan, check for Russia-diversion red flags.</h1>
          <p className="hero-subhead">
            24-48h human-reviewed counterparty risk reports for U.S. exporters, freight forwarders, customs brokers, and trade compliance consultants.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={`mailto:${EMAIL}?subject=Kazakhstan counterparty risk report&body=Company name/BIN:%0AWebsite:%0AProduct:%0AEnd user/end use:%0ADeadline:`}>{CTA_LABEL}<ArrowRight size={18} /></a>
            <a className="button secondary" href="/kazakhstan-risk/KTEKZ-client-facing-sample.pdf">View sample report</a>
          </div>
          <div className="trust-strip" aria-label="Trust highlights">
            <span><Timer size={16} /> 24-48h</span>
            <span><Users size={16} /> Human reviewed</span>
            <span><LockKeyhole size={16} /> Not legal advice</span>
          </div>
        </div>

        <aside className="report-card" aria-label="Sample report preview">
          <div className="report-card-top">
            <span className="status-dot" /> Sample memo preview
            <strong>Counterparty Risk Review</strong>
          </div>
          <div className="risk-grid">
            <div>
              <small>Entity risk</small>
              <strong className="risk medium">Medium</strong>
            </div>
            <div>
              <small>Shipment risk</small>
              <strong className="risk open">Needs data</strong>
            </div>
            <div>
              <small>Confidence</small>
              <strong className="risk moderate">Moderate</strong>
            </div>
          </div>
          <div className="source-list">
            <p><SearchCheck size={16} /> Kazakhstan company registry and BIN data</p>
            <p><Landmark size={16} /> U.S. and international watchlists</p>
            <p><Globe2 size={16} /> Russian/Kazakh/English open-web signals</p>
            <p><Route size={16} /> Product, route, payment, and end-user red flags</p>
          </div>
          <div className="memo-footer">
            <FileSearch size={18} /> Evidence memo, not clearance
          </div>
        </aside>
      </section>

      <section className="decision-section">
        <div className="section-kicker">Design direction chosen from data</div>
        <h2>Chosen direction: Enterprise Risk Desk.</h2>
        <p className="section-intro">
          I considered three directions and chose the one most aligned with compliance-buyer behavior: clarity, documented process, pricing confidence, and trust before flash.
        </p>
        <div className="direction-grid">
          {designDirections.map((direction) => (
            <article className={direction.score === 'Best fit' ? 'direction-card selected' : 'direction-card'} key={direction.name}>
              <span>{direction.score}</span>
              <h3>{direction.name}</h3>
              <p>{direction.summary}</p>
            </article>
          ))}
        </div>
        <div className="research-grid">
          {researchPoints.map((point) => (
            <article key={point.title}>
              <span>{point.label}</span>
              <h3>{point.title}</h3>
              <p>{point.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="checks">
        <div>
          <div className="section-kicker">What the report checks</div>
          <h2>More than a sanctions-list lookup.</h2>
          <p className="section-intro">
            The risk often sits in ownership, routing, product fit, end-user clarity, and local Kazakhstan signals. The report packages those signals into a concise decision-support memo.
          </p>
        </div>
        <div className="check-list">
          {checks.map(([title, text]) => (
            <article key={title}>
              <CheckCircle2 size={20} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="output-section">
        <div className="document-panel">
          <div className="paper-lines">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="rating-row">
            <BadgeCheck />
            <div>
              <strong>Output: concise PDF memo</strong>
              <p>Built for internal compliance review and escalation conversations.</p>
            </div>
          </div>
        </div>
        <div>
          <div className="section-kicker">What you receive</div>
          <h2>A practical memo your team can act on.</h2>
          <ul className="output-list">
            {output.map((item) => <li key={item}><ClipboardCheck size={18} /> {item}</li>)}
          </ul>
        </div>
      </section>

      <section className="buyers-section">
        <div className="section-kicker">Built for narrow, high-intent buyers</div>
        <h2>For teams that need to move a shipment without ignoring red flags.</h2>
        <div className="buyer-grid">
          {buyers.map(([title, text]) => (
            <article key={title}>
              <Building2 size={22} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="section-kicker">Pilot-friendly pricing</div>
        <h2>Serious enough for compliance. Small enough to test this week.</h2>
        <div className="pricing-grid">
          {pricing.map((plan) => (
            <article className={plan.featured ? 'price-card featured' : 'price-card'} key={plan.name}>
              {plan.featured && <span className="recommended">Recommended</span>}
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              <p>{plan.description}</p>
              <ul>
                {plan.bullets.map((bullet) => <li key={bullet}><PackageCheck size={16} /> {bullet}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="section-kicker">Process</div>
        <h2>Simple path from counterparty to memo.</h2>
        <div className="process-grid">
          {[
            ['1', 'Send the counterparty', 'Company name, BIN if known, website, product, route, end user, and deadline.'],
            ['2', 'We run the review', 'Source checks, watchlists, Kazakhstan records, open-web signals, and shipment-specific red flags.'],
            ['3', 'Receive the memo', 'Risk ratings, evidence links, limitations, and recommended next steps within 24-48h.'],
          ].map(([num, title, text]) => (
            <article key={num}>
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div>
          <div className="section-kicker">Compliance boundary</div>
          <h2>Clear about what this is and is not.</h2>
        </div>
        <div className="faq-list">
          <details open>
            <summary>Is this legal advice?</summary>
            <p>No. This report is not legal advice, not an export classification, not a sanctions legal opinion, and not a guarantee that a transaction is permissible.</p>
          </details>
          <details>
            <summary>Why not just check sanctions lists?</summary>
            <p>List screening matters, but diversion risk can show up in ownership, affiliates, product fit, routing, payment, end-user clarity, and local public records.</p>
          </details>
          <details>
            <summary>Can this be white-labeled?</summary>
            <p>Yes. Trade compliance consultants, freight forwarders, customs brokers, and export-control law firms can use this as local Kazakhstan research support.</p>
          </details>
        </div>
      </section>

      <section className="final-cta">
        <Gauge size={32} />
        <h2>Have one Kazakhstan buyer worth checking?</h2>
        <p>Send the counterparty, product, and deadline. The first useful test is a paid pilot, not another software build.</p>
        <a className="button primary" href={`mailto:${EMAIL}?subject=Kazakhstan counterparty risk report&body=Company name/BIN:%0AWebsite:%0AProduct:%0AEnd user/end use:%0ADeadline:`}>{CTA_LABEL}<ArrowRight size={18} /></a>
        <small>Supports internal compliance review. Final decisions should be made with qualified export-control or sanctions counsel where appropriate.</small>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
