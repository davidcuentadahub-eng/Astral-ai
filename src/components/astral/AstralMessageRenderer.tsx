import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface AstralMessageRendererProps {
  content: string;
}

const extractText = (node: any): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) {
    return extractText((node.props as any)?.children);
  }
  return '';
};

export const AstralMessageRenderer: React.FC<AstralMessageRendererProps> = ({ content }) => {
  return (
    <div className="markdown-body prose prose-invert max-w-none text-slate-200 text-[14px] leading-relaxed break-words">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-5 mb-3 border-b border-slate-800 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-white mt-4 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-cyan-300 mt-3 mb-1.5">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-slate-300 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 mb-3 pl-2 text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 mb-3 pl-2 text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-300 leading-relaxed marker:text-cyan-400">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cyan-500/60 bg-slate-900/60 rounded-r-xl px-4 py-2.5 my-3 italic text-slate-300">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse bg-slate-900/40">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900 text-cyan-300 border-b border-slate-800">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-2.5 font-semibold text-slate-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 border-b border-slate-850 text-slate-300">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-1 transition-colors"
            >
              <span>{children}</span>
              <ExternalLink className="w-3 h-3 inline" />
            </a>
          ),
          pre: ({ children }: any) => {
            if (React.isValidElement(children)) {
              const childProps = children.props as any;
              const match = /language-(\w+)/.exec(childProps?.className || '');
              const lang = match ? match[1] : '';
              const codeString = extractText(childProps?.children).replace(/\n$/, '');
              return <CodeBlock language={lang} code={codeString} />;
            }
            const rawCode = extractText(children).replace(/\n$/, '');
            return <CodeBlock language="" code={rawCode} />;
          },
          code: ({ node, className, children, ...props }: any) => {
            return (
              <code
                className={`px-1.5 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-mono text-[12px] border border-slate-700/60 ${className || ''}`.trim()}
                {...props}
              >
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-950 shadow-xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono uppercase font-semibold text-[11px] text-slate-300">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
          title="Copiar fragmento de código"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar código</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed selection:bg-cyan-500 selection:text-slate-950">
        <code>{code}</code>
      </pre>
    </div>
  );
};
