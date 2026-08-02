import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
}

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
};

/** Lightweight per-route head manager (title, description, OG, canonical, JSON-LD). */
export const Seo = ({ title, description, canonical = "/", jsonLd }: SeoProps) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      script?.remove();
    };
  }, [title, description, canonical, jsonLd]);

  return null;
};
