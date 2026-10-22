'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ABHLogo } from '@/components/ui/ABHLogo';
import { PwaInstallModal } from '@/components/admin/PwaInstallModal';
import {
  LayoutDashboard,
  Users,
  Inbox,
  Boxes,
  Package,
  Award,
  BookOpen,
  Home,
  Info,
  Ship,
  PhoneCall,
  Search,
  Settings,
  LogOut,
  Smartphone,
  Menu,
  X,
  Bell,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Play audio chime for new messages
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  // Poll messages every 30s to update badge
  useEffect(() => {
    const fetchUnread = () => {
      fetch('/api/admin/messages?status=unread')
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            if (data.length > unreadCount && unreadCount > 0) {
              playChime();
            }
            setUnreadCount(data.length);
          }
        })
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [unreadCount]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { label: 'Vue d Ensemble', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Clients & Commandes', href: '/admin/dashboard/clients', icon: Users },
    {
      label: 'Boîte de Devis (RFQ)',
      href: '/admin/dashboard/messages',
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Catalogue Produits', href: '/admin/dashboard/products', icon: Boxes },
    { label: 'Conditionnements', href: '/admin/dashboard/packaging', icon: Package },
    { label: 'Certifications', href: '/admin/dashboard/certifications', icon: Award },
    { label: 'Publications & Rapports', href: '/admin/dashboard/publications', icon: BookOpen },
    { label: 'Éditeur Page Accueil', href: '/admin/dashboard/homepage', icon: Home },
    { label: 'Éditeur À Propos', href: '/admin/dashboard/about', icon: Info },
    { label: 'Éditeur Fret & Export', href: '/admin/dashboard/export', icon: Ship },
    { label: 'Siège & Partenaires', href: '/admin/dashboard/contacts', icon: PhoneCall },
    { label: 'SEO & Balises Méta', href: '/admin/dashboard/seo', icon: Search },
    { label: 'Sécurité & Compte', href: '/admin/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-abh-midnight text-white px-4 py-3 flex items-center justify-between border-b border-white/10 sticky top-0 z-30">
        <ABHLogo variant="dark" size="sm" />
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Link
              href="/admin/dashboard/messages"
              className="flex items-center gap-1 rounded-full bg-abh-amber px-2 py-0.5 text-[10px] font-bold text-abh-midnight"
            >
              <Bell className="h-3 w-3" />
              <span>{unreadCount}</span>
            </Link>
          )}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-abh-midnight text-gray-300 flex flex-col justify-between border-r border-white/10 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo area */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <ABHLogo variant="dark" size="sm" />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-210px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-abh-sapphire text-white shadow-xs font-semibold'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-abh-amber' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-abh-amber px-2 py-0.5 text-[10px] font-bold text-abh-midnight">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => setPwaModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-abh-amber hover:bg-white/10 transition-colors border border-white/10"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Installer l App Mobile</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors"
          >
            <span>Voir le site public</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-950/40 border border-red-900/50 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-900/60 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <PwaInstallModal isOpen={pwaModalOpen} onClose={() => setPwaModalOpen(false)} />
    </div>
  );
}
