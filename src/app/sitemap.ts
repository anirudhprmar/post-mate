export default async function sitemap() {
  return [
    {
      url: "https://postmate.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
