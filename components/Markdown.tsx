import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders master-roadmap text (already normalised by the generator). */
export function Markdown({ md, className }: { md: string; className?: string }) {
  if (!md) return null;
  return (
    <div className={`prose-master ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
