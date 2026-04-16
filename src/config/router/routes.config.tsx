import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/common/components/layout/Layout';
import { HomePage } from '@/pages/Home/HomePage';
import { AnimePage } from '@/pages/Ver/anime/AnimePage';
import { HentaiPage } from '@/pages/Ver/hentai/HentaiPage';
import { JavPage } from '@/pages/Ver/jav/JavPage';
import { SeriesPage } from '@/pages/Ver/series/SeriesPage';
import { ActressJavPage } from '@/pages/Ver/actressJav/ActressJavPage';
import { ActressJavDetailPage } from '@/pages/Ver/actressJav/ActressJavDetailPage';
import { ActressAdultPage } from '@/pages/Ver/actressAdult/ActressAdultPage';
import { ActressAdultDetailPage } from '@/pages/Ver/actressAdult/ActressAdultDetailPage';
import { YouTubePage } from '@/pages/Ver/youtube/YouTubePage';
import { AnimeGaleryPage } from '@/pages/Galeria/anime/AnimeGaleryPage';
import { AnimeGaleryDetailPage } from '@/pages/Galeria/anime/AnimeGaleryDetailPage';
import { GirlGaleryPage } from '@/pages/Galeria/girl/GirlGaleryPage';
import { GirlGaleryDetailPage } from '@/pages/Galeria/girl/GirlGaleryDetailPage';
import { AccountPage } from '@/pages/Steam/account/AccountPage';
import { SearchPage } from '@/pages/Steam/search/SearchPage';
import { DropsPage } from '@/pages/Steam/drops/DropsPage';
import { PurchasePage } from '@/pages/Steam/purchase/PurchasePage';
import { HeroPage } from '@/pages/Steam/dota/hero/HeroPage';
import { TreasurePage } from '@/pages/Steam/dota/treasure/TreasurePage';
import { CachePage } from '@/pages/Steam/dota/cache/CachePage';
import { SellerPage } from '@/pages/Steam/dota/seller/SellerPage';
import { PersonPage } from '@/pages/Dinero/person/PersonPage';
import { PaymentPage } from '@/pages/Dinero/payment/PaymentPage';
import { SalaryPage } from '@/pages/Dinero/salary/SalaryPage';
import { ProjectPage } from '@/pages/Utilitarios/project/ProjectPage';
import { PostPage } from '@/pages/Utilitarios/post/PostPage';
import { TaskPage } from '@/pages/Utilitarios/task/TaskPage';
import { EventPage } from '@/pages/Utilitarios/event/EventPage';
import { OGamePage } from '@/pages/Utilitarios/ogame/OGamePage';
import { TagPage } from '@/pages/Utilitarios/tag/TagPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Ver
      {
        path: 'ver/anime',
        element: <AnimePage />,
      },
      {
        path: 'ver/hentai',
        element: <HentaiPage />,
      },
      {
        path: 'ver/jav',
        element: <JavPage />,
      },
      {
        path: 'ver/series',
        element: <SeriesPage />,
      },
      {
        path: 'ver/actress-jav',
        element: <ActressJavPage />,
      },
      {
        path: 'ver/actress-jav/:id',
        element: <ActressJavDetailPage />,
      },
      {
        path: 'ver/actress-adult',
        element: <ActressAdultPage />,
      },
      {
        path: 'ver/actress-adult/:id',
        element: <ActressAdultDetailPage />,
      },
      {
        path: 'ver/youtube',
        element: <YouTubePage />,
      },
      // Galería
      {
        path: 'galeria/anime',
        element: <AnimeGaleryPage />,
      },
      {
        path: 'galeria/anime/:id',
        element: <AnimeGaleryDetailPage />,
      },
      {
        path: 'galeria/girl',
        element: <GirlGaleryPage />,
      },
      {
        path: 'galeria/girl/:id',
        element: <GirlGaleryDetailPage />,
      },
      // Steam
      {
        path: 'steam/account',
        element: <AccountPage />,
      },
      {
        path: 'steam/search',
        element: <SearchPage />,
      },
      {
        path: 'steam/drops',
        element: <DropsPage />,
      },
      {
        path: 'steam/purchase',
        element: <PurchasePage />,
      },
      // Dota
      {
        path: 'steam/dota/hero',
        element: <HeroPage />,
      },
      {
        path: 'steam/dota/treasure',
        element: <TreasurePage />,
      },
      {
        path: 'steam/dota/cache',
        element: <CachePage />,
      },
      {
        path: 'steam/dota/seller',
        element: <SellerPage />,
      },
      // Dinero
      {
        path: 'dinero/person',
        element: <PersonPage />,
      },
      {
        path: 'dinero/payment',
        element: <PaymentPage />,
      },
      {
        path: 'dinero/salary',
        element: <SalaryPage />,
      },
      // Utilitarios
      {
        path: 'utilitarios/project',
        element: <ProjectPage />,
      },
      {
        path: 'utilitarios/post',
        element: <PostPage />,
      },
      {
        path: 'utilitarios/task',
        element: <TaskPage />,
      },
      {
        path: 'utilitarios/event',
        element: <EventPage />,
      },
      {
        path: 'utilitarios/ogame',
        element: <OGamePage />,
      },
      {
        path: 'utilitarios/tag',
        element: <TagPage />,
      },
    ],
  },
]);
