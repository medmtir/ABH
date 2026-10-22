// ============================================================
// ABH Company — Static Translation Dictionaries
// ============================================================

import type { Locale } from '@/lib/types';

export interface Dictionary {
  nav: {
    home: string;
    products: string;
    about: string;
    certifications: string;
    export: string;
    contact: string;
  };
  common: {
    read_more: string;
    send: string;
    loading: string;
    close: string;
    back: string;
    search: string;
    filter: string;
    all: string;
    download: string;
    share: string;
    yes: string;
    no: string;
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    next: string;
    previous: string;
    submit: string;
    required: string;
    optional: string;
    or: string;
    and: string;
  };
  product: {
    our_products: string;
    acidity: string;
    variety: string;
    extraction: string;
    origin: string;
    packaging: string;
    moq: string;
    specifications: string;
    certifications: string;
    gallery: string;
    request_quote: string;
    details: string;
  };
  contact: {
    title: string;
    subtitle: string;
    full_name: string;
    full_name_placeholder: string;
    company_name: string;
    company_name_placeholder: string;
    country: string;
    country_placeholder: string;
    email: string;
    email_placeholder: string;
    phone: string;
    phone_placeholder: string;
    product_interest: string;
    product_interest_placeholder: string;
    quantity: string;
    quantity_placeholder: string;
    destination_country: string;
    destination_country_placeholder: string;
    message: string;
    message_placeholder: string;
    privacy_consent: string;
    attach_file: string;
    send_request: string;
    success_title: string;
    success_message: string;
    error_title: string;
    error_message: string;
  };
  footer: {
    company_description: string;
    quick_links: string;
    contact_us: string;
    newsletter: string;
    newsletter_placeholder: string;
    subscribe: string;
    rights_reserved: string;
    privacy_policy: string;
    terms: string;
    developed_by: string;
  };
  errors: {
    not_found: string;
    not_found_message: string;
    server_error: string;
    server_error_message: string;
    network_error: string;
    go_home: string;
    try_again: string;
    field_required: string;
    invalid_email: string;
    invalid_phone: string;
  };
}

const fr: Dictionary = {
  nav: {
    home: 'Accueil',
    products: 'Produits',
    about: 'À propos',
    certifications: 'Certifications',
    export: 'Export',
    contact: 'Contact',
  },
  common: {
    read_more: 'En savoir plus',
    send: 'Envoyer',
    loading: 'Chargement...',
    close: 'Fermer',
    back: 'Retour',
    search: 'Rechercher',
    filter: 'Filtrer',
    all: 'Tout',
    download: 'Télécharger',
    share: 'Partager',
    yes: 'Oui',
    no: 'Non',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Soumettre',
    required: 'Obligatoire',
    optional: 'Facultatif',
    or: 'ou',
    and: 'et',
  },
  product: {
    our_products: 'Nos Produits',
    acidity: 'Acidité',
    variety: 'Variété',
    extraction: 'Extraction',
    origin: 'Origine',
    packaging: 'Conditionnement',
    moq: 'Quantité minimale',
    specifications: 'Fiche technique',
    certifications: 'Certifications',
    gallery: 'Galerie',
    request_quote: 'Demander un devis',
    details: 'Détails du produit',
  },
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Envoyez-nous votre demande de devis ou toute question commerciale.',
    full_name: 'Nom complet',
    full_name_placeholder: 'Votre nom et prénom',
    company_name: 'Nom de l\'entreprise',
    company_name_placeholder: 'Nom de votre société',
    country: 'Pays',
    country_placeholder: 'Votre pays',
    email: 'Email',
    email_placeholder: 'votre@email.com',
    phone: 'Téléphone',
    phone_placeholder: '+216 XX XXX XXX',
    product_interest: 'Produit souhaité',
    product_interest_placeholder: 'Sélectionnez un produit',
    quantity: 'Quantité estimée',
    quantity_placeholder: 'ex: 20 tonnes',
    destination_country: 'Pays de destination',
    destination_country_placeholder: 'Pays d\'importation',
    message: 'Message',
    message_placeholder: 'Décrivez vos besoins, spécifications souhaitées...',
    privacy_consent: 'J\'accepte la politique de confidentialité et le traitement de mes données.',
    attach_file: 'Joindre un fichier',
    send_request: 'Envoyer la demande',
    success_title: 'Demande envoyée !',
    success_message: 'Merci pour votre demande. Notre équipe commerciale vous contactera sous 24-48h.',
    error_title: 'Erreur d\'envoi',
    error_message: 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.',
  },
  footer: {
    company_description: 'Leader tunisien dans l\'exportation d\'huiles d\'olive biologiques et conventionnelles de qualité supérieure.',
    quick_links: 'Liens rapides',
    contact_us: 'Contactez-nous',
    newsletter: 'Newsletter',
    newsletter_placeholder: 'Votre adresse email',
    subscribe: 'S\'abonner',
    rights_reserved: 'Tous droits réservés',
    privacy_policy: 'Politique de confidentialité',
    terms: 'Conditions générales',
    developed_by: 'Développé par',
  },
  errors: {
    not_found: 'Page introuvable',
    not_found_message: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
    server_error: 'Erreur serveur',
    server_error_message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
    network_error: 'Erreur de connexion',
    go_home: 'Retour à l\'accueil',
    try_again: 'Réessayer',
    field_required: 'Ce champ est obligatoire',
    invalid_email: 'Adresse email invalide',
    invalid_phone: 'Numéro de téléphone invalide',
  },
};

