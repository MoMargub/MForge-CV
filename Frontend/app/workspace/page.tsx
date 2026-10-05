'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  useUploadResumeMutation,
  useScoreResumeMutation,
  useTailorResumeMutation,
  useUploadResumeNextMutation,
} from '@/lib/api';
import type { AtsResult, UploadResumePreview, ResumeData, StatusMsg, JdTab } from '@/types';

// ── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Wraps FastAPI ATS scoring mutation + local Next.js tailor mutation via TanStack Query.
 */
function useJdTailor(resumeData: ResumeData | null) {
  const [jd, setJd] = useState('');
  const [status, setStatus] = useState<StatusMsg | null>(null);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // ── TanStack Query Mutations ─────────────────────────────────────────────
  const scoreMutation = useScoreResumeMutation();
  const tailorMutation = useTailorResumeMutation();

  const handleScore = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      const trimmed = jd.trim();
      if (!trimmed) {
        setStatus({ type: 'error', text: 'Please paste a Job Description first.' });
        return;
      }
      setStatus(null);
      scoreMutation.mutate(
        { jd: trimmed, resumeData: resumeData ? JSON.stringify(resumeData) : undefined },
        {
          onSuccess: (data) => {
            setMatchedSkills(data.ats.matchedSkills ?? []);
            setStatus({ type: 'success', text: data.status });
          },
          onError: (err) => setStatus({ type: 'error', text: err.message }),
        }
      );
    },
    [jd, resumeData, scoreMutation]
  );

  const handleTailor = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      const trimmed = jd.trim();
      if (!trimmed) {
        setStatus({ type: 'error', text: 'Please paste a Job Description first.' });
        return;
      }
      setStatus(null);
      tailorMutation.mutate(
        { jd: trimmed, resumeData: resumeData ? JSON.stringify(resumeData) : undefined },
        {
          onSuccess: (data) => {
            setMatchedSkills(data.matchedSkills ?? []);
            setHasGenerated(true);
            setStatus({ type: 'success', text: data.status });
          },
          onError: (err) => setStatus({ type: 'error', text: err.message }),
        }
      );
    },
    [jd, resumeData, tailorMutation]
  );

  const loading = scoreMutation.isPending || tailorMutation.isPending;
  const ats = scoreMutation.data?.ats ?? null;

  return { jd, setJd, loading, status, ats, matchedSkills, hasGenerated, handleScore, handleTailor };
}

/**
 * Wraps FastAPI resume upload mutation + Next.js upload parser mutation via TanStack Query.
 */
