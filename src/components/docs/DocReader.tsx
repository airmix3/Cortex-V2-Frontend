'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Inline formatter ──────────────────────────────────────────────────────────

function fmt(text: string, accent: string): string {
  let out = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  out = out.replace(
    /\*\*(.*?)\*\*/g,
    '<strong style="color:rgba(255,255,255,0.95);font-weight:600">$1</strong>'
  );
  out = out.replace(
    /\*(.*?)\*/g,
    '<em style="color:rgba(255,255,255,0.85);font-style:italic">$1</em>'
  );
  out = out.replace(
    /`(.*?)`/g,
    `<code style="background:rgba(255,255,255,0.05);color:${accent};padding:1px 7px;border-radius:4px;font-size:12.5px;font-family:monospace">$1</code>`
  );
  return out;
}

// ── FadeIn — exported so Guide page can use it ────────────────────────────────

export function FadeIn({
  children,
  delay = 0,
  className = '',
  distance = 22,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setVisible(true), delay);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.04, rootMargin: '0px 0px -48px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : `translateY(${distance}px)`,
        transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {children}
    </div>
  );
}

// ── Episode body renderer ─────────────────────────────────────────────────────

function Body({ text, accent, leadParagraph = false }: { text: string; accent: string; leadParagraph?: boolean }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let firstParaDone = false;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---\s*$/.test(line.trim())) {
      elements.push(
        <div key={`hr-${i}`} className="my-10 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
      );
      i++;
      continue;
    }

    // h3 subsection header
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-[17px] font-semibold mt-12 mb-4 leading-snug"
          style={{ color: accent }}
        >
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-outside ml-6 my-5 space-y-2.5">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="text-[15px] leading-[1.85]"
              style={{ color: 'rgba(255,255,255,0.60)' }}
              dangerouslySetInnerHTML={{ __html: fmt(item, accent) }}
            />
          ))}
        </ol>
      );
      continue;
    }

    // Unordered list
    if (line.trim().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-5 space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3.5">
              <span
                className="mt-[11px] w-[3px] h-[3px] rounded-full shrink-0"
                style={{ background: accent, opacity: 0.4 }}
              />
              <span
                className="text-[15px] leading-[1.88]"
                style={{ color: 'rgba(255,255,255,0.60)' }}
                dangerouslySetInnerHTML={{ __html: fmt(item, accent) }}
              />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Italic-only line (closing statement, transition note)
    if (/^_.*_$/.test(line.trim())) {
      elements.push(
        <p
          key={`it-${i}`}
          className="text-[15px] italic my-8 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.50)' }}
        >
          {line.trim().slice(1, -1)}
        </p>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive content lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].trim().startsWith('- ') &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !/^---\s*$/.test(lines[i].trim()) &&
      !/^_.*_$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length > 0) {
      const isLead = leadParagraph && !firstParaDone;
      if (isLead) firstParaDone = true;
      elements.push(
        <Paragraph key={`p-${i}`} text={paraLines.join(' ')} accent={accent} isLead={isLead} />
      );
    }
  }

  return <>{elements}</>;
}

// ── Paragraph with hover brightening ─────────────────────────────────────────