const en: Dictionary = {
  nav: {
    home: 'Home',
    products: 'Products',
    about: 'About',
    certifications: 'Certifications',
    export: 'Export',
    contact: 'Contact',
  },
  common: {
    read_more: 'Read more',
    send: 'Send',
    loading: 'Loading...',
    close: 'Close',
    back: 'Back',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    download: 'Download',
    share: 'Share',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    required: 'Required',
    optional: 'Optional',
    or: 'or',
    and: 'and',
  },
  product: {
    our_products: 'Our Products',
    acidity: 'Acidity',
    variety: 'Variety',
    extraction: 'Extraction',
    origin: 'Origin',
    packaging: 'Packaging',
    moq: 'Minimum order quantity',
    specifications: 'Technical specifications',
    certifications: 'Certifications',
    gallery: 'Gallery',
    request_quote: 'Request a quote',
    details: 'Product details',
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Send us your quote request or any commercial inquiry.',
    full_name: 'Full name',
    full_name_placeholder: 'Your full name',
    company_name: 'Company name',
    company_name_placeholder: 'Your company name',
    country: 'Country',
    country_placeholder: 'Your country',
    email: 'Email',
    email_placeholder: 'your@email.com',
    phone: 'Phone',
    phone_placeholder: '+1 XXX XXX XXXX',
    product_interest: 'Product of interest',
    product_interest_placeholder: 'Select a product',
    quantity: 'Estimated quantity',
    quantity_placeholder: 'e.g. 20 tonnes',
    destination_country: 'Destination country',
    destination_country_placeholder: 'Import country',
    message: 'Message',
    message_placeholder: 'Describe your needs, desired specifications...',
    privacy_consent: 'I accept the privacy policy and the processing of my data.',
    attach_file: 'Attach a file',
    send_request: 'Send request',
    success_title: 'Request sent!',
    success_message: 'Thank you for your request. Our sales team will contact you within 24-48h.',
    error_title: 'Send error',
    error_message: 'An error occurred. Please try again or contact us directly.',
  },
  footer: {
    company_description: 'Leading Tunisian exporter of premium organic and conventional olive oils.',
    quick_links: 'Quick links',
    contact_us: 'Contact us',
    newsletter: 'Newsletter',
    newsletter_placeholder: 'Your email address',
    subscribe: 'Subscribe',
    rights_reserved: 'All rights reserved',
    privacy_policy: 'Privacy policy',
    terms: 'Terms & conditions',
    developed_by: 'Developed by',
  },
  errors: {
    not_found: 'Page not found',
    not_found_message: 'The page you are looking for does not exist or has been moved.',
    server_error: 'Server error',
    server_error_message: 'An internal error occurred. Please try again later.',
    network_error: 'Connection error',
    go_home: 'Back to home',
    try_again: 'Try again',
    field_required: 'This field is required',
    invalid_email: 'Invalid email address',
    invalid_phone: 'Invalid phone number',
  },
};

