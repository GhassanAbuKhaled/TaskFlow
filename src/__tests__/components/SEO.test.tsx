import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@/test/test-utils';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '@/components/SEO';

describe('SEO Component', () => {
  it('sets document title correctly', async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Page" />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(document.title).toBe('Test Page | TaskFlow');
    });
  });

  it('sets meta description', async () => {
    render(
      <HelmetProvider>
        <SEO description="Test description" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription?.getAttribute('content')).toBe('Test description');
    });
  });

  it('sets meta keywords', async () => {
    render(
      <HelmetProvider>
        <SEO keywords="test, keywords" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      expect(metaKeywords?.getAttribute('content')).toBe('test, keywords');
    });
  });

  it('sets Open Graph meta tags', async () => {
    render(
      <HelmetProvider>
        <SEO title="Test Page" description="Test description" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');

      expect(ogTitle?.getAttribute('content')).toBe('Test Page | TaskFlow');
      expect(ogDescription?.getAttribute('content')).toBe('Test description');
    });
  });

  it('sets noindex in development mode', async () => {
    render(
      <HelmetProvider>
        <SEO noindex={true} />
      </HelmetProvider>
    );

    await waitFor(() => {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      expect(robotsMeta?.getAttribute('content')).toBe('noindex, nofollow');
    });
  });
});