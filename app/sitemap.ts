import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.erosafkclient.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/panel`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5, // Panel sayfası genelde gizli olduğu için önceliği düşük tuttuk
    },
  ]
}