const ar: Dictionary = {
  nav: {
    home: 'الرئيسية',
    products: 'المنتجات',
    about: 'من نحن',
    certifications: 'الشهادات',
    export: 'التصدير',
    contact: 'اتصل بنا',
  },
  common: {
    read_more: 'اقرأ المزيد',
    send: 'إرسال',
    loading: 'جار التحميل...',
    close: 'إغلاق',
    back: 'رجوع',
    search: 'بحث',
    filter: 'تصفية',
    all: 'الكل',
    download: 'تحميل',
    share: 'مشاركة',
    yes: 'نعم',
    no: 'لا',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    required: 'مطلوب',
    optional: 'اختياري',
    or: 'أو',
    and: 'و',
  },
  product: {
    our_products: 'منتجاتنا',
    acidity: 'الحموضة',
    variety: 'الصنف',
    extraction: 'الاستخراج',
    origin: 'المنشأ',
    packaging: 'التعبئة',
    moq: 'الحد الأدنى للطلب',
    specifications: 'المواصفات التقنية',
    certifications: 'الشهادات',
    gallery: 'المعرض',
    request_quote: 'طلب عرض سعر',
    details: 'تفاصيل المنتج',
  },
  contact: {
    title: 'اتصل بنا',
    subtitle: 'أرسل لنا طلب عرض أسعار أو أي استفسار تجاري.',
    full_name: 'الاسم الكامل',
    full_name_placeholder: 'اسمك الكامل',
    company_name: 'اسم الشركة',
    company_name_placeholder: 'اسم شركتك',
    country: 'البلد',
    country_placeholder: 'بلدك',
    email: 'البريد الإلكتروني',
    email_placeholder: 'your@email.com',
    phone: 'الهاتف',
    phone_placeholder: '+216 XX XXX XXX',
    product_interest: 'المنتج المطلوب',
    product_interest_placeholder: 'اختر منتجًا',
    quantity: 'الكمية المقدرة',
    quantity_placeholder: 'مثال: 20 طن',
    destination_country: 'بلد الوجهة',
    destination_country_placeholder: 'بلد الاستيراد',
    message: 'الرسالة',
    message_placeholder: 'صف احتياجاتك والمواصفات المطلوبة...',
    privacy_consent: 'أوافق على سياسة الخصوصية ومعالجة بياناتي.',
    attach_file: 'إرفاق ملف',
    send_request: 'إرسال الطلب',
    success_title: 'تم إرسال الطلب!',
    success_message: 'شكرًا لطلبك. سيتصل بك فريقنا التجاري خلال 24-48 ساعة.',
    error_title: 'خطأ في الإرسال',
    error_message: 'حدث خطأ. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
  },
  footer: {
    company_description: 'الشركة التونسية الرائدة في تصدير زيوت الزيتون العضوية والتقليدية الممتازة.',
    quick_links: 'روابط سريعة',
    contact_us: 'اتصل بنا',
    newsletter: 'النشرة الإخبارية',
    newsletter_placeholder: 'بريدك الإلكتروني',
    subscribe: 'اشترك',
    rights_reserved: 'جميع الحقوق محفوظة',
    privacy_policy: 'سياسة الخصوصية',
    terms: 'الشروط والأحكام',
    developed_by: 'تطوير بواسطة',
  },
  errors: {
    not_found: 'الصفحة غير موجودة',
    not_found_message: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    server_error: 'خطأ في الخادم',
    server_error_message: 'حدث خطأ داخلي. يرجى المحاولة لاحقًا.',
    network_error: 'خطأ في الاتصال',
    go_home: 'العودة للرئيسية',
    try_again: 'حاول مرة أخرى',
    field_required: 'هذا الحقل مطلوب',
    invalid_email: 'بريد إلكتروني غير صالح',
    invalid_phone: 'رقم هاتف غير صالح',
  },
};

