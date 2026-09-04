import { Helmet } from "react-helmet-async";
import type { PageContent } from "../types";

const SITE_URL = "https://regiuslab.by";

export function Seo({ page }: { page: PageContent }) {
  const canonical = `${SITE_URL}${page.path}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "RegiusLab",
        url: SITE_URL,
      },
      {
        "@type": page.kind === "sales" ? "Product" : "Service",
        name: page.title,
        description: page.seo.description,
        url: canonical,
        provider: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "RegiusLab", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: page.navLabel, item: canonical },
        ],
      },
    ],
  };

  return (
    <Helmet>
      <html lang="ru" />
      <title>{page.seo.title}</title>
      <meta name="description" content={page.seo.description} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="RegiusLab" />
      <meta property="og:locale" content="ru_BY" />
      <meta property="og:title" content={page.seo.title} />
      <meta property="og:description" content={page.seo.description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
