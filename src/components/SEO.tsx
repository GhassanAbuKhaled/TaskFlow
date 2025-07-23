import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string; // Optional
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
};

const SEO = ({
  title = 'TaskFlow',
  description = 'A beautiful and calming task management application',
  keywords,
  canonicalUrl,
  ogImage = '/placeholder.svg',
  ogType = 'website',
  noindex = process.env.NODE_ENV === 'development', // Default to noindex in development
}: SEOProps) => {
  const location = useLocation();

  // Format the final page title
  const siteTitle = title ? `${title} | TaskFlow` : 'TaskFlow';

  // Construct the correct OG image URL (assumes image is in public/)
  const imageUrl = ogImage.startsWith('http')
    ? ogImage
    : `${window.location.origin}${ogImage}`;

  // Determine canonical URL (either passed in or auto-generated in production)
  const canonical = canonicalUrl || (
    process.env.NODE_ENV === 'production'
      ? `${window.location.origin}${location.pathname}`
      : undefined
  );

  return (
    <Helmet>
      {/* ===== Page Title ===== */}
      <title>{siteTitle}</title>

      {/* ===== Meta Description ===== */}
      <meta name="description" content={description} />

      {/* ===== Optional Keywords ===== */}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* ===== Robots Meta for Noindex ===== */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* ===== Canonical URL ===== */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* ===== Open Graph Tags (Facebook / LinkedIn / etc.) ===== */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* ===== Twitter Card Tags ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SEO;