const es: Dictionary = {
  nav: {
    home: 'Inicio',
    products: 'Productos',
    about: 'Sobre nosotros',
    certifications: 'Certificaciones',
    export: 'Exportación',
    contact: 'Contacto',
  },
  common: {
    read_more: 'Leer más',
    send: 'Enviar',
    loading: 'Cargando...',
    close: 'Cerrar',
    back: 'Volver',
    search: 'Buscar',
    filter: 'Filtrar',
    all: 'Todo',
    download: 'Descargar',
    share: 'Compartir',
    yes: 'Sí',
    no: 'No',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    next: 'Siguiente',
    previous: 'Anterior',
    submit: 'Enviar',
    required: 'Obligatorio',
    optional: 'Opcional',
    or: 'o',
    and: 'y',
  },
  product: {
    our_products: 'Nuestros Productos',
    acidity: 'Acidez',
    variety: 'Variedad',
    extraction: 'Extracción',
    origin: 'Origen',
    packaging: 'Envasado',
    moq: 'Cantidad mínima de pedido',
    specifications: 'Especificaciones técnicas',
    certifications: 'Certificaciones',
    gallery: 'Galería',
    request_quote: 'Solicitar presupuesto',
    details: 'Detalles del producto',
  },
  contact: {
    title: 'Contáctenos',
    subtitle: 'Envíenos su solicitud de presupuesto o cualquier consulta comercial.',
    full_name: 'Nombre completo',
    full_name_placeholder: 'Su nombre completo',
    company_name: 'Nombre de la empresa',
    company_name_placeholder: 'Nombre de su empresa',
    country: 'País',
    country_placeholder: 'Su país',
    email: 'Correo electrónico',
    email_placeholder: 'su@email.com',
    phone: 'Teléfono',
    phone_placeholder: '+34 XXX XXX XXX',
    product_interest: 'Producto de interés',
    product_interest_placeholder: 'Seleccione un producto',
    quantity: 'Cantidad estimada',
    quantity_placeholder: 'ej: 20 toneladas',
    destination_country: 'País de destino',
    destination_country_placeholder: 'País de importación',
    message: 'Mensaje',
    message_placeholder: 'Describa sus necesidades, especificaciones deseadas...',
    privacy_consent: 'Acepto la política de privacidad y el tratamiento de mis datos.',
    attach_file: 'Adjuntar archivo',
    send_request: 'Enviar solicitud',
    success_title: '¡Solicitud enviada!',
    success_message: 'Gracias por su solicitud. Nuestro equipo comercial le contactará en 24-48h.',
    error_title: 'Error de envío',
    error_message: 'Ocurrió un error. Inténtelo de nuevo o contáctenos directamente.',
  },
  footer: {
    company_description: 'Exportador tunecino líder de aceites de oliva orgánicos y convencionales de calidad superior.',
    quick_links: 'Enlaces rápidos',
    contact_us: 'Contáctenos',
    newsletter: 'Boletín',
    newsletter_placeholder: 'Su correo electrónico',
    subscribe: 'Suscribirse',
    rights_reserved: 'Todos los derechos reservados',
    privacy_policy: 'Política de privacidad',
    terms: 'Términos y condiciones',
    developed_by: 'Desarrollado por',
  },
  errors: {
    not_found: 'Página no encontrada',
    not_found_message: 'La página que busca no existe o ha sido movida.',
    server_error: 'Error del servidor',
    server_error_message: 'Ocurrió un error interno. Inténtelo más tarde.',
    network_error: 'Error de conexión',
    go_home: 'Volver al inicio',
    try_again: 'Intentar de nuevo',
    field_required: 'Este campo es obligatorio',
    invalid_email: 'Dirección de correo inválida',
    invalid_phone: 'Número de teléfono inválido',
  },
};

