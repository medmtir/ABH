'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  BellRing,
  ExternalLink,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ToastNotif {
  title: string;
  body: string;
  url: string;
  time: string;
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [toastNotification, setToastNotification] = useState<ToastNotif | null>(null);

  const prevUnreadIdsRef = useRef<Set<string>>(new Set());
  const initialFetchDoneRef = useRef(false);

  // Play rich acoustic double-chime for new messages (Web Audio API)
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // First tone: D5 (587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain1.gain.setValueAtTime(0.18, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.35);

      // Second tone: A5 (880 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.0, ctx.currentTime + 0.14);
      gain2.gain.setValueAtTime(0.22, ctx.currentTime + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.14);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  // Vibrate mobile phone (Android & iOS PWA where supported)
  const triggerVibrate = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([250, 100, 250]);
      } catch {}
    }
  };

  // Dispatch both system notification + sound + vibration + on-screen toast
  const triggerNotification = async (
    title: string,
    body: string,
    url: string = '/admin/dashboard/messages'
  ) => {
    // 1. Play sound chime
    playChime();

    // 2. Vibrate phone
    triggerVibrate();

    // 3. Set on-screen floating toast
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setToastNotification({
      title,
      body,
      url,
      time: nowTime,
    });

    // 4. Send native OS notification (PC Desktop banner / Phone Lock screen)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        // Try ServiceWorkerRegistration first (required on mobile iOS 16.4+ & Android Chrome)
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          if (reg && 'showNotification' in reg) {
            await (reg as any).showNotification(title, {
              body,
              icon: '/images/logo.png',
              badge: '/images/logo.png',
              tag: 'abh-quote-' + Date.now(),
              renotify: true,
              data: { url },
            });
            return;
          }
        }

        // Fallback for standard Desktop PC browsers
        const n = new Notification(title, {
          body,
          icon: '/images/logo.png',
          tag: 'abh-quote-' + Date.now(),
          data: { url },
        } as any);
        n.onclick = () => {
          window.focus();
          router.push(url);
        };
      } catch (e) {
        console.warn('Native notification dispatch error:', e);
      }
    }
  };

  // Enable notifications upon user gesture (required by PC & iOS Safari)
  const handleEnableNotifications = async () => {
    if (typeof window === 'undefined') return;

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (e) {
        console.warn('SW register:', e);
      }
    }

    if (!('Notification' in window)) {
      alert("Ce navigateur ne supporte pas les notifications système. Les alertes sonores et visuelles restent actives sur l'écran.");
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm === 'granted') {
        triggerNotification(
          '🔔 Notifications Activées (PC & Mobile)',
          'Vous recevrez désormais des alertes sonores et visuelles instantanées à chaque nouvelle demande de devis.'
        );
      } else if (perm === 'denied') {
        alert("Les notifications sont bloquées dans les paramètres de votre navigateur. Veuillez les autoriser pour recevoir les alertes sur PC ou téléphone.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Test notification button
  const handleTestNotification = () => {
    triggerNotification(
      '🔔 Test Notification — ABH Admin',
      'Le système de notification fonctionne parfaitement sur cet appareil (Son + Vibreur + Notification).'
    );
  };

  // Register SW and check permission on mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Poll for unread messages every 12 seconds
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/admin/messages?status=unread');
        const data = await res.json();
        if (Array.isArray(data)) {
          const currentIds = new Set<string>(data.map((m: any) => m.id));

          if (initialFetchDoneRef.current) {
            // Find newly arrived messages
            const newMessages = data.filter((m: any) => !prevUnreadIdsRef.current.has(m.id));
            if (newMessages.length > 0) {
              const firstNew = newMessages[0];
              triggerNotification(
                '🔔 Nouveau Devis Reçu ! — ABH Admin',
                `${firstNew.company_name || 'Client'} (${firstNew.country || 'Export'}) : ${firstNew.product_interest || "Huile d'olive"}`
              );
            }
          } else {
            initialFetchDoneRef.current = true;
          }

          prevUnreadIdsRef.current = currentIds;
          setUnreadCount(data.length);
        }
      } catch (e) {}
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 12000);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss toast notification after 9 seconds
  useEffect(() => {
    if (!toastNotification) return;
    const timer = setTimeout(() => {
      setToastNotification(null);
    }, 9000);
    return () => clearTimeout(timer);
  }, [toastNotification]);

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
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row overflow-x-hidden">
      {/* ======================================================== */}
      {/* MOBILE TOP HEADER BAR (With iPhone Notch Safe Area)      */}
      {/* ======================================================== */}
      <div className="lg:hidden bg-abh-midnight text-white px-4 pt-[max(env(safe-area-inset-top,0px),0.75rem)] pb-3 flex items-center justify-between border-b border-white/10 sticky top-0 z-30 shadow-md">
        <ABHLogo variant="dark" size="sm" />

        <div className="flex items-center gap-2">
          {/* Notifications button */}
          <button
            onClick={() => setNotifModalOpen(true)}
            className={`relative p-2 rounded-xl border transition-colors ${
              notifPermission === 'granted'
                ? 'bg-white/10 text-abh-amber border-abh-amber/30 hover:bg-white/15'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
            title="Gérer les notifications"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-abh-amber px-1 text-[9px] font-bold text-abh-midnight ring-2 ring-abh-midnight">
                {unreadCount}
              </span>
            )}
            {notifPermission === 'granted' && unreadCount === 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-abh-midnight" />
            )}
          </button>

          {/* Menu Hamburger */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-colors border border-white/10"
            aria-label="Menu administration"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ======================================================== */}
      {/* SIDEBAR DESKTOP & MOBILE (With Safe Area Notch Support)  */}
      {/* ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-abh-midnight text-gray-300 flex flex-col justify-between border-r border-white/10 transition-transform duration-300 lg:static lg:w-64 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo area with iPhone Notch padding */}
          <div className="p-4 sm:p-5 pt-[max(env(safe-area-inset-top,0px),1rem)] border-b border-white/10 flex items-center justify-between">
            <ABHLogo variant="dark" size="sm" />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto touch-scroll">
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
          {/* Notification Button */}
          <button
            type="button"
            onClick={() => setNotifModalOpen(true)}
            className="w-full flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-abh-amber" />
              <span>Notifications</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                notifPermission === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {notifPermission === 'granted' ? 'Actives' : 'Activer'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileSidebarOpen(false);
              setPwaModalOpen(true);
            }}
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

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                        */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
        {/* Desktop Top Notification Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3 bg-white border-b border-abh-border">
          <div className="flex items-center gap-2 text-xs text-abh-slate">
            <span className="font-semibold text-abh-midnight">Portail Direction Commerciale ABH</span>
            <span>•</span>
            <span>Bouhajla, Kairouan</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Notification State Pill */}
            {notifPermission === 'granted' ? (
              <button
                onClick={handleTestNotification}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                title="Tester l alerte sonore et notification"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Alertes Actives (Tester)</span>
              </button>
            ) : (
              <button
                onClick={handleEnableNotifications}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors animate-pulse"
              >
                <BellRing className="h-3.5 w-3.5 text-abh-amber" />
                <span>Activer les Notifications (PC & Tél)</span>
              </button>
            )}

            <Link
              href="/admin/dashboard/messages"
              className="relative inline-flex items-center gap-1 rounded-xl bg-abh-sand/40 px-3 py-1.5 text-xs font-semibold text-abh-sapphire hover:bg-abh-sand/70 transition-colors"
            >
              <Inbox className="h-3.5 w-3.5 text-abh-amber" />
              <span>Devis</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-abh-amber px-1.5 py-0.2 text-[10px] font-bold text-abh-midnight">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ======================================================== */}
      {/* FLOATING IN-APP TOAST NOTIFICATION (PC & Mobile)         */}
      {/* ======================================================== */}
      {toastNotification && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] rounded-2xl bg-abh-midnight/95 text-white p-4 shadow-2xl border border-abh-amber/60 backdrop-blur-md animate-fade-in-up">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-abh-amber/20 text-abh-amber border border-abh-amber/30">
                <BellRing className="h-5 w-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-white">{toastNotification.title}</h4>
                  <span className="text-[10px] text-gray-400">{toastNotification.time}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{toastNotification.body}</p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={toastNotification.url}
                    onClick={() => setToastNotification(null)}
                    className="inline-flex items-center gap-1 rounded-lg bg-abh-amber px-3 py-1.5 text-xs font-bold text-abh-midnight hover:bg-abh-amber/90 transition-colors"
                  >
                    <span>Consulter le devis</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => setToastNotification(null)}
                    className="rounded-lg px-2.5 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* NOTIFICATION MANAGEMENT MODAL                            */}
      {/* ======================================================== */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-abh-border space-y-4">
            <button
              onClick={() => setNotifModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-abh-sapphire p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-abh-sand/40 text-abh-sapphire mb-3 ring-8 ring-abh-sand/20">
                <BellRing className="h-7 w-7 text-abh-amber" />
              </div>
              <h3 className="text-lg font-heading font-bold text-abh-sapphire">
                Gestionnaire des Alertes & Notifications
              </h3>
              <p className="text-xs text-abh-slate mt-1">
                Recevez les notifications d arrivées de nouveaux devis directement sur votre <b>PC</b> et votre <b>Téléphone (iPhone & Android)</b>.
              </p>
            </div>

            {/* Status card */}
            <div className="rounded-xl border border-abh-border p-3.5 bg-abh-pearl/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-abh-midnight">État des Notifications Système :</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    notifPermission === 'granted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : notifPermission === 'denied'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {notifPermission === 'granted' ? 'Activées ✓' : notifPermission === 'denied' ? 'Bloquées ✕' : 'En attente'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {notifPermission === 'granted'
                  ? 'Les alertes sonores, visuelles et système sont parfaitement configurées.'
                  : 'Cliquez ci-dessous pour autoriser les notifications dans votre navigateur.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              {notifPermission !== 'granted' ? (
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-abh-amber to-abh-copper py-3 px-4 text-xs font-bold text-white shadow-md hover:scale-[1.01] transition-all"
                >
                  <BellRing className="h-4 w-4" />
                  <span>Activer les Notifications sur cet appareil</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleTestNotification}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-abh-sapphire py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors"
              >
                <Volume2 className="h-4 w-4 text-abh-amber" />
                <span>Tester l Alerte Immédiatement (Son + Vibreur + Notification)</span>
              </button>

              <button
                type="button"
                onClick={() => setNotifModalOpen(false)}
                className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <PwaInstallModal isOpen={pwaModalOpen} onClose={() => setPwaModalOpen(false)} />
    </div>
  );
}