function useResumeUploader() {
  const [uploadStatus, setUploadStatus] = useState<StatusMsg | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [preview, setPreview] = useState<UploadResumePreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  // TanStack Query Mutations
  const uploadFastApiMutation = useUploadResumeMutation();
  const uploadNextMutation = useUploadResumeNextMutation();

  const handleUpload = useCallback(
    async (file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf' && ext !== 'docx') {
        setUploadStatus({ type: 'error', text: 'Only .pdf or .docx files are accepted.' });
        return;
      }
      setUploadStatus(null);
      setPreview(null);
      setUploadedFile({ name: file.name, size: file.size });

      // 1. Call FastAPI for experience calculation + skill preview
      uploadFastApiMutation.mutate(file, {
        onSuccess: (data) => {
          setPreview(data.preview);
          setUploadStatus({ type: 'success', text: data.status });
        },
        onError: (err) => setUploadStatus({ type: 'error', text: err.message }),
      });

      // 2. Call Next.js route for full structured resume JSON
      uploadNextMutation.mutate(file, {
        onSuccess: (data) => {
          if (data.resumeData) {
            setResumeData(data.resumeData);
          }
        },
      });
    },
    [uploadFastApiMutation, uploadNextMutation]
  );

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  return {
    uploadStatus,
    uploading: uploadFastApiMutation.isPending || uploadNextMutation.isPending,
    uploadedFile,
    preview,
    isDragging,
    resumeData,
    handleUpload,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────

const Navbar = React.memo(() => (
  <nav className="landing-navbar" role="navigation" aria-label="Main navigation">
    <a href="/" className="landing-navbar__logo" aria-label="TalentMatch home">
      <span className="landing-navbar__logo-icon" aria-hidden="true" style={{ background: '#4f46e5', width: '32px', height: '32px', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
      </span>
      <span className="landing-navbar__logo-name">TalentMatch</span>
      <span className="landing-navbar__badge">Clarity ATS</span>
    </a>

    <div className="landing-navbar__nav">
      {(['Features', 'How it Works', 'ATS Scanner', 'Results', 'Pricing'] as const).map((label) => (
        <a key={label} href="#" className="landing-navbar__link">{label}</a>
      ))}
    </div>

    <div className="landing-navbar__right">
      <a href="#" className="landing-navbar__link landing-navbar__link--signin">Sign In</a>
      <button className="btn btn--primary btn--shadow btn--animated">Get Started Free ➔</button>
    </div>
  </nav>
));
Navbar.displayName = 'Navbar';

// ── JD Left Panel ──────────────────────────────────────────────────────────

interface JdPanelProps {
  jd: string;
  onJdChange: (v: string) => void;
  loading: boolean;
  status: StatusMsg | null;
  hasGenerated: boolean;
  onTailor: (e?: React.MouseEvent) => void;
  onScore: (e?: React.MouseEvent) => void;
  activeTab: JdTab;
  onTabChange: (t: JdTab) => void;
  jdFile: { name: string; size: number } | null;
  onJdFileUpload: (f: File) => void;
}

const JdPanel = React.memo(({
  jd, onJdChange, loading, status, hasGenerated,
  onTailor, onScore, activeTab, onTabChange, jdFile, onJdFileUpload,
}: JdPanelProps) => {
  const jdInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const wordCount = jd.trim() ? jd.trim().split(/\s+/).length : 0;

  // Detect JD metadata heuristically
  const titleMatch = jd.match(/(?:title|role|position)[:\s]+([^\n,]+)/i);
  const companyMatch = jd.match(/(?:company|at|@)\s+([A-Z][A-Za-z\s&.,]+)/);
  const seniorityMatch = jd.match(/\b(junior|mid[\s-]?level|senior|lead|principal|staff|director)\b/i);

  const jdTitle = titleMatch?.[1]?.trim() ?? (jd ? 'Detected from JD' : '—');
  const jdCompany = companyMatch?.[1]?.trim() ?? '—';
  const seniority = seniorityMatch?.[1]
    ? `${seniorityMatch[1].charAt(0).toUpperCase()}${seniorityMatch[1].slice(1)} (5+ yrs)`
    : '—';

  const handleJdDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onJdFileUpload(file);
  };

  return (
    <section className="panel" aria-labelledby="jd-panel-title">
      {/* Header */}
      <div className="panel__header">
        <h2 id="jd-panel-title" className="panel__title">
          <span aria-hidden="true">📄</span> Target Job Description
        </h2>
        <div className="panel__actions">
          {(['upload', 'paste', 'url'] as JdTab[]).map((tab) => (
            <button
              key={tab}
              className={`jd-tab${activeTab === tab ? ' jd-tab--active' : ''}`}
              onClick={() => onTabChange(tab)}
              aria-pressed={activeTab === tab}
            >
              {tab === 'upload' && '⬆ Upload Doc'}
              {tab === 'paste' && '✏ Paste Text'}
              {tab === 'url' && '🔗 Import URL'}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone (upload tab or when no JD) */}
      {(activeTab === 'upload' && !jdFile) && (
        <div className="drop-zone-wrap">
          <div
            className={`drop-zone${isDragging ? ' drop-zone--active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleJdDrop}
            onClick={() => jdInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload job description file"
            onKeyDown={(e) => e.key === 'Enter' && jdInputRef.current?.click()}
          >
            <input
              ref={jdInputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,text/plain"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onJdFileUpload(f); e.target.value = ''; }}
            />
            <div className="drop-zone__icon-wrap" aria-hidden="true">📄</div>
            <p className="drop-zone__title">
              Drag &amp; drop target JD, or <a>browse files</a>
            </p>
            <p className="drop-zone__sub">Supports PDF, DOCX, TXT (up to 10MB)</p>
          </div>
          <div className="drop-zone-sample-row">
            or test immediately:
            <button
              className="btn btn--sm"
              onClick={() => {
                onTabChange('paste');
                onJdChange('We are looking for a Senior Frontend Engineer to lead the architecture of our high-volume checkout interface. Requirements: React, TypeScript, Next.js, Node.js, REST APIs, Docker, AWS.');
              }}
            >
              ⊙ Load Sample Senior Frontend JD
            </button>
          </div>
        </div>
      )}

      {/* File item after JD upload */}
      {jdFile && (
        <div className="file-item">
          <div className={`file-item__icon${jdFile.name.endsWith('.docx') ? ' file-item__icon--docx' : ''}`}>
            {jdFile.name.endsWith('.docx') ? '📘' : '📕'}
          </div>
          <div className="file-item__info">
            <div className="file-item__name">{jdFile.name}</div>
            <div className="file-item__meta">
              {Math.round(jdFile.size / 1024)} KB · {wordCount.toLocaleString()} words parsed
            </div>
          </div>
          <span className="file-item__badge">✓ Ready for scan</span>
          <div className="file-item__actions">
            <button className="btn btn--icon btn--ghost" aria-label="Preview file" title="Preview">👁</button>
            <button
              className="btn btn--icon btn--ghost"
              aria-label="Remove file"
              title="Remove"
              onClick={() => { onJdChange(''); onTabChange('upload'); }}
            >
              🗑
            </button>
          </div>
        </div>
      )}

      {/* Text area (paste tab or after upload with text) */}
      {(activeTab === 'paste' || (activeTab === 'upload' && jdFile)) && (
        <div className="jd-text-section">
          <div className="jd-text-header">
            <span>
              <span className="jd-text-label">Direct Job Description Text</span>
              <span className="jd-text-sub">(Editable preview)</span>
            </span>
            <div className="jd-text-meta">
              {wordCount > 0 && <span className="jd-word-count">{wordCount.toLocaleString()} words</span>}
              {jd && (
                <button className="btn btn--ghost btn--sm" onClick={() => onJdChange('')}>
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            id="jd-textarea"
            className="jd-textarea"
            placeholder="Paste the job description here… (Ctrl+Enter to tailor)"
            value={jd}
            onChange={(e) => onJdChange(e.target.value)}
            onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); onTailor(); } }}
            disabled={loading}
            rows={8}
          />
        </div>
      )}

      {/* Detected metadata */}
      {jd.trim().length > 40 && (
        <div className="jd-meta-row" role="region" aria-label="Detected JD metadata">
          <div className="jd-meta-card">
            <div className="jd-meta-label">Detected Title</div>
            <div className="jd-meta-value">{jdTitle}</div>
          </div>
          <div className="jd-meta-card">
            <div className="jd-meta-label">Target Company</div>
            <div className="jd-meta-value">{jdCompany}</div>
          </div>
          <div className="jd-meta-card">
            <div className="jd-meta-label">Seniority Tier</div>
            <div className="jd-meta-value">{seniority}</div>
          </div>
        </div>
      )}

      {/* Status */}
      {status && (
        <div className={`status-msg status-msg--${status.type}`} role="status" aria-live="polite">
          {status.text}
        </div>
      )}

      {/* Actions */}
      <div className="action-row">
        <button
          id="btn-extract-keywords"
          className="btn"
          onClick={onScore}
          disabled={loading}
          aria-busy={loading}
        >
          🔍 Extract Keywords
        </button>
        <button
          id="btn-check-ats"
          className="btn"
          onClick={onScore}
          disabled={loading}
        >
          📊 Check ATS Score
        </button>
        <button
          id="btn-tailor-pdf"
          className="btn btn--primary btn--lg"
          style={{ marginLeft: 'auto' }}
          onClick={onTailor}
          disabled={loading}
          aria-busy={loading}
        >
          {loading
            ? <><span className="spinner" aria-hidden="true" />Processing…</>
            : <>✦ Tailor &amp; Generate PDF →</>}
        </button>
        {hasGenerated && (
          <a
            id="btn-view-pdf"
            href="/api/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            View PDF ↗
          </a>
        )}
      </div>
    </section>
  );
});
JdPanel.displayName = 'JdPanel';

// ── CV Preview Panel ───────────────────────────────────────────────────────

interface CvPanelProps {
  resumeData: ResumeData | null;
  preview: UploadResumePreview | null;
  uploading: boolean;
  uploadedFile: { name: string; size: number } | null;
  uploadStatus: StatusMsg | null;
  isDragging: boolean;
  onUpload: (f: File) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

const CvPanel = React.memo(({
  resumeData, preview, uploading, uploadedFile, uploadStatus,
  isDragging, onUpload, onDragOver, onDragLeave, onDrop,
}: CvPanelProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="panel cv-panel" aria-label="Source CV preview">
      <div className="panel__header">
        <div className="cv-header-row" style={{ width: '100%' }}>
          <h2 className="panel__title">
            <span aria-hidden="true">📋</span>
            <span>Source CV<br /><span style={{ fontWeight: 400, fontSize: '11px', color: 'var(--text-3)' }}>Document Preview</span></span>
          </h2>
          <div className="cv-actions">
            {resumeData && (
              <div className="cv-zoom-controls" aria-label="Zoom controls">
                <button className="btn btn--icon btn--ghost" aria-label="Zoom out">🔍</button>
                <span>100%</span>
                <button className="btn btn--icon btn--ghost" aria-label="Zoom in">🔎</button>
              </div>
            )}
            <button
              id="btn-replace-cv"
              className="btn btn--replace btn--sm"
              onClick={() => fileRef.current?.click()}
              aria-label="Replace CV"
            >
              ↻ Replace CV
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ''; }}
            />
          </div>
        </div>
      </div>

      {uploading ? (
        <div className="cv-upload-inner">
          <span className="spinner" aria-label="Uploading resume" style={{ width: 28, height: 28 }} />
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Parsing resume…</p>
        </div>
      ) : resumeData ? (
        <>
          <div className="resume-doc" aria-label="Resume preview">
            <div className="resume-doc__name">{resumeData.personalInfo?.name}</div>
            <div className="resume-doc__title-badge">{resumeData.personalInfo?.title}</div>
            <div className="resume-doc__contact">
              {resumeData.personalInfo?.email && (
                <div className="resume-doc__contact-item">✉ {resumeData.personalInfo.email}</div>
              )}
              {resumeData.personalInfo?.phone && (
                <div className="resume-doc__contact-item">📞 {resumeData.personalInfo.phone}</div>
              )}
              {resumeData.personalInfo?.location && (
                <div className="resume-doc__contact-item">📍 {resumeData.personalInfo.location}</div>
              )}
              {resumeData.personalInfo?.linkedin && (
                <div className="resume-doc__contact-item">
                  🔗 {typeof resumeData.personalInfo.linkedin === 'string' ? resumeData.personalInfo.linkedin : resumeData.personalInfo.linkedin.url}
                </div>
              )}
            </div>

            {resumeData.professionalSummary && (
              <>
                <hr className="resume-doc__divider" />
                <div className="resume-doc__section-title">Professional Summary</div>
                <p className="resume-doc__summary">{resumeData.professionalSummary}</p>
              </>
            )}

            {(resumeData.professionalExperience?.length || 0) > 0 && (
              <>
                <hr className="resume-doc__divider" />
                <div className="resume-doc__section-title">Work Experience</div>
                {resumeData.professionalExperience?.map((exp: any, i: number) => (
                  <div key={i} className="resume-doc__exp">
                    <div className="resume-doc__exp-header">
                      <div>
                        <div className="resume-doc__exp-title">
                          {exp.title} • <span style={{ fontWeight: 500 }}>{exp.company}</span>
                        </div>
                      </div>
                      <div className="resume-doc__exp-dates">{exp.dates}</div>
                    </div>
                    {(exp.bullets?.length || 0) > 0 && (
                      <ul className="resume-doc__bullets">
                        {exp.bullets.slice(0, 3).map((b: string, j: number) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}
            {/* FastAPI experience badge */}
            {preview && (
              <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--surface-2, #1e2030)', borderRadius: '10px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>⏱ Experience</span><br />
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#4f46e5' }}>
                    {preview.experience?.years ?? preview.experienceYears ?? 0}y {preview.experience?.months ?? preview.experienceMonths ?? 0}m
                  </span>
                  <span style={{ marginLeft: 6, opacity: 0.6 }}>
                    ({preview.experience?.totalMonths ?? preview.experienceTotalMonths ?? 0} months total)
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>🛠 Skills Detected</span><br />
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#4f46e5' }}>{preview.skillCount}</span>
                  {preview.skills && preview.skills.length > 0 && (
                    <span style={{ marginLeft: 6, opacity: 0.6 }}>
                      {preview.skills.slice(0, 3).join(', ')}{preview.skills.length > 3 ? '…' : ''}
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>

          <div className="cv-footer">
            <span>{uploadedFile?.name ?? 'resume.pdf'} ({Math.round((uploadedFile?.size ?? 0) / 1024)} KB)</span>
            <span className="cv-footer__badge">ATS Compliant Format</span>
          </div>
        </>
      ) : (
        <div
          className={`cv-upload-inner${isDragging ? ' drop-zone--active' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="drop-zone" style={{ maxWidth: '320px' }} onClick={() => fileRef.current?.click()} role="button" tabIndex={0} aria-label="Upload your resume">
            <div className="drop-zone__icon-wrap" aria-hidden="true">📄</div>
            <p className="drop-zone__title">
              {isDragging ? 'Drop to upload' : <>Drag &amp; drop or <a>browse files</a></>}
            </p>
            <p className="drop-zone__sub">PDF or DOCX · max 10 MB</p>
          </div>
          {uploadStatus && (
            <div className={`status-msg status-msg--${uploadStatus.type}`} role="status" aria-live="polite" style={{ margin: '8px 0 0', textAlign: 'left', width: '100%', maxWidth: 320 }}>
              {uploadStatus.text}
            </div>
          )}
        </div>
      )}
    </aside>
  );
});
CvPanel.displayName = 'CvPanel';

// ── ATS Breakdown ──────────────────────────────────────────────────────────

const AtsSection = React.memo(({ ats, matchedSkills }: { ats: AtsResult; matchedSkills: string[] }) => {
  const label = ats.score >= 80 ? 'High Pass' : ats.score >= 60 ? 'Good Match' : 'Needs Work';
  const tier = ats.score >= 80 ? 'Top 8% Fit' : ats.score >= 60 ? 'Top 25% Fit' : 'Below Average';

  const breakdown = ats.breakdown ?? { skills: 0, summary: 0, experience: 0, projects: 0, format: 0, density: 0 };
  const breakdownItems = [
    { label: 'Skills Match', value: breakdown.skills, max: 45 },
    { label: 'Summary Match', value: breakdown.summary, max: 15 },
    { label: 'Experience Match', value: breakdown.experience, max: 20 },
    { label: 'Projects Match', value: breakdown.projects, max: 10 },
    { label: 'Format', value: breakdown.format, max: 5 },
    { label: 'Keyword Density', value: breakdown.density, max: 5 },
  ];

  const matched = matchedSkills.length;
  const missing = ats.missingSkills?.length ?? 0;

  return (
    <section className="ats-section" aria-labelledby="ats-title">
      <div className="ats-section__header">
        <div>
          <h2 id="ats-title" className="ats-section__title">
            <span aria-hidden="true">📊</span> ATS Diagnostic Breakdown
          </h2>
          <p className="ats-section__sub">Accordion review of qualification matches, gaps &amp; keyword health</p>
        </div>
        <span className="ats-fit-badge">● {tier}</span>
      </div>

      <div className="ats-cards" role="list">
        <div className="ats-card" role="listitem">
          <div className="ats-card__score-box ats-card__score-box--green" aria-label={`ATS score: ${ats.score}`}>
            {ats.score}
          </div>
          <div>
            <div className="ats-card__label">ATS Match</div>
            <div className="ats-card__value">{label}</div>
          </div>
        </div>

        <div className="ats-card" role="listitem">
          <div className="ats-card__icon ats-card__icon--green" aria-hidden="true">✓</div>
          <div>
            <div className="ats-card__label">Strengths</div>
            <div className="ats-card__value">{matched} Matched</div>
            <div className="ats-card__sub ats-card__sub--green">+{matched} keywords found</div>
          </div>
        </div>

        <div className="ats-card" role="listitem">
          <div className="ats-card__icon ats-card__icon--amber" aria-hidden="true">⚠</div>
          <div>
            <div className="ats-card__label">Lacks/Gaps</div>
            <div className="ats-card__value">{missing} Critical</div>
            <div className="ats-card__sub ats-card__sub--amber">
              {missing > 0 ? 'Add to resume' : 'None detected'}
            </div>
          </div>
        </div>
      </div>

      <div className="ats-breakdown-list" role="list" aria-label="Score breakdown">
        {breakdownItems.map(({ label, value, max }) => (
          <div key={label} className="ats-breakdown-item" role="listitem">
            <span className="ats-breakdown-item__label">{label}</span>
            <div className="ats-breakdown-item__bar-wrap" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
              <div
                className="ats-breakdown-item__bar"
                style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
              />
            </div>
            <span className="ats-breakdown-item__score">{value}/{max}</span>
          </div>
        ))}
      </div>

      {matchedSkills.length > 0 && (
        <div className="chips-section">
          <div className="chips-section__title">Matched Skills ({matched})</div>
          <div className="chips" role="list">
            {matchedSkills.map((s) => (
              <span key={s} className="chip" role="listitem">{s}</span>
            ))}
          </div>
        </div>
      )}

      {ats.missingSkills && ats.missingSkills.length > 0 && (
        <div className="chips-section">
          <div className="chips-section__title" style={{ color: 'var(--red)' }}>
            Missing Skills ({missing})
          </div>
          <div className="chips" role="list">
            {ats.missingSkills.map((s) => (
              <span key={s} className="chip chip--missing" role="listitem">{s}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
});
AtsSection.displayName = 'AtsSection';

// ── Root Page ──────────────────────────────────────────────────────────────

export default function Page() {
  const {
    uploadStatus, uploading, uploadedFile, resumeData, isDragging, preview,
    handleUpload, onDragOver, onDragLeave, onDrop,
  } = useResumeUploader();
  
  const { jd, setJd, loading, status, ats, matchedSkills, hasGenerated, handleScore, handleTailor } = useJdTailor(resumeData);

  const [activeTab, setActiveTab] = useState<JdTab>('upload');
  const [jdFile, setJdFile] = useState<{ name: string; size: number } | null>(null);

  const handleJdFileUpload = useCallback(async (file: File) => {
    setJdFile({ name: file.name, size: file.size });
    setActiveTab('upload');
    // Try to read as text for txt files
    if (file.name.endsWith('.txt')) {
      const text = await file.text();
      setJd(text);
    }
  }, [setJd]);

  return (
    <>
      <Navbar />

      <main className="page-wrapper" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {/* Application Workspace */}
        <div className="page" id="app-workspace" style={{ paddingTop: '24px' }}>
          <div className="status-row" aria-label="System status">
            <span className="badge">⚙ Model: GPT-4o Resume Matcher</span>
            <span className="badge badge--active"><span className="badge__dot" aria-hidden="true" />Parser v4.2 Active</span>
            <span className="badge">☰ Variant A: Accordion Breakdown</span>
          </div>

        {/* Two-panel workspace */}
        <div className="workspace">
          <JdPanel
            jd={jd}
            onJdChange={setJd}
            loading={loading}
            status={status}
            hasGenerated={hasGenerated}
            onTailor={handleTailor}
            onScore={handleScore}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            jdFile={jdFile}
            onJdFileUpload={handleJdFileUpload}
          />

          <CvPanel
            resumeData={resumeData}
            preview={preview}
            uploading={uploading}
            uploadedFile={uploadedFile}
            uploadStatus={uploadStatus}
            isDragging={isDragging}
            onUpload={handleUpload}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          />
        </div>

        {/* ATS breakdown — appears after scoring */}
        {ats && <AtsSection ats={ats} matchedSkills={matchedSkills} />}
        </div>
      </main>

      <footer className="site-footer">
        <span>✦ © 2025 CV Tailor AI • Clarity ATS Platform. All rights reserved.</span>
        <div className="site-footer__links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">ATS Benchmarks</a>
        </div>
      </footer>
    </>
  );
}
