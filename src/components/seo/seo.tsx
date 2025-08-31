import React from "react"
import Head from "next/head"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

export function SEO({
  title = "FinanceRecord",
  description = "Kelola keuangan pribadi Anda dengan mudah, transparan, dan efisien.",
  keywords = "keuangan, pengelolaan keuangan, catatan keuangan, pemasukan, pengeluaran",
  image = "/wallet.svg",
  url = "https://financerecord.vercel.app/",
  type = "website"
}: SEOProps) {
  const fullTitle = title.includes("FinanceRecord") ? title : `${title} | FinanceRecord`
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={title}/>
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={title} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/wallet.svg" />
    </Head>
  )
}