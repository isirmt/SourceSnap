import { headers } from 'next/headers';
import type { Metadata } from 'next';

interface Props {
  title?: string;
  description?: string;
}

export const siteName = 'SourceSnap';
export const siteDescription = 'Download Files/Folders from GitHub';

export async function generateMetadataTemplate(props: Props): Promise<Metadata> {
  const { title, description } = props;
  const outputTitle = title ? `${title} - ${siteName}` : siteName;
  const outputDescription = description ? description : siteDescription;

  let metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
    title: outputTitle,
    description: outputDescription,
    openGraph: {
      title: title ? title : siteName,
      description: outputDescription,
      url: new URL((await headers()).get('x-url')!).pathname,
      siteName,
      images: {
        url: `${process.env.NEXT_PUBLIC_URL!}/ogp.png`,
        width: 1200,
        height: 630,
      },
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: `${process.env.NEXT_PUBLIC_URL!}/ogp.png`,
      title: outputTitle,
      description: outputDescription,
    },
  };

  return metadata;
}
