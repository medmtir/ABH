'use client';

// ============================================================
// ABH Company — Admin Panel i18n Context Provider
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Locale } from '@/lib/types';

type AdminLocale = Extract<Locale, 'fr' | 'en' | 'ar'>;

const adminLabels: Record<AdminLocale, Record<string, string>> = {
  fr: {
    dashboard: 'Tableau de bord',
    products: 'Produits',
    certifications: 'Certifications',
    packagings: 'Emballages',
    messages: 'Messages',
    clients: 'Clients',
    orders: 'Commandes',
    publications: 'Publications',
    media: 'Médias',
    settings: 'Paramètres',
    content: 'Contenu',
    logout: 'Déconnexion',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    confirm_delete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    no_data: 'Aucune donnée disponible',
    loading: 'Chargement...',
    saved_success: 'Sauvegardé avec succès',
    error_occurred: 'Une erreur est survenue',
    total: 'Total',
    status: 'Statut',
    date: 'Date',
    actions: 'Actions',
    active: 'Actif',
    inactive: 'Inactif',
    yes: 'Oui',
    no: 'Non',
    welcome: 'Bienvenue',
    recent_messages: 'Messages récents',
    recent_orders: 'Commandes récentes',
    revenue: 'Chiffre d\'affaires',
    pending: 'En attente',
  },
  en: {
    dashboard: 'Dashboard',
    products: 'Products',
    certifications: 'Certifications',
    packagings: 'Packagings',
    messages: 'Messages',
    clients: 'Clients',
    orders: 'Orders',
    publications: 'Publications',
    media: 'Media',
    settings: 'Settings',
    content: 'Content',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    confirm_delete: 'Are you sure you want to delete this item?',
    no_data: 'No data available',
    loading: 'Loading...',
    saved_success: 'Saved successfully',
    error_occurred: 'An error occurred',
    total: 'Total',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    yes: 'Yes',
    no: 'No',
    welcome: 'Welcome',
    recent_messages: 'Recent messages',
    recent_orders: 'Recent orders',
    revenue: 'Revenue',
    pending: 'Pending',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    certifications: 'الشهادات',
    packagings: 'التعبئة والتغليف',
    messages: 'الرسائل',
    clients: 'العملاء',
    orders: 'الطلبات',
    publications: 'المنشورات',
    media: 'الوسائط',
    settings: 'الإعدادات',
    content: 'المحتوى',
    logout: 'تسجيل الخروج',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    import: 'استيراد',
    confirm_delete: 'هل أنت متأكد من حذف هذا العنصر؟',
    no_data: 'لا توجد بيانات',
    loading: 'جار التحميل...',
    saved_success: 'تم الحفظ بنجاح',
    error_occurred: 'حدث خطأ',
    total: 'المجموع',
    status: 'الحالة',
    date: 'التاريخ',
    actions: 'الإجراءات',
    active: 'نشط',
    inactive: 'غير نشط',
    yes: 'نعم',
    no: 'لا',
    welcome: 'مرحبًا',
    recent_messages: 'الرسائل الأخيرة',
    recent_orders: 'الطلبات الأخيرة',
    revenue: 'الإيرادات',
    pending: 'قيد الانتظار',
  },
};

interface AdminLanguageContextValue {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null);

interface AdminLanguageProviderProps {
  children: ReactNode;
  initialLocale?: AdminLocale;
}

export function AdminLanguageProvider({
  children,
  initialLocale = 'fr',
}: AdminLanguageProviderProps) {
  const [locale, setLocaleState] = useState<AdminLocale>(initialLocale);

  const dir = useMemo(() => (locale === 'ar' ? 'rtl' : 'ltr'), [locale]);

  const setLocale = useCallback((newLocale: AdminLocale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('abh-admin-locale', newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return adminLabels[locale]?.[key] ?? adminLabels.fr[key] ?? key;
    },
    [locale]
  );

  const contextValue = useMemo<AdminLanguageContextValue>(
    () => ({ locale, setLocale, t, dir }),
    [locale, setLocale, t, dir]
  );

  return (
    <AdminLanguageContext.Provider value={contextValue}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

/**
 * Hook to access admin panel locale switching.
 * Must be used inside an AdminLanguageProvider.
 */
export function useAdminLanguage(): AdminLanguageContextValue {
  const ctx = useContext(AdminLanguageContext);
  if (!ctx) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider');
  }
  return ctx;
}
