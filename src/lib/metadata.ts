import type { Metadata } from "next"

const APP_NAME = "FinanceRecord"
const APP_DESCRIPTION = "Kelola keuangan pribadi Anda dengan mudah, transparan, dan efisien."
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://finance-record.vercel.app"

interface GenerateMetadataOptions {
  title?: string
  description?: string
  path?: string
  image?: string
}

export function generateMetadata({
  title,
  description,
  path = "/",
  image = "/favicon.ico",
}: GenerateMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME
  const pageDescription = description || APP_DESCRIPTION
  const url = `${BASE_URL}${path}`

  return {
    title: pageTitle,
    description: pageDescription,
    applicationName: APP_NAME,
    appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "default" },
    openGraph: {
      type: "website",
      siteName: APP_NAME,
      title: pageTitle,
      description: pageDescription,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [image],
    },
  }
}