function Paragraph({ text, accent, isLead = false }: { text: string; accent: string; isLead?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <p
      className="cursor-default"
      style={{
        fontSize: isLead ? '17px' : '15px',
        lineHeight: isLead ? '1.95' : '1.9',
        margin: isLead ? '0 0 28px 0' : '0 0 20px 0',
        color: hovered
          ? (isLead ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.78)')
          : (isLead ? 'rgba(255,255,255,0.70)' : 'rgba(255,255,255,0.58)'),
        transition: 'color 0.25s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      dangerouslySetInnerHTML={{ __html: fmt(text, accent) }}
    />
  );
}

// ── Reading progress bar ──────────────────────────────────────────────────────

function ReadingProgress({
  containerRef,
  accent,
}: {
  containerRef: { current: HTMLDivElement | null };
  accent: string;
}) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight) return;
      setPct(scrollTop / (scrollHeight - clientHeight));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] z-30 pointer-events-none">
      <div
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${accent}60, ${accent}bb)`,
          transition: 'width 80ms linear',
        }}
      />
    </div>
  );
}

// ── Floating TOC ──────────────────────────────────────────────────────────────

function TOCDot({
  num,
  label,
  isActive,
  accent,
  onClick,
}: {
  num: number;
  label: string;
  isActive: boolean;
  accent: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const showLabel = isActive || hovered;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2.5 cursor-pointer"
      style={{ background: 'none', border: 'none', padding: 0 }}
    >
      {/* Label — slides in from right on hover/active */}
      <span
        style={{
          fontSize: '10px',
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          color: isActive ? accent : 'rgba(255,255,255,0.35)',
          opacity: showLabel ? 1 : 0,
          transform: showLabel ? 'translateX(0px)' : 'translateX(6px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease, color 0.18s ease',
          pointerEvents: 'none',
        }}
      >
        {label}
      </span>

      {/* Dot */}
      <span
        style={{
          display: 'block',
          borderRadius: '50%',
          flexShrink: 0,
          width: isActive ? '7px' : hovered ? '5px' : '4px',
          height: isActive ? '7px' : hovered ? '5px' : '4px',
          background: isActive ? accent : hovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)',
          transition: 'all 0.18s ease',
          boxShadow: isActive ? `0 0 8px ${accent}70` : 'none',
        }}
      />
    </button>
  );
}

function FloatingTOC({
  episodes,
  accent,
  containerRef,
}: {
  episodes: { number: number; title: string }[];
  accent: string;
  containerRef: { current: HTMLDivElement | null };
}) {
  const [active, setActive] = useState(0); // 0 = intro

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting entry — that's what the reader is on
        let topmost: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (
              !topmost ||
              entry.boundingClientRect.top < topmost.boundingClientRect.top
            ) {
              topmost = entry;
            }
          }
        }
        if (topmost) {
          const num = topmost.target.getAttribute('data-episode');
          setActive(num !== null ? Number(num) : 0);
        }
      },
      {
        root: container,
        threshold: 0,
        // Trigger when the top edge of an element crosses the top 40% of the container
        rootMargin: '0px 0px -60% 0px',
      }
    );

    const els = container.querySelectorAll('[data-episode]');
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [containerRef, episodes.length]);

  const scrollToEpisode = useCallback(
    (num: number) => {
      const container = containerRef.current;
      if (!container) return;
      if (num === 0) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = container.querySelector(`[data-episode="${num}"]`) as HTMLElement | null;
      if (el) {
        // Use getBoundingClientRect for accurate position within the scroll container
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const targetScroll = container.scrollTop + (elRect.top - containerRect.top) - 88;
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    },
    [containerRef]
  );

  return (
    <div
      className="fixed right-7 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-end gap-[9px]"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Intro dot */}
      <TOCDot
        num={0}
        label="intro"
        isActive={active === 0}
        accent={accent}
        onClick={() => scrollToEpisode(0)}
      />

      {episodes.map((ep) => (
        <TOCDot
          key={ep.number}
          num={ep.number}
          label={`${String(ep.number).padStart(2, '0')} · ${ep.title.length > 20 ? ep.title.slice(0, 20) + '…' : ep.title}`}
          isActive={active === ep.number}
          accent={accent}
          onClick={() => scrollToEpisode(ep.number)}
        />
      ))}
    </div>
  );
}

// ── Episode section ───────────────────────────────────────────────────────────

function Episode({
  number,
  title,
  body,
  accent,
  isLast,
}: {
  number: number;
  title: string;
  body: string;
  accent: string;
  isLast: boolean;
}) {
  const num = String(number).padStart(2, '0');

  return (
    <FadeIn>
      <div className="mt-20" data-episode={number}>
        {/* Episode marker */}
        <div className="flex items-center gap-5 mb-7">
          <span
            className="text-[11px] font-mono tracking-[0.22em] shrink-0"
            style={{ color: accent, opacity: 0.45 }}
          >
            {num}
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
        </div>

        {/* Episode title */}
        <h2 className="text-[28px] font-bold text-white leading-[1.2] tracking-[-0.012em] mb-8">
          {title}
        </h2>

        {/* Episode body — first paragraph gets lead styling */}
        <Body text={body} accent={accent} leadParagraph={true} />

        {/* Spacer between episodes */}
        {!isLast && (
          <div className="mt-16 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
        )}
      </div>
    </FadeIn>
  );
}

// ── Main DocReader ────────────────────────────────────────────────────────────

export default function DocReader({
  content,
  accent = '#38bdf8',
}: {
  content: string;
  accent?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Parse content ────────────────────────────────────────────────────────────
  // Split at every "## " boundary.
  // Convention: parts[0] = before first ##, parts[1] = subtitle + intro body,
  // parts[2+] = numbered episodes.
  const parts = content.split(/^## /m);

  const introRaw =
    parts[0] + (parts.length >= 2 ? '## ' + parts[1] : '');

  // Extract h1 title, h2 subtitle, and intro body paragraphs
  const introLines = introRaw.split('\n');
  let titleText = '';
  let subtitleText = '';
  const introParagraphLines: string[] = [];
  let pastHeaders = false;

  for (const line of introLines) {
    if (line.startsWith('# ') && !titleText) {
      titleText = line.slice(2).trim();
    } else if (line.startsWith('## ') && !subtitleText && !pastHeaders) {
      subtitleText = line.slice(3).trim();
    } else if (line.trim() === '---') {
      // skip --- dividers in the intro header area
    } else if (line.trim() !== '') {
      pastHeaders = true;
      introParagraphLines.push(line);
    }
  }

  const introBody = introParagraphLines.join('\n');

  // Episodes = parts[2+]
  const episodeParts = parts.slice(2);
  const episodes = episodeParts.map((part, i) => {
    const nl = part.indexOf('\n');
    return {
      number: i + 1,
      title: nl >= 0 ? part.slice(0, nl).trim() : part.trim(),
      body: nl >= 0 ? part.slice(nl + 1) : '',
    };
  });

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-y-auto"
      style={{
        background: '#0a0e1a',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.05) transparent',
      }}
    >
      {/* Reading progress */}
      <ReadingProgress containerRef={containerRef} accent={accent} />

      {/* Floating TOC — only shown if there are episodes */}
      {episodes.length > 0 && (
        <FloatingTOC episodes={episodes} accent={accent} containerRef={containerRef} />
      )}

      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: 'absolute',
            width: '900px',
            height: '900px',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `radial-gradient(circle, ${accent}07 0%, transparent 60%)`,
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            top: '60%',
            left: '30%',
            background: `radial-gradient(circle, ${accent}04 0%, transparent 70%)`,
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Content column */}
      <div className="relative z-10 max-w-[660px] mx-auto px-8 pt-20 pb-36">

        {/* Title + subtitle + intro */}
        <FadeIn>
          <div data-episode={0}>
          {/* Title */}
          <h1
            className="text-[46px] font-bold text-white leading-[1.08] tracking-[-0.025em] mb-5"
          >
            {titleText}
          </h1>

          {/* Subtitle */}
          {subtitleText && (
            <p
              className="text-[15px] leading-[1.7] mb-12"
              style={{ color: 'rgba(255,255,255,0.30)' }}
            >
              {subtitleText}
            </p>
          )}

          {/* Accent rule */}
          <div className="flex items-center gap-4 mb-12">
            <div
              className="h-[1.5px] w-10 rounded-full"
              style={{ background: accent, opacity: 0.5 }}
            />
            <div
              className="h-px flex-1"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />
          </div>

          {/* Intro body — first paragraph gets lead styling */}
          {introBody && <Body text={introBody} accent={accent} leadParagraph={true} />}
          </div>
        </FadeIn>

        {/* Episodes */}
        {episodes.map((ep, i) => (
          <Episode
            key={i}
            number={ep.number}
            title={ep.title}
            body={ep.body}
            accent={accent}
            isLast={i === episodes.length - 1}
          />
        ))}

        {/* Footer breathing room */}
        <div className="h-10" />
      </div>
    </div>
  );
}
