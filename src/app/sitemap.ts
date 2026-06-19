export default async function sitemap() {
  return [
    {
      url: "https://post-mate.xyz/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
