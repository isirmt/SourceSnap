import { MetadataRoute } from 'next';

const staticPaths = ['/tree'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = process.env.NEXT_PUBLIC_URL!;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseURL,
      priority: 1.0,
    },
  ];

  staticPaths.forEach((page) => {
    staticPages.push({
      url: baseURL + page,
      priority: 0.9,
    });
  });

  return [...staticPages];
}
