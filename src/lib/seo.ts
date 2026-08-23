import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "TheOldverse Productions",
  shortName: "TheOldverse",
  domain: "theoldverse-productions.in",
  baseUrl: "https://theoldverse-productions.in",
  tagline: "Film & Creative Production House in Dehradun",
  description: "TheOldverse Productions is an independent film production house in Dehradun, Uttarakhand. We specialize in original films, cinematography, video editing, direction, screenplay writing, commercials, and music video production.",
  location: {
    city: "Dehradun",
    state: "Uttarakhand",
    country: "India",
    countryCode: "IN",
    formattedAddress: "Dehradun, Uttarakhand, India"
  },
  contact: {
    email: "theoldverse@gmail.com",
    phone: "+91 90688 50966"
  },
  socials: {
    instagram: "https://instagram.com/theoldverse_",
    youtube: "https://youtube.com/@The_oldverse",
    founderInstagram: "https://instagram.com/psf_vivek"
  },
  founders: [
    {
      name: "Vivek Rautela",
      role: "Founder · Writer · Director · Producer",
      url: "https://theoldverse-productions.in/founders/vivek-rautela"
    },
    {
      name: "Shivanshi Rauthan",
      role: "Co-Founder · Director · Producer · Creative Lead",
      url: "https://theoldverse-productions.in/founders/shivanshi-rauthan"
    }
  ],
  keyTeam: [
    {
      name: "Shivansh Mourya",
      role: "Editor & Screenplay Writer",
      url: "https://theoldverse-productions.in/founders/shivansh-mourya"
    },
    {
      name: "Ujjawal Gurung",
      role: "Camera Team Head & Cinematographer",
      url: "https://theoldverse-productions.in/founders/ujjawal-gurung"
    }
  ],
  defaultOgImage: "https://theoldverse-productions.in/images/founders/vivek-rautela-founder-theoldverse-productions.webp"
};

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path = "",
  ogImage = SITE_CONFIG.defaultOgImage,
  type = "website",
  noIndex = false
}: MetadataOptions): Metadata {
  const url = `${SITE_CONFIG.baseUrl}${path}`;

  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    description,
    metadataBase: new URL(SITE_CONFIG.baseUrl),
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: "en_IN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: `${title} - ${SITE_CONFIG.name}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: [ogImage]
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1
        }
  };
}

// -------------------------------------------------------------
// SCHEMA.ORG JSON-LD GENERATORS
// -------------------------------------------------------------

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.baseUrl}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    url: SITE_CONFIG.baseUrl,
    logo: `${SITE_CONFIG.baseUrl}/favicon.png`,
    email: SITE_CONFIG.contact.email,
    telephone: SITE_CONFIG.contact.phone,
    sameAs: [SITE_CONFIG.socials.instagram, SITE_CONFIG.socials.youtube],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.state,
      addressCountry: SITE_CONFIG.location.country
    },
    founder: SITE_CONFIG.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
      url: f.url
    })),
    member: SITE_CONFIG.keyTeam.map((t) => ({
      "@type": "Person",
      name: t.name,
      jobTitle: t.role,
      url: t.url
    }))
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_CONFIG.baseUrl}/#localbusiness`,
    name: SITE_CONFIG.name,
    image: SITE_CONFIG.defaultOgImage,
    url: SITE_CONFIG.baseUrl,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.state,
      addressCountry: SITE_CONFIG.location.country
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "30.3165",
      longitude: "78.0322"
    },
    areaServed: [
      { "@type": "City", name: "Dehradun" },
      { "@type": "State", name: "Uttarakhand" },
      { "@type": "Country", name: "India" }
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00"
      }
    ]
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.baseUrl}${item.url}`
    }))
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function getVideoObjectSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  contentUrl?: string;
  embedUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: [video.thumbnailUrl],
    uploadDate: video.uploadDate || "2026-01-01T08:00:00+05:30",
    contentUrl: video.contentUrl || SITE_CONFIG.baseUrl,
    embedUrl: video.embedUrl || video.contentUrl || SITE_CONFIG.baseUrl
  };
}
