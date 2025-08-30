"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { generateMetadata } from "@/lib/metadata"

// Define metadata for each dashboard route
const dashboardMetadataMap: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard Keuangan",
    description: "Lihat ringkasan keuangan Anda, termasuk pemasukan, pengeluaran, dan saldo terkini."
  },
  "/dashboard/add-transaction": {
    title: "Tambah Transaksi",
    description: "Tambahkan transaksi pemasukan atau pengeluaran baru ke dalam catatan keuangan Anda."
  },
  "/dashboard/transaction-lists": {
    title: "Daftar Transaksi",
    description: "Lihat dan kelola semua transaksi keuangan Anda dalam satu tempat."
  },
  "/dashboard/settings": {
    title: "Pengaturan",
    description: "Kelola pengaturan akun dan preferensi aplikasi keuangan Anda."
  }
}

interface PageMetadataProps {
  defaultTitle?: string
  defaultDescription?: string
}

export function PageMetadata({ 
  defaultTitle = "Dashboard", 
  defaultDescription = "Kelola keuangan pribadi Anda dengan mudah, transparan, dan efisien." 
}: PageMetadataProps) {
  const pathname = usePathname()
  
  useEffect(() => {
    // Get metadata for current path or fallback to defaults
    const metadata = dashboardMetadataMap[pathname] || { 
      title: defaultTitle, 
      description: defaultDescription 
    }
    
    // Update document title
    document.title = `${metadata.title} | FinanceRecord`
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", metadata.description)
    } else {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute("name", "description")
      metaDescription.setAttribute("content", metadata.description)
      document.head.appendChild(metaDescription)
    }
    
    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute("content", metadata.title)
    } else {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute("property", "og:title")
      ogTitle.setAttribute("content", metadata.title) 
      document.head.appendChild(ogTitle)
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute("content", metadata.description)
    } else {
      ogDescription = document.createElement('meta')
      ogDescription.setAttribute("property", "og:description")
      ogTitle.setAttribute("content", metadata.description) 
      document.head.appendChild(ogDescription)
    }
  }, [pathname, defaultTitle, defaultDescription])
  
  return null
}