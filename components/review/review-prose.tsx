// components/review/review-prose.tsx
// Renders the AI-drafted review_content markdown with consistent Specs-Engine
// typography: serif/mono kickers, inline mono spec chips, generous H2 sections.

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ReviewProse({ content }: { content: string | null }) {
  if (!content) {
    return (
      <p className="font-mono text-[13px] text-ink-50">
        · review draft pending · ai-pipeline will publish on next sync
      </p>
    );
  }

  return (
    <div className="font-sans text-[15.5px] leading-[1.7] text-carbon-80">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-9 mb-2.5 font-display text-[30px] font-semibold tracking-[-0.03em] text-carbon">
              · {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 font-display text-[20px] font-semibold tracking-[-0.02em] text-carbon">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="my-3.5 text-carbon-80">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-3 list-none space-y-1 pl-0 font-mono text-[13.5px]">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="flex gap-2">
              <span className="text-rust">+</span>
              <span>{children}</span>
            </li>
          ),
          code: ({ children }) => (
            <code className="rounded-[3px] bg-paper px-1.5 py-px font-mono text-[0.92em] text-carbon">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-7 border-l-[3px] border-rust pl-5 font-mono text-[14px] italic text-carbon-80">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} className="border-b border-rust text-rust">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
