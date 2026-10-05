'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <nav className="landing-navbar" role="navigation" aria-label="Main navigation">
        <Link href="/" className="landing-navbar__logo" aria-label="TalentMatch home">
          <span className="landing-navbar__logo-icon" style={{ background: '#4f46e5', width: '32px', height: '32px', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
          </span>
          <span className="landing-navbar__logo-name">TalentMatch</span>
          <span className="landing-navbar__badge">Clarity ATS</span>
        </Link>

        <div className="landing-navbar__nav">
          <a href="#features" className="landing-navbar__link">Features</a>
          <a href="#how-it-works" className="landing-navbar__link">How it Works</a>
          <a href="#ats-scanner" className="landing-navbar__link">ATS Scanner</a>
          <a href="#results" className="landing-navbar__link">Results</a>
          <a href="#pricing" className="landing-navbar__link">Pricing</a>
        </div>

        <div className="landing-navbar__right">
          <Link href="/workspace" className="landing-navbar__link landing-navbar__link--signin">Sign In</Link>
          <Link href="/workspace">
            <button className="btn btn--shadow btn--animated" style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '99px', padding: '10px 20px', fontWeight: 600 }}>Get Started Free ➔</button>
          </Link>
        </div>
      </nav>

      <main>
        {/* Landing Hero Section */}
        <section className="landing-hero-section">
          <div className="landing-hero-content">
            <div className="landing-hero-badge">
              <span className="landing-hero-badge-dot"></span> Clarity ATS Core v4.2 Active <span className="landing-hero-badge-divider">|</span> Built for Enterprise Parsers
            </div>
            <h1 className="landing-hero-title">
              Pass Modern ATS Filters With<br/>
              <span style={{ color: '#4f46e5' }}>Contextual Resume Precision</span>
            </h1>
            <p className="landing-hero-subtitle">
              Benchmark your resume against target job postings, eliminate keyword blindspots, and harmonize impact bullets with verifiable metrics in seconds.
            </p>
            <div className="landing-hero-actions">
              <Link href="/workspace">
                <button className="btn btn--shadow btn--animated" style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '99px', padding: '14px 28px', fontSize: '15px' }}>
                  Start Free — 25 Analysis Credits ⚡
                </button>
              </Link>
              <button className="btn btn--secondary btn--lg btn--animated" style={{ borderRadius: '99px', padding: '14px 28px' }}>
                ▷ Explore Interactive Demo
              </button>
            </div>
            <div className="landing-hero-trust">
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> SOC2 Type II & GDPR Compliant</span>
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> No credit card required</span>
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 85,000+ candidate CVs processed</span>
            </div>
          </div>

          <div className="landing-mockup-wrapper">
            <div className="landing-mockup-container">
              <div className="mockup-header-bar">
                <div className="mockup-dots"><span/><span/><span/></div>
                <div className="mockup-title">TalentMatch Clarity Workbench — JD Match Planner</div>
                <div className="mockup-badge">● 98% Parse Reliability</div>
              </div>
              <div className="mockup-content">
                <div className="mockup-left">
                  <div className="mockup-section-header">
                    <span className="mockup-label">TARGET DOCS</span>
                    <span className="mockup-sublabel">Pending Data Parser</span>
                    <span className="mockup-tag">Tier 1 Match</span>
                  </div>
                  <div className="mockup-job-title">Lead Frontend Engineer (Fintech Experience)</div>
                  <div className="mockup-job-meta">FintechCorp HQ • San Francisco, CA (Hybrid)</div>
                  
                  <div className="mockup-divider"></div>
                  
                  <div className="mockup-section-header">
                    <span className="mockup-label">JD/MATCH BULLET POINT HARMONIZATION</span>
                    <span className="mockup-link">✏ 4 Keywords Auto-Resolved</span>
                  </div>
                  <div className="mockup-bullets">
                    <div className="mockup-bullet">
                      <span className="bullet-check">✓</span>
                      <p>Spearheaded migration to <span className="highlight-green">React/Next.js ecosystem</span>, improving render performance by 40% across checkout funnels.</p>
                    </div>
                    <div className="mockup-bullet">
                      <span className="bullet-check">✓</span>
                      <p>Re-architected modular <span className="highlight-green">TypeScript state machines</span> for cross-browser currency transactions.</p>
                    </div>
                    <div className="mockup-bullet">
                      <span className="bullet-check">✓</span>
                      <p>Automated test coverage across component library with <span className="highlight-yellow">Playwright & Jest ▾</span></p>
                    </div>
                  </div>

                  <div className="mockup-section-header" style={{ marginTop: '24px' }}>
                    <span className="mockup-label">KEYWORD & COMPETENCY MATRIX</span>
                  </div>
                  <div className="mockup-pills">
                    <span className="mockup-pill mockup-pill--green">✓ React/Next.js</span>
                    <span className="mockup-pill mockup-pill--green">✓ TypeScript v5</span>
                    <span className="mockup-pill mockup-pill--green">✓ Core Web Vitals</span>
                    <span className="mockup-pill mockup-pill--green">✓ Micro-frontends</span>
                    <span className="mockup-pill mockup-pill--yellow">⚠ Kubernetes/Docker (Missing)</span>
                  </div>

                  <div className="mockup-footer">
                    <span className="mockup-filename">Source Resume: <span style={{fontWeight:600, color:'#111'}}>Zoe_Morgan_Lead_Frontend_2024.pdf</span></span>
                    <span className="mockup-link-blue">View Base XML Parse &gt;</span>
                  </div>
                </div>

                <div className="mockup-right">
                  <div className="mockup-section-header">
                    <span className="mockup-label" style={{color:'#111', fontWeight: 800}}>ATS Diagnostic Breakdown</span>
                    <span className="mockup-badge-green">High Culture Fit</span>
                  </div>
                  
                  <div className="mockup-score-box">
                    <div className="mockup-score-circle">
                      <div className="mockup-score-value">96%</div>
                      <div className="mockup-score-label">MATCH</div>
                    </div>
                    <div className="mockup-score-text">
                      <div className="mockup-score-title">✓ TOP 8% SITE MATCH</div>
                      <div className="mockup-score-desc">Top 4% Candidate Rank</div>
                      <div className="mockup-score-detail">Parser verifies similarity of 14 required technical competencies.</div>
                    </div>
                  </div>

                  <div className="mockup-bars">
                    <div className="mockup-bar-item">
                      <div className="mockup-bar-label"><span>Semantic Keyword Alignment</span><span style={{color:'#10b981'}}>96% Matched</span></div>
                      <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{width:'96%', background:'#10b981'}}></div></div>
                    </div>
                    <div className="mockup-bar-item">
                      <div className="mockup-bar-label"><span>Technical Stack Depth</span><span style={{color:'#4f46e5'}}>100%</span></div>
                      <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{width:'100%', background:'#4f46e5'}}></div></div>
                    </div>
                    <div className="mockup-bar-item">
                      <div className="mockup-bar-label"><span>Title & Role Suitability</span><span style={{color:'#10b981'}}>100% Verified</span></div>
                      <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{width:'100%', background:'#10b981'}}></div></div>
                    </div>
                  </div>

                  <button className="mockup-btn-primary">Tailor & Download Compliant PDF ⤓</button>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-logos">
             <p>CANDIDATES USING TALENTMATCH HAVE SECURED INTERVIEWS AT TOP TECH TEAMS</p>
             <div className="landing-logos-grid">
               <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Stripe</span>
               <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 22 22 22 12 2"/></svg> Datadog</span>
               <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg> Plaid</span>
               <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> OpenAI</span>
               <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Airbnb</span>
               <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19c.7 0 1.5-.2 2.1-.5.7-.3 1.3-.8 1.8-1.5.4-.6.7-1.4.7-2.2 0-1-.3-1.9-1-2.6s-1.5-1.1-2.5-1.1c-.2-2.1-1.2-4-2.8-5.3C14.2 4.4 12.2 3.8 10 4 7.8 4.2 5.9 5.4 4.6 7.1 3.3 8.8 2.8 10.9 3.1 13c-.8.5-1.4 1.3-1.8 2.2-.4.9-.4 1.9-.1 2.8.3.9 1 1.7 1.8 2.1.8.5 1.7.7 2.6.7h11.9z"/></svg> Cloudflare</span>
             </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section id="features" className="landing-section">
          <div className="landing-section-tag" style={{ background: '#eff6ff', color: '#3b82f6' }}>Designed for Rejection Prevention</div>
          <h2 className="landing-section-title">Three Pillars of ATS Optimization</h2>
          <p className="landing-section-subtitle">
            Applicant tracking systems reject over 75% of qualified resumes before human review. TalentMatch ensures your genuine skills are correctly decoded.
          </p>
          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon">▵</div>
              <h3 className="pillar-title">Semantic ATS Diagnostic Engine</h3>
              <p className="pillar-desc">
                Reverse-engineer parser algorithms across 50+ enterprise ATS engines with context-aware synonym mapping and exact-sequence frequency inspection.
              </p>
              <div className="pillar-feature">
                <span className="pillar-feature-label">Penalty Assessment</span>
                <span className="pillar-feature-value">100% Accuracy</span>
              </div>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">⚒</div>
              <h3 className="pillar-title">1-Click Bullet Point Harmonization</h3>
              <p className="pillar-desc">
                Autonomously rephrase impact statements to weave missing requirements into your existing work history without awkward stuffing or false claims.
              </p>
              <div className="pillar-feature">
                <span className="pillar-feature-label">Jargon Alignment</span>
                <span className="pillar-feature-value">Flawless</span>
              </div>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">📄</div>
              <h3 className="pillar-title">Single-Column Certified Export</h3>
              <p className="pillar-desc">
                Download clean, parser-certified PDF and DOCX files guaranteed not to garble columns, break text bounding boxes, or drop contact headers.
              </p>
              <div className="pillar-feature">
                <span className="pillar-feature-label">Clean Typography</span>
                <span className="pillar-feature-value">100% Passable</span>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="how-it-works" className="landing-section workflow-section">
          <div className="landing-section-tag" style={{ background: '#eff6ff', color: '#3b82f6' }}>Streamlined Workflow</div>
          <h2 className="landing-section-title">From Generic CV to Targeted Match in 3 Minutes</h2>
          <p className="landing-section-subtitle">
            A frictionless optimization pipeline designed for candidates actively applying to competitive roles.
          </p>
          <div className="workflow-grid">
            <div className="workflow-card">
              <div className="workflow-step">1</div>
              <h3 className="workflow-title">Upload Your Resume</h3>
              <p className="workflow-desc">
                Drag and drop your current PDF, DOCX, or text file. TalentMatch extracts structure, work dates, and bullets instantly.
              </p>
              <div className="workflow-tag">📄 Accepts PDF, DOCX, TXT</div>
            </div>
            <div className="workflow-card">
              <div className="workflow-step">2</div>
              <h3 className="workflow-title">Attach Target Job Posting</h3>
              <p className="workflow-desc">
                Paste the raw job description, upload a JD doc, or provide a URL from LinkedIn or Greenhouse to extract essential criteria.
              </p>
              <div className="workflow-tag">⚡ Auto-extracts requirements</div>
            </div>
            <div className="workflow-card">
              <div className="workflow-step">3</div>
              <h3 className="workflow-title">Review & Tailor with 1 Click</h3>
              <p className="workflow-desc">
                Inspect expandible accordion insights on gaps, approve recommended phrase updates, and download your 100% compliant resume.
              </p>
              <div className="workflow-tag">✓ Guarantee Parser Safe</div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="results" className="landing-section">
          <div className="landing-section-tag" style={{ background: '#dcfce7', color: '#16a34a' }}>Real Candidate Outcomes</div>
          <h2 className="landing-section-title">Over 85,000 Interviews Unlocked</h2>
          <p className="landing-section-subtitle">
            Hear how engineers and product leads transformed their response rates across enterprise hiring pipelines.
          </p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">"I spent 2 months applying with zero callbacks. TalentMatch revealed that my multi-column format was scrambling my job titles in Workday. Fixed in one click, and landed 4 interviews the next week."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: '#4f46e5' }}>DR</div>
                <div>
                  <div className="testimonial-name">David R.</div>
                  <div className="testimonial-role">Senior Infrastructure Engineer • Stripe</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">"The gap breakdown and extraction insights are invaluable. Seeing exactly which keywords are weighted heavily and tailoring my bullet points gave me an immediate 95% match score."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: '#10b981' }}>SL</div>
                <div>
                  <div className="testimonial-name">Sarah L.</div>
                  <div className="testimonial-role">Lead Product Designer • Datadog</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">"The bullet tailoring feature is absolute magic. It doesn't hallucinate skills, it just makes your real achievements fit the specific terminology recruiters search for."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: '#3b82f6' }}>MK</div>
                <div>
                  <div className="testimonial-name">Marcus K.</div>
                  <div className="testimonial-role">Staff Full Stack Engineer • Notion</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-wrapper">
          <div className="cta-box">
            <div className="landing-section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>Start Optimizing Today</div>
            <h2 className="cta-title">Stop Getting Auto-Rejected.<br/>Start Getting Interviews.</h2>
            <p className="cta-desc">Benchmark your resume against real job specifications in under 3 minutes with 25 free credits.</p>
            <div className="cta-actions">
              <Link href="/workspace" className="cta-btn-primary">Create Account & Get 25 Free Credits ➔</Link>
              <Link href="/workspace" className="cta-btn-secondary">Sign in to existing account</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div className="footer-col" style={{ gridColumn: 'span 1' }}>
            <div className="footer-brand">
              <span className="landing-navbar__logo-icon" style={{ background: '#4f46e5', width: '28px', height: '28px', borderRadius: '6px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
              </span>
              TalentMatch
            </div>
            <p className="footer-desc">High-precision semantic ATS optimization workbench empowering candidates with real-time scoring and bullet harmonization.</p>
            <div className="footer-status">All Systems Operational</div>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Resume Parser & Scanner</a></li>
              <li><a href="#">Keyword Gap Inspector</a></li>
              <li><a href="#">Bullet Harmonization</a></li>
              <li><a href="#">Pricing & Credits</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Enterprise & Security</h4>
            <ul>
              <li><a href="#">SOC2 Type II Certified</a></li>
              <li><a href="#">GDPR Compliant</a></li>
              <li><a href="#">Privacy Framework</a></li>
              <li><a href="#">Security Whitepaper</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">Candidate Stories</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">System Status</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 TalentMatch Inc. Clarity ATS Platform. All rights reserved.</span>
          <span style={{ display: 'flex', gap: '20px' }}>
            <span>● All Systems Operational</span>
            <span>ISO 27001 Aligned</span>
          </span>
        </div>
      </footer>
    </>
  );
}