const it: Dictionary = {
  nav: {
    home: 'Home',
    products: 'Prodotti',
    about: 'Chi siamo',
    certifications: 'Certificazioni',
    export: 'Esportazione',
    contact: 'Contatto',
  },
  common: {
    read_more: 'Leggi di più',
    send: 'Invia',
    loading: 'Caricamento...',
    close: 'Chiudi',
    back: 'Indietro',
    search: 'Cerca',
    filter: 'Filtra',
    all: 'Tutto',
    download: 'Scarica',
    share: 'Condividi',
    yes: 'Sì',
    no: 'No',
    confirm: 'Conferma',
    cancel: 'Annulla',
    save: 'Salva',
    delete: 'Elimina',
    edit: 'Modifica',
    view: 'Vedi',
    next: 'Avanti',
    previous: 'Precedente',
    submit: 'Invia',
    required: 'Obbligatorio',
    optional: 'Facoltativo',
    or: 'o',
    and: 'e',
  },
  product: {
    our_products: 'I Nostri Prodotti',
    acidity: 'Acidità',
    variety: 'Varietà',
    extraction: 'Estrazione',
    origin: 'Origine',
    packaging: 'Confezionamento',
    moq: 'Quantità minima d\'ordine',
    specifications: 'Specifiche tecniche',
    certifications: 'Certificazioni',
    gallery: 'Galleria',
    request_quote: 'Richiedi preventivo',
    details: 'Dettagli del prodotto',
  },
  contact: {
    title: 'Contattaci',
    subtitle: 'Inviateci la vostra richiesta di preventivo o qualsiasi domanda commerciale.',
    full_name: 'Nome completo',
    full_name_placeholder: 'Il vostro nome completo',
    company_name: 'Nome dell\'azienda',
    company_name_placeholder: 'Nome della vostra azienda',
    country: 'Paese',
    country_placeholder: 'Il vostro paese',
    email: 'Email',
    email_placeholder: 'vostro@email.com',
    phone: 'Telefono',
    phone_placeholder: '+39 XXX XXX XXXX',
    product_interest: 'Prodotto di interesse',
    product_interest_placeholder: 'Seleziona un prodotto',
    quantity: 'Quantità stimata',
    quantity_placeholder: 'es: 20 tonnellate',
    destination_country: 'Paese di destinazione',
    destination_country_placeholder: 'Paese di importazione',
    message: 'Messaggio',
    message_placeholder: 'Descrivete le vostre esigenze, specifiche desiderate...',
    privacy_consent: 'Accetto la politica sulla privacy e il trattamento dei miei dati.',
    attach_file: 'Allega file',
    send_request: 'Invia richiesta',
    success_title: 'Richiesta inviata!',
    success_message: 'Grazie per la vostra richiesta. Il nostro team commerciale vi contatterà entro 24-48h.',
    error_title: 'Errore di invio',
    error_message: 'Si è verificato un errore. Riprovate o contattateci direttamente.',
  },
  footer: {
    company_description: 'Leader tunisino nell\'esportazione di oli d\'oliva biologici e convenzionali di qualità superiore.',
    quick_links: 'Link rapidi',
    contact_us: 'Contattaci',
    newsletter: 'Newsletter',
    newsletter_placeholder: 'Il vostro indirizzo email',
    subscribe: 'Iscriviti',
    rights_reserved: 'Tutti i diritti riservati',
    privacy_policy: 'Politica sulla privacy',
    terms: 'Termini e condizioni',
    developed_by: 'Sviluppato da',
  },
  errors: {
    not_found: 'Pagina non trovata',
    not_found_message: 'La pagina che stai cercando non esiste o è stata spostata.',
    server_error: 'Errore del server',
    server_error_message: 'Si è verificato un errore interno. Riprova più tardi.',
    network_error: 'Errore di connessione',
    go_home: 'Torna alla home',
    try_again: 'Riprova',
    field_required: 'Questo campo è obbligatorio',
    invalid_email: 'Indirizzo email non valido',
    invalid_phone: 'Numero di telefono non valido',
  },
};

export const dictionaries: Record<Locale, Dictionary> = { fr, en, ar, es, it };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.fr;
}
