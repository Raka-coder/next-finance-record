import LandingPage from "@/components/landing/landing-page";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Beranda",
  description: "Aplikasi pengelolaan keuangan pribadi yang membantu Anda melacak pemasukan, pengeluaran, dan mencapai tujuan finansial.",
});

export default function Home() {
  return (
   <LandingPage />
  );
}
