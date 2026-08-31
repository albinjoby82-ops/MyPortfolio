import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Long-form project write-up. Rendered at build time inside a server
 * component, so none of this ships as client JavaScript.
 *
 * Element styling is mapped explicitly to the design tokens rather than
 * using a typography plugin, so headings stay in Bricolage and body text
 * keeps the 16px / 1.65 rhythm the rest of the site uses.
 */
export default function Prose({ children }: { children: string }) {
  return (
    <div className="max-w-[68ch]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Rendered one level down from the markdown source: the page
          // already owns h1/h2, so a "## " section becomes an <h3>.
          h2: ({ children }) => (
            <h3 className="mb-4 mt-12 text-[26px] font-bold tracking-[-0.02em] first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-3 mt-8 text-[20px] font-bold tracking-[-0.02em]">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="pretty mb-4 text-[16px] leading-[1.65]">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-5 list-disc space-y-[6px] pl-5 text-[16px] leading-[1.65] marker:text-rust">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-5 list-decimal space-y-[6px] pl-5 text-[16px] leading-[1.65] marker:font-bold marker:text-rust">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pretty">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-ink">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-semibold text-rust underline underline-offset-2 transition-colors duration-[120ms] hover:text-rust-hover"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded-[4px] bg-chip-bg px-[6px] py-[2px] text-[14px] font-semibold">
              {children}
            </code>
          ),
          hr: () => <hr className="my-10 border-t-2 border-hairline" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
