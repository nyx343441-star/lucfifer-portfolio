export interface SocialLinkConfig {
  id: 'instagram' | 'modrinth' | 'x' | 'github' | 'discord';
  label: string;
  username: string;
  url: string | null;
}

export const SITE_CONFIG = {
  brandName: 'LUCFIFER',
  creatorName: 'Aditya',
  domain: 'lucfifer.pages.dev',
  canonicalUrl: 'https://lucfifer.pages.dev/',
  roleLine: 'WEB DESIGNER / VIDEO EDITOR / MINECRAFT MODDER / THUMBNAIL DESIGNER',
  profileImage: '/assets/aistudio/download_5b618834.jpg',
  thumbnailShowcaseImage: '/assets/aistudio/minecraft_hq_no_logo_d51b6385.png',
  instagramUrl: 'https://www.instagram.com/lucifer343441/',
  instagramHandle: '@lucifer343441',
  reviewsApiUrl: (import.meta.env.VITE_REVIEWS_API_URL as string | undefined)?.trim() || '',
  socialLinks: [
    {
      id: 'instagram',
      label: 'Instagram',
      username: '@lucifer343441',
      url: 'https://www.instagram.com/lucifer343441/',
    },
    {
      id: 'modrinth',
      label: 'Modrinth',
      username: 'Fuckit',
      url: 'https://modrinth.com/user/Fuckit',
    },
    {
      id: 'x',
      label: 'Twitter / X',
      username: '@Adix_07',
      url: 'https://x.com/Adix_07',
    },
    {
      id: 'github',
      label: 'GitHub',
      username: 'nyx343441-star',
      url: 'https://github.com/nyx343441-star',
    },
    {
      id: 'discord',
      label: 'Discord',
      username: '@Fuckit',
      url: null,
    },
  ] satisfies SocialLinkConfig[],
} as const;
