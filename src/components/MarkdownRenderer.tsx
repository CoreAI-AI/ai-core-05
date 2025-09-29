import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize code blocks
          code: ({ children, ...props }) => {
            const { className: codeClassName } = props;
            const isInline = !codeClassName || !codeClassName.includes('language-');
            
            if (isInline) {
              return (
                <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-muted p-2 rounded text-xs font-mono overflow-x-auto" {...props}>
                {children}
              </code>
            );
          },
        // Customize links
        a: ({ children, href, ...props }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:text-primary/80 underline"
            {...props}
          >
            {children}
          </a>
        ),
        // Customize lists
        ul: ({ children, ...props }) => (
          <ul className="list-disc list-inside space-y-1" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal list-inside space-y-1" {...props}>
            {children}
          </ol>
        ),
        // Customize headings
        h1: ({ children, ...props }) => (
          <h1 className="text-lg font-semibold mt-4 mb-2 first:mt-0" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-base font-semibold mt-3 mb-2 first:mt-0" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-sm font-semibold mt-2 mb-1 first:mt-0" {...props}>
            {children}
          </h3>
        ),
        // Customize paragraphs
        p: ({ children, ...props }) => (
          <p className="leading-relaxed mb-2 last:mb-0" {...props}>
            {children}
          </p>
        ),
        // Customize blockquotes
        blockquote: ({ children, ...props }) => (
          <blockquote className="border-l-2 border-muted-foreground/20 pl-3 italic" {...props}>
            {children}
          </blockquote>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};