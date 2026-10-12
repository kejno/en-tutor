import { EmailCapture } from './EmailCapture';

const unavailableLinks = ['Learner Stories', 'Institutional Plans', 'Speech Science Lab', 'Careers', 'Press Kit'];

function FooterLink({ children }: { children: string }) {
  return <span className="footer-link footer-link-disabled" aria-disabled="true">{children}</span>;
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a className="brand" href="#top"><span className="brand-mark">✦</span> FluentAI</a>
          <p>The real-time conversational partner engineered for ambitious professionals and students. Achieve effortless verbal fluency without performance anxiety.</p>
          <div className="badges"><span>SOC2 Certified</span><span>GDPR Compliant</span></div>
        </div>
        <div><h3>CURRICULUM &amp; TECH</h3><FooterLink>Pronunciation Coach</FooterLink><FooterLink>IELTS &amp; TOEFL Prep</FooterLink><FooterLink>Business English Suite</FooterLink><FooterLink>Real-time Accent Feedback</FooterLink><FooterLink>Acoustic Wave Analysis</FooterLink></div>
        <div><h3>COMPANY</h3>{unavailableLinks.slice(0, 3).map((link) => <FooterLink key={link}>{link}</FooterLink>)}<FooterLink>{unavailableLinks[3]}</FooterLink><FooterLink>{unavailableLinks[4]}</FooterLink></div>
        <div><h3>SPEECH INSIGHTS WEEKLY</h3><p>Get cognitive linguistics techniques and AI prompt exercises delivered every Tuesday.</p><EmailCapture compact /><small>Zero spam. Unsubscribe anytime.</small></div>
      </div>
      <div className="footer-bottom"><span>© 2025 FluentAI Technologies Inc. All rights reserved.</span><nav aria-label="Юридическая информация"><FooterLink>Privacy Policy</FooterLink><FooterLink>Terms of Service</FooterLink><FooterLink>Security Whitepaper</FooterLink><FooterLink>Cookie Settings</FooterLink></nav></div>
    </footer>
  );
}
