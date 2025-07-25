import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@/test/test-utils';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '@/components/SEO';

const renderSEO = (props: any) => render(
  <HelmetProvider>
    <SEO {...props} />
  </HelmetProvider>
);

const getMeta = (selector: string) => document.querySelector(selector)?.getAttribute('content');

describe('SEO Component', () => {
  it('sets document title correctly', async () => {
    renderSEO({ title: 'Test Page' });
    await waitFor(() => {
      expect(document.title).toBe('Test Page | TaskFlow');
    });
  });

  it('sets meta description', async () => {
    renderSEO({ description: 'Test description' });
    await waitFor(() => {
      expect(getMeta('meta[name="description"]')).toBe('Test description');
    });
  });

  it('sets meta keywords', async () => {
    renderSEO({ keywords: 'test, keywords' });
    await waitFor(() => {
      expect(getMeta('meta[name="keywords"]')).toBe('test, keywords');
    });
  });

  it('sets Open Graph meta tags', async () => {
    renderSEO({ title: 'Test Page', description: 'Test description' });
    await waitFor(() => {
      expect(getMeta('meta[property="og:title"]')).toBe('Test Page | TaskFlow');
      expect(getMeta('meta[property="og:description"]')).toBe('Test description');
    });
  });

  it('sets noindex in development mode', async () => {
    renderSEO({ noindex: true });
    await waitFor(() => {
      expect(getMeta('meta[name="robots"]')).toBe('noindex, nofollow');
    });
  });
});