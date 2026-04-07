import type { Metadata } from 'next';
import { ReportingDashboard } from '@/components/ReportingDashboard';

export const metadata: Metadata = {
  title: 'Reporting CRO',
  description: 'Dashboard local de performance des clics affiliation et du maillage interne.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReportingPage() {
  return <ReportingDashboard />;
}
