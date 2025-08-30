import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface UsePageMetadataOptions {
  title?: string
  description?: string
}

export function usePageMetadata({ title, description }: UsePageMetadataOptions = {}) {
  const pathname = usePathname()
  
  useEffect(() => {
    // Default metadata for dashboard routes
    const defaultMetadata: Record<string, { title: string; description: string }> = {
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
    
    // Get metadata for current path
    const routeMetadata = defaultMetadata[pathname]
    
    // Use provided metadata or fall back to route defaults or generic defaults
    const pageTitle = title || routeMetadata?.title || "Dashboard"
    const pageDescription = description || routeMetadata?.description || "Kelola keuangan pribadi Anda dengan mudah, transparan, dan efisien."
    
    // Update document title
    document.title = `${pageTitle} | FinanceRecord`
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", pageDescription)
    } else {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute("name", "description")
      metaDescription.setAttribute("content", pageDescription)
      document.head.appendChild(metaDescription)
    }
    
    // Update Open Graph tags
    updateMetaTag('og:title', pageTitle)
    updateMetaTag('og:description', pageDescription)
    updateMetaTag('og:site_name', 'FinanceRecord')
    updateMetaTag('og:type', 'website')
    
    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary')
    updateMetaTag('twitter:title', pageTitle)
    updateMetaTag('twitter:description', pageDescription)
    
  }, [pathname, title, description])
}

function updateMetaTag(property: string, content: string) {
  let metaTag = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`)
  
  if (metaTag) {
    metaTag.setAttribute("content", content)
  } else {
    metaTag = document.createElement('meta')
    // Check if it's a property or name
    if (property.startsWith('og:')) {
      metaTag.setAttribute("property", property)
    } else {
      metaTag.setAttribute("name", property)
    }
    metaTag.setAttribute("content", content)
    document.head.appendChild(metaTag)
  }
}