import type { Metadata } from "next"

const APP_NAME = "Aplikasi Keuangan"
const APP_DESCRIPTION = "Kelola keuangan pribadi Anda dengan mudah, transparan, dan efisien."

interface GenerateMetadataOptions {
  title?: string
  description?: string
}

export function generateMetadata({
  title,
  description,
}: GenerateMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME
  const pageDescription = description || APP_DESCRIPTION

  return {
    title: pageTitle,
    description: pageDescription,
    applicationName: APP_NAME,
    appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "default" },
  }
}
