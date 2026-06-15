import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StarListPage } from '@/pages/StarListPage';
import { StarMapPage } from '@/pages/StarMapPage';
import { OverviewPage } from '@/pages/OverviewPage';

/**
 * 根路由组件
 */
export function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<StarListPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/map" element={<StarMapPage />} />
      </Routes>
    </AppLayout>
  );
}
