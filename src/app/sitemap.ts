export default async function sitemap() {
  return [
    {
      url: "https://postmate-one.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
