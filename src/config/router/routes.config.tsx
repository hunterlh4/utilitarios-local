import { createBrowserRouter, Navigate } from 'react-router-dom';
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
import { EmailPage } from '@/pages/Steam/account/EmailPage';
import { SteamAccountPage } from '@/pages/Steam/account/SteamAccountPage';
import { GitHubPage } from '@/pages/Steam/account/GitHubPage';
import { GeneralPage } from '@/pages/Steam/account/GeneralPage';
import { KiroPage } from '@/pages/Steam/account/KiroPage';
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
import { TagTypePage } from '@/pages/Utilitarios/tag/TagTypePage';
import { TAG_TABS } from '@/pages/Utilitarios/tag/models/tag.model';
import { ComicPage } from '@/pages/Ver/comic/ComicPage';

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
      {
        path: 'ver/comic',
        element: <ComicPage />,
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
        children: [
          { index: true, element: <Navigate to="email" replace /> },
          { path: 'email',   element: <EmailPage /> },
          { path: 'steam',   element: <SteamAccountPage /> },
          { path: 'github',  element: <GitHubPage /> },
          { path: 'general', element: <GeneralPage /> },
          { path: 'kiro',    element: <KiroPage /> },
        ],
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
        path: 'utilitarios/project/:id',
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
        children: [
          { index: true, element: <Navigate to={TAG_TABS[0].path} replace /> },
          { path: 'actress-jav', element: <TagTypePage type={TAG_TABS[0].type} /> },
          { path: 'project', element: <TagTypePage type={TAG_TABS[1].type} /> },
          { path: 'post', element: <TagTypePage type={TAG_TABS[2].type} /> },
          { path: 'other', element: <TagTypePage type={TAG_TABS[3].type} /> },
          { path: 'actress-adult', element: <TagTypePage type={TAG_TABS[4].type} /> },
          { path: 'hentai', element: <TagTypePage type={TAG_TABS[5].type} /> },
          { path: 'jav', element: <TagTypePage type={TAG_TABS[6].type} /> },
          { path: 'video-adult', element: <TagTypePage type={TAG_TABS[7].type} /> },
        ],
      },
    ],
  },
]);
