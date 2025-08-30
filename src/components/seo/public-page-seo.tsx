import { generateMetadata } from "@/lib/metadata"

interface PublicPageSEOProps {
  title: string
  description: string
  path: string
}

export function PublicPageSEO({ title, description, path }: PublicPageSEOProps) {
  // This component doesn't render anything, it just defines metadata
  // The actual metadata is generated at build time
  return null
}

// Helper function to generate metadata for public pages
export function generatePublicPageMetadata({ title, description, path }: PublicPageSEOProps) {
  return generateMetadata({
    title,
    description,
    path,
  })
}