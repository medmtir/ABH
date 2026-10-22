// Service Worker for ABH Admin PWA and Notifications
const CACHE_NAME = 'abh-admin-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle notification click on PC and Mobile (Android / iOS)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/admin/dashboard/messages';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'ABH Admin — Notification',
    body: 'Nouvelle activité commerciale sur votre espace ABH.',
    url: '/admin/dashboard/messages',
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/admin/dashboard/messages' },
    tag: 'abh-notification',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
