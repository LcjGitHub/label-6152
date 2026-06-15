import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StarListPage } from '@/pages/StarListPage';
import { StarMapPage } from '@/pages/StarMapPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { FavoritePage } from '@/pages/FavoritePage';
import { LunarMansionPage } from '@/pages/LunarMansionPage';
import { FourSymbolsPage } from '@/pages/FourSymbolsPage';
import { StatisticsPage } from '@/pages/StatisticsPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { ComparePage } from '@/pages/ComparePage';
import { DictionaryPage } from '@/pages/DictionaryPage';

/**
 * 根路由组件
 */
export function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<StarListPage />} />
        <Route path="/概览" element={<OverviewPage />} />
        <Route path="/四象" element={<FourSymbolsPage />} />
        <Route path="/二十八宿" element={<LunarMansionPage />} />
        <Route path="/map" element={<StarMapPage />} />
        <Route path="/统计" element={<StatisticsPage />} />
        <Route path="/收藏" element={<FavoritePage />} />
        <Route path="/历史" element={<HistoryPage />} />
        <Route path="/对照" element={<ComparePage />} />
        <Route path="/词典" element={<DictionaryPage />} />
      </Routes>
    </AppLayout>
  );
}
