import HeroCarousel       from '@/components/HeroCarousel'
import FlashSale          from '@/components/FlashSale'
import ServicesStrip      from '@/components/ServicesStrip'
import PharmacyServices   from '@/components/PharmacyServices'
import MedicineFinder     from '@/components/MedicineFinder'
import ConditionsBrowser  from '@/components/ConditionsBrowser'
import Categories         from '@/components/Categories'
import Brands             from '@/components/Brands'
import ProductsGrid       from '@/components/ProductsGrid'
import RecentlyViewed     from '@/components/RecentlyViewed'
import PrescriptionBanner from '@/components/PrescriptionBanner'
import BookService        from '@/components/BookService'
import Articles           from '@/components/Articles'
import StatsSection       from '@/components/StatsSection'
import AppDownload        from '@/components/AppDownload'
import Newsletter         from '@/components/Newsletter'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FlashSale />
      <ServicesStrip />
      <PharmacyServices />
      <MedicineFinder />
      <ConditionsBrowser />
      <Categories />
      <Brands />
      <ProductsGrid />
      <StatsSection />
      <RecentlyViewed />
      <PrescriptionBanner />
      <BookService />
      <Articles />
      <AppDownload />
      <Newsletter />
    </>
  )
}
