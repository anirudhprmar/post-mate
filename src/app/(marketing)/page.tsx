import { homePageStructuredData } from "~/lib/constants";

export default function HomePage() {
  // this is how every page should be
  return (
    <>
      {homePageStructuredData.map((schema, index) => (
        <script
          key={`${schema["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="relative pt-[45px] lg:pt-0"></div>
    </>
  );
}
