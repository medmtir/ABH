'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  DollarSign,
  Ship,
  FileText,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Building2,
  ChevronDown,
  ChevronUp,
  Package,
  Calendar,
  Layers,
  ArrowRight,
  UserPlus,
  Filter,
} from 'lucide-react';
import { Client, Order, Currency, OrderStatus, Payment, DeliveryInstallment } from '@/lib/types';

export default function AdminClientsOrdersPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'clients'>('orders');
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [kpis, setKpis] = useState<Record<Currency, { total: number; paid: number; remaining: number }>>({
    EUR: { total: 0, paid: 0, remaining: 0 },
    TND: { total: 0, paid: 0, remaining: 0 },
    USD: { total: 0, paid: 0, remaining: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderCurrencyFilter, setOrderCurrencyFilter] = useState<string>('all');
  const [clientSearch, setClientSearch] = useState('');

  // Expandable row state for orders (shows lines for payment & delivery)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Modals state
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: 'client' | 'order' | 'payment' | 'delivery';
    id: string;
    parentOrderId?: string;
    title: string;
  }>({ open: false, type: 'client', id: '', title: '' });

  // Client mode in order creation: 'existing' or 'new'
  const [orderClientMode, setOrderClientMode] = useState<'existing' | 'new'>('existing');

  // Form states
  const [clientForm, setClientForm] = useState({
    name: '',
    tax_id: '',
    contact_person: '',
    email: '',
    phone: '',
    country: 'Tunisie',
    address: '',
    notes: '',
  });

  const [orderForm, setOrderForm] = useState({
    client_id: '',
    client_name: '',
    // Quick new client inline fields
    new_client_name: '',
    new_client_country: 'Tunisie',
    new_client_contact: '',
    new_client_email: '',
    new_client_phone: '',
    new_client_tax_id: '',
    // Order fields
    product_name: "Huile d'Olive Vierge Extra",
    packaging: 'Flexitank 24 000L',
    quantity: 21,
    unit: 'tonnes' as 'tonnes' | 'liters' | 'kg',
    unit_price: 6500,
    currency: 'EUR' as Currency,
    order_date: new Date().toISOString().split('T')[0],
    order_status: 'confirmed' as OrderStatus,
    notes: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    method: 'wire_transfer' as const,
    reference: '',
    notes: '',
  });

  const [deliveryForm, setDeliveryForm] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: 0,
    bl_number: '',
    notes: '',
  });

  // Fetch initial data
  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/clients').then((r) => r.json()),
      fetch('/api/admin/orders').then((r) => r.json()),
    ])
      .then(([clientData, orderData]) => {
        if (Array.isArray(clientData)) setClients(clientData);
        if (orderData && Array.isArray(orderData.orders)) {
          setOrders(orderData.orders);
          if (orderData.kpis) setKpis(orderData.kpis);
        }
      })
      .catch((err) => console.error('Error loading data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.client_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.product_name.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus =
        orderStatusFilter === 'all' || o.order_status === orderStatusFilter;
      const matchCurrency =
        orderCurrencyFilter === 'all' || o.currency === orderCurrencyFilter;
      return matchSearch && matchStatus && matchCurrency;
    });
  }, [orders, orderSearch, orderStatusFilter, orderCurrencyFilter]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      return (
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.country.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.contact_person && c.contact_person.toLowerCase().includes(clientSearch.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(clientSearch.toLowerCase())) ||
        (c.tax_id && c.tax_id.toLowerCase().includes(clientSearch.toLowerCase()))
      );
    });
  }, [clients, clientSearch]);

  // Count orders per client
  const clientOrderCount = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const key = o.client_id || o.client_name;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [orders]);

  // ==========================================
  // HANDLERS: CLIENTS (Add, Edit, Delete)
  // ==========================================

  const handleOpenAddClient = () => {
    setEditingClient(null);
    setClientForm({
      name: '',
      tax_id: '',
      contact_person: '',
      email: '',
      phone: '',
      country: 'Tunisie',
      address: '',
      notes: '',
    });
    setClientModalOpen(true);
  };

  const handleOpenEditClient = (c: Client) => {
    setEditingClient(c);
    setClientForm({
      name: c.name,
      tax_id: c.tax_id || '',
      contact_person: c.contact_person || '',
      email: c.email || '',
      phone: c.phone || '',
      country: c.country || 'Tunisie',
      address: c.address || '',
      notes: c.notes || '',
    });
    setClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        // Edit existing client (PUT)
        const res = await fetch('/api/admin/clients', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingClient.id, ...clientForm }),
        });
        if (res.ok) {
          setClientModalOpen(false);
          loadData();
        } else {
          alert('Erreur lors de la modification du client');
        }
      } else {
        // Create new client (POST)
        const res = await fetch('/api/admin/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientForm),
        });
        if (res.ok) {
          setClientModalOpen(false);
          loadData();
        } else {
          alert('Erreur lors de la création du client');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm({ open: false, type: 'client', id: '', title: '' });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // HANDLERS: ORDERS (Add, Edit, Delete)
  // ==========================================

  const handleOpenAddOrder = (preselectedClientId?: string) => {
    setEditingOrder(null);
    let defaultClientId = '';
    let defaultClientName = '';

    if (preselectedClientId) {
      const match = clients.find((c) => c.id === preselectedClientId);
      if (match) {
        defaultClientId = match.id;
        defaultClientName = match.name;
        setOrderClientMode('existing');
      }
    } else if (clients.length > 0) {
      defaultClientId = clients[0].id;
      defaultClientName = clients[0].name;
      setOrderClientMode('existing');
    } else {
      setOrderClientMode('new');
    }

    setOrderForm({
      client_id: defaultClientId,
      client_name: defaultClientName,
      new_client_name: '',
      new_client_country: 'Tunisie',
      new_client_contact: '',
      new_client_email: '',
      new_client_phone: '',
      new_client_tax_id: '',
      product_name: "Huile d'Olive Vierge Extra",
      packaging: 'Flexitank 24 000L',
      quantity: 21,
      unit: 'tonnes',
      unit_price: 6500,
      currency: 'EUR',
      order_date: new Date().toISOString().split('T')[0],
      order_status: 'confirmed',
      notes: '',
    });
    setOrderModalOpen(true);
  };

  const handleOpenEditOrder = (order: Order) => {
    setEditingOrder(order);
    setOrderForm({
      client_id: order.client_id,
      client_name: order.client_name,
      new_client_name: '',
      new_client_country: 'Tunisie',
      new_client_contact: '',
      new_client_email: '',
      new_client_phone: '',
      new_client_tax_id: '',
      product_name: order.product_name,
      packaging: order.packaging,
      quantity: order.quantity,
      unit: order.unit,
      unit_price: order.unit_price,
      currency: order.currency,
      order_date: order.order_date,
      order_status: order.order_status,
      notes: order.notes || '',
    });
    setOrderModalOpen(true);
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        // Edit order (PUT)
        const res = await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingOrder.id,
            product_name: orderForm.product_name,
            packaging: orderForm.packaging,
            quantity: orderForm.quantity,
            unit: orderForm.unit,
            unit_price: orderForm.unit_price,
            currency: orderForm.currency,
            order_status: orderForm.order_status,
            order_date: orderForm.order_date,
            notes: orderForm.notes,
          }),
        });
        if (res.ok) {
          setOrderModalOpen(false);
          loadData();
        } else {
          alert('Erreur modification commande');
        }
      } else {
        // Create new order (POST)
        let finalClientId = orderForm.client_id;
        let finalClientName = orderForm.client_name;

        // If user chose "new client" inline
        if (orderClientMode === 'new') {
          if (!orderForm.new_client_name.trim()) {
            alert('Veuillez renseigner le nom du nouveau client');
            return;
          }
          // Create client first
          const cliRes = await fetch('/api/admin/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: orderForm.new_client_name.trim(),
              country: orderForm.new_client_country.trim() || 'Tunisie',
              contact_person: orderForm.new_client_contact.trim(),
              email: orderForm.new_client_email.trim(),
              phone: orderForm.new_client_phone.trim(),
              tax_id: orderForm.new_client_tax_id.trim(),
            }),
          });
          const cliData = await cliRes.json();
          if (cliData.success && cliData.client) {
            finalClientId = cliData.client.id;
            finalClientName = cliData.client.name;
          } else {
            alert('Erreur lors de la création du nouveau client');
            return;
          }
        }

        const res = await fetch('/api/admin/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: finalClientId,
            client_name: finalClientName,
            product_name: orderForm.product_name,
            packaging: orderForm.packaging,
            quantity: orderForm.quantity,
            unit: orderForm.unit,
            unit_price: orderForm.unit_price,
            currency: orderForm.currency,
            order_date: orderForm.order_date,
            notes: orderForm.notes,
          }),
        });

        if (res.ok) {
          setOrderModalOpen(false);
          loadData();
        } else {
          alert('Erreur création commande');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm({ open: false, type: 'order', id: '', title: '' });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // HANDLERS: PAYMENTS & DELIVERIES (Line Items)
  // ==========================================

  const handleOpenAddPayment = (order: Order) => {
    setSelectedOrder(order);
    setPaymentForm({
      date: new Date().toISOString().split('T')[0],
      amount: order.remaining_amount > 0 ? order.remaining_amount : 0,
      method: 'wire_transfer',
      reference: '',
      notes: '',
    });
    setPaymentModalOpen(true);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await fetch('/api/admin/orders/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          ...paymentForm,
        }),
      });
      if (res.ok) {
        setPaymentModalOpen(false);
        loadData();
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Erreur paiement');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePaymentLine = async (orderId: string, paymentId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/payments?order_id=${orderId}&payment_id=${paymentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteConfirm({ open: false, type: 'payment', id: '', title: '' });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddDelivery = (order: Order) => {
    setSelectedOrder(order);
    setDeliveryForm({
      date: new Date().toISOString().split('T')[0],
      quantity: order.remaining_quantity > 0 ? order.remaining_quantity : 0,
      bl_number: '',
      notes: '',
    });
    setDeliveryModalOpen(true);
  };

  const handleAddDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await fetch('/api/admin/orders/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          ...deliveryForm,
        }),
      });
      if (res.ok) {
        setDeliveryModalOpen(false);
        loadData();
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Erreur livraison');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDeliveryLine = async (orderId: string, deliveryId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/deliveries?order_id=${orderId}&delivery_id=${deliveryId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteConfirm({ open: false, type: 'delivery', id: '', title: '' });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-abh-sapphire flex items-center gap-2">
            <span>CRM Clients & Gestion des Commandes Export</span>
          </h1>
          <p className="text-xs text-abh-slate mt-0.5">
            Suivi des flux financiers (EUR, TND, USD), règlements par ligne et expéditions B/L.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'orders' ? (
            <button
              onClick={() => handleOpenAddOrder()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors"
            >
              <Plus className="h-4 w-4 text-abh-amber" />
              <span>Créer une Commande</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddClient}
              className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors"
            >
              <Plus className="h-4 w-4 text-abh-amber" />
              <span>Ajouter un Client</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-abh-border gap-3 sm:gap-6 text-xs font-semibold overflow-x-auto no-scrollbar touch-scroll">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'orders'
              ? 'border-abh-amber text-abh-sapphire'
              : 'border-transparent text-gray-400 hover:text-abh-sapphire'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Commandes & Expéditions ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'clients'
              ? 'border-abh-amber text-abh-sapphire'
              : 'border-transparent text-gray-400 hover:text-abh-sapphire'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Répertoire Clients ({clients.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ORDERS & SHIPMENTS WITH LINE ITEMS & ACTIONS      */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          {/* Financial summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {(['EUR', 'TND', 'USD'] as const).map((curr) => {
              const kpi = kpis[curr] || { total: 0, paid: 0, remaining: 0 };
              const percent = kpi.total > 0 ? Math.round((kpi.paid / kpi.total) * 100) : 0;
              return (
                <div key={curr} className="rounded-2xl bg-white p-3.5 sm:p-4 border border-abh-border shadow-xs card-hover">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-abh-amber uppercase tracking-wider">{curr} — Contrats</span>
                    <span className="text-[10px] text-abh-slate font-medium">{percent}% Encaissé</span>
                  </div>
                  <div className="text-xl font-heading font-bold text-abh-sapphire">
                    {kpi.total.toLocaleString()} {curr}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden my-2.5">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] pt-1">
                    <span className="text-emerald-700 font-semibold">
                      Encaissé: {kpi.paid.toLocaleString()} {curr}
                    </span>
                    <span className="text-amber-800 font-semibold">
                      Solde: {kpi.remaining.toLocaleString()} {curr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-2xl bg-white p-3 sm:p-4 border border-abh-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-abh-slate" />
              <input
                type="text"
                placeholder="Rechercher par N° commande, client ou produit..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-abh-border bg-abh-pearl/30 focus:outline-none focus:border-abh-amber"
              />
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full md:w-auto">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full sm:w-auto text-xs rounded-xl border border-abh-border px-3 py-2 bg-white text-abh-midnight focus:outline-none focus:border-abh-amber"
              >
                <option value="all">Tous statuts</option>
                <option value="confirmed">Confirmé</option>
                <option value="in_production">En production</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>

              <select
                value={orderCurrencyFilter}
                onChange={(e) => setOrderCurrencyFilter(e.target.value)}
                className="w-full sm:w-auto text-xs rounded-xl border border-abh-border px-3 py-2 bg-white text-abh-midnight focus:outline-none focus:border-abh-amber"
              >
                <option value="all">Toutes devises</option>
                <option value="EUR">EUR (€)</option>
                <option value="TND">TND (DT)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl bg-white border border-abh-border p-12 text-center text-xs text-abh-slate shadow-xs">
                {orderSearch ? 'Aucune commande ne correspond à votre recherche.' : 'Aucune commande enregistrée. Cliquez sur "+ Créer une Commande".'}
              </div>
            ) : (
              filteredOrders.map((o) => {
                const isExpanded = expandedOrderId === o.id;
                const paidPercent = o.total_amount > 0 ? Math.round((o.paid_amount / o.total_amount) * 100) : 0;
                const delivPercent = o.quantity > 0 ? Math.round((o.delivered_quantity / o.quantity) * 100) : 0;

                return (
                  <div
                    key={o.id}
                    className="rounded-2xl bg-white border border-abh-border shadow-xs overflow-hidden transition-all duration-200"
                  >
                    {/* Order summary header card */}
                    <div className="p-3.5 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-sm text-abh-sapphire">
                            {o.order_number}
                          </span>
                          <span className="text-abh-slate font-medium">•</span>
                          <span className="font-bold text-abh-midnight text-sm">
                            {o.client_name}
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            ({new Date(o.order_date).toLocaleDateString()})
                          </span>
                          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                            {o.order_status}
                          </span>
                        </div>

                        <div className="text-xs text-abh-slate flex items-center gap-2">
                          <Package className="h-3.5 w-3.5 text-abh-amber" />
                          <span className="font-semibold text-abh-midnight">{o.product_name}</span>
                          <span>• {o.quantity} {o.unit} ({o.packaging})</span>
                        </div>

                        {/* Financial and delivery indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-xl">
                          {/* Payment status */}
                          <div className="bg-abh-pearl/40 p-2.5 rounded-xl border border-abh-border/60">
                            <div className="flex justify-between items-center text-[11px] mb-1">
                              <span className="text-abh-slate font-medium">Financier :</span>
                              <span className="font-bold text-abh-midnight">
                                {o.total_amount.toLocaleString()} {o.currency}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-600 h-full rounded-full"
                                style={{ width: `${Math.min(100, paidPercent)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] mt-1">
                              <span className="text-emerald-700 font-medium">Payé: {o.paid_amount.toLocaleString()} ({paidPercent}%)</span>
                              <span className="text-amber-800 font-medium">Reste: {o.remaining_amount.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Delivery status */}
                          <div className="bg-abh-pearl/40 p-2.5 rounded-xl border border-abh-border/60">
                            <div className="flex justify-between items-center text-[11px] mb-1">
                              <span className="text-abh-slate font-medium">Expédition BL :</span>
                              <span className="font-bold text-abh-midnight">
                                {o.quantity} {o.unit}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-abh-sapphire h-full rounded-full"
                                style={{ width: `${Math.min(100, delivPercent)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] mt-1">
                              <span className="text-abh-sapphire font-medium">Livré: {o.delivered_quantity} ({delivPercent}%)</span>
                              <span className="text-abh-slate font-medium">Reste: {o.remaining_quantity}</span>
                            </div>
                          </div>
                        </div>

                        {o.notes && (
                          <p className="text-[11px] text-gray-500 italic mt-1">
                            Note: {o.notes}
                          </p>
                        )}
                      </div>

                      {/* Action buttons on the order */}
                      <div className="flex flex-wrap items-center justify-between sm:justify-start lg:flex-col lg:items-end gap-2 pt-2 border-t border-gray-100 lg:border-t-0 lg:pt-0 w-full lg:w-auto">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleOpenAddPayment(o)}
                            className="rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                            title="Ajouter un règlement"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>Encaisser (+Acompte)</span>
                          </button>

                          <button
                            onClick={() => handleOpenAddDelivery(o)}
                            className="rounded-xl bg-emerald-900/10 text-abh-sapphire border border-abh-sapphire/20 px-3 py-1.5 text-xs font-semibold hover:bg-abh-sapphire/20 transition-colors flex items-center gap-1"
                            title="Ajouter un BL"
                          >
                            <Ship className="h-3.5 w-3.5" />
                            <span>Livrer (+BL)</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors flex items-center gap-1 ${
                              isExpanded
                                ? 'bg-abh-amber text-white border-abh-amber'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <Layers className="h-3.5 w-3.5" />
                            <span>Lignes ({(o.payments?.length || 0) + (o.delivery_installments?.length || 0)})</span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5 ml-0.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
                          </button>

                          <button
                            onClick={() => handleOpenEditOrder(o)}
                            className="p-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-abh-sapphire hover:border-abh-sapphire transition-colors"
                            title="Modifier la commande"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: 'order',
                                id: o.id,
                                title: `Commande ${o.order_number} (${o.client_name})`,
                              })
                            }
                            className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                            title="Supprimer la commande"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDABLE SECTION: LINE ITEMS FOR PAYMENT & DELIVERY */}
                    {isExpanded && (
                      <div className="border-t border-abh-border bg-abh-pearl/30 p-4 sm:p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* SUBSECTION 1: LIGNES DE PAIEMENT */}
                          <div className="bg-white rounded-xl border border-abh-border p-4 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-emerald-600" />
                                <h4 className="font-bold text-xs text-abh-midnight">
                                  Lignes de Règlement & Acomptes ({o.payments?.length || 0})
                                </h4>
                              </div>
                              <button
                                onClick={() => handleOpenAddPayment(o)}
                                className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Ajouter</span>
                              </button>
                            </div>

                            {(!o.payments || o.payments.length === 0) ? (
                              <p className="text-[11px] text-gray-400 py-3 text-center italic">
                                Aucun acompte ou règlement enregistré.
                              </p>
                            ) : (
                              <div className="divide-y divide-gray-100 text-xs">
                                {o.payments.map((p, idx) => (
                                  <div key={p.id || idx} className="py-2.5 flex items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-emerald-700">
                                          +{p.amount.toLocaleString()} {o.currency}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                          ({new Date(p.date).toLocaleDateString()})
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-abh-slate">
                                        Mode: <b className="capitalize">{p.method.replace('_', ' ')}</b>
                                        {p.reference && ` • Réf: ${p.reference}`}
                                      </p>
                                      {p.notes && <p className="text-[10px] text-gray-400 italic">{p.notes}</p>}
                                    </div>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirm({
                                          open: true,
                                          type: 'payment',
                                          id: p.id,
                                          parentOrderId: o.id,
                                          title: `Ligne de versement de ${p.amount} ${o.currency} du ${new Date(p.date).toLocaleDateString()}`,
                                        })
                                      }
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                      title="Supprimer cette ligne"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* SUBSECTION 2: LIGNES DE LIVRAISON / EXPEDITION BL */}
                          <div className="bg-white rounded-xl border border-abh-border p-4 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <Ship className="h-4 w-4 text-abh-sapphire" />
                                <h4 className="font-bold text-xs text-abh-midnight">
                                  Lignes d Expédition & Connaissements B/L ({o.delivery_installments?.length || 0})
                                </h4>
                              </div>
                              <button
                                onClick={() => handleOpenAddDelivery(o)}
                                className="text-[11px] font-semibold text-abh-sapphire hover:underline flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Ajouter</span>
                              </button>
                            </div>

                            {(!o.delivery_installments || o.delivery_installments.length === 0) ? (
                              <p className="text-[11px] text-gray-400 py-3 text-center italic">
                                Aucune expédition enregistrée.
                              </p>
                            ) : (
                              <div className="divide-y divide-gray-100 text-xs">
                                {o.delivery_installments.map((d, idx) => (
                                  <div key={d.id || idx} className="py-2.5 flex items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-abh-sapphire">
                                          {d.quantity} {o.unit}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                          ({new Date(d.date).toLocaleDateString()})
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-abh-slate">
                                        N° B/L: <b className="font-mono text-abh-midnight">{d.bl_number || 'Non renseigné'}</b>
                                      </p>
                                      {d.notes && <p className="text-[10px] text-gray-400 italic">{d.notes}</p>}
                                    </div>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirm({
                                          open: true,
                                          type: 'delivery',
                                          id: d.id,
                                          parentOrderId: o.id,
                                          title: `Ligne de livraison de ${d.quantity} ${o.unit} (BL: ${d.bl_number})`,
                                        })
                                      }
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                      title="Supprimer cette ligne"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CLIENTS DIRECTORY (With Edit & Delete)            */}
      {/* ======================================================== */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          {/* Client search */}
          <div className="rounded-2xl bg-white p-4 border border-abh-border shadow-xs flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-abh-slate" />
              <input
                type="text"
                placeholder="Rechercher par raison sociale, pays, contact ou email..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-abh-border bg-abh-pearl/30 focus:outline-none focus:border-abh-amber"
              />
            </div>
            <button
              onClick={handleOpenAddClient}
              className="inline-flex items-center gap-1.5 rounded-xl bg-abh-sapphire px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-abh-midnight transition-colors"
            >
              <UserPlus className="h-4 w-4 text-abh-amber" />
              <span>Nouveau Client</span>
            </button>
          </div>

          {/* Clients List */}
          <div className="rounded-2xl bg-white border border-abh-border shadow-xs overflow-hidden">
            <div className="p-4 bg-abh-pearl/40 border-b border-abh-border text-xs font-bold text-abh-sapphire flex items-center justify-between">
              <span>Répertoire des Entreprises Clientes ({filteredClients.length})</span>
            </div>

            {filteredClients.length === 0 ? (
              <div className="p-12 text-center text-xs text-abh-slate">
                {clientSearch ? 'Aucun client ne correspond à votre recherche.' : 'Aucun client enregistré. Cliquez sur "Nouveau Client".'}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredClients.map((c) => {
                  const ordersCount = clientOrderCount[c.id] || clientOrderCount[c.name] || 0;
                  return (
                    <div
                      key={c.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-abh-pearl/20 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-abh-sapphire shrink-0" />
                          <h4 className="font-bold text-abh-midnight text-sm">{c.name}</h4>
                          <span className="rounded-full bg-abh-sand/50 px-2 py-0.5 text-[10px] text-abh-sapphire font-semibold border border-abh-border">
                            {c.country}
                          </span>
                          {ordersCount > 0 && (
                            <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                              {ordersCount} commande{ordersCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-abh-slate">
                          Contact : <b className="text-abh-midnight">{c.contact_person || 'Non spécifié'}</b>
                          {c.tax_id && ` • Matricule Fiscal : ${c.tax_id}`}
                        </p>

                        <p className="text-[11px] text-abh-copper">
                          {c.email && <span>{c.email}</span>}
                          {c.email && c.phone && <span> • </span>}
                          {c.phone && <span>{c.phone}</span>}
                        </p>

                        {c.address && (
                          <p className="text-[10px] text-gray-400">
                            Adresse : {c.address}
                          </p>
                        )}
                        {c.notes && (
                          <p className="text-[10px] text-gray-500 italic">
                            Note : {c.notes}
                          </p>
                        )}
                      </div>

                      {/* Action buttons for Client */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenAddOrder(c.id)}
                          className="rounded-xl bg-abh-sand/50 text-abh-sapphire border border-abh-border px-3 py-1.5 text-xs font-semibold hover:bg-abh-sapphire hover:text-white transition-colors flex items-center gap-1"
                          title="Passer une commande pour ce client"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Commander</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditClient(c)}
                          className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-abh-sapphire hover:border-abh-sapphire transition-colors"
                          title="Modifier le client"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: 'client',
                              id: c.id,
                              title: `Client ${c.name} (${c.country})`,
                            })
                          }
                          className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          title="Supprimer le client"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT CLIENT                               */}
      {/* ======================================================== */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-abh-border max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setClientModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-abh-sapphire p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-1">
              {editingClient ? 'Modifier la Fiche Client' : 'Nouveau Client Entreprise'}
            </h3>
            <p className="text-xs text-abh-slate mb-4">
              Renseignez les coordonnées de l acheteur ou importateur international.
            </p>
            <form onSubmit={handleSaveClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Raison Sociale / Société *</label>
                <input
                  type="text"
                  required
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  placeholder="ex. Mediterranean Oils SpA"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Pays *</label>
                  <input
                    type="text"
                    required
                    value={clientForm.country}
                    onChange={(e) => setClientForm({ ...clientForm, country: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                    placeholder="ex. Italie"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Matricule Fiscal / Tax ID</label>
                  <input
                    type="text"
                    value={clientForm.tax_id}
                    onChange={(e) => setClientForm({ ...clientForm, tax_id: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                    placeholder="ex. IT09281928"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Personne de Contact</label>
                <input
                  type="text"
                  value={clientForm.contact_person}
                  onChange={(e) => setClientForm({ ...clientForm, contact_person: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  placeholder="ex. Giovanni Rossi (Directeur Achats)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Email</label>
                  <input
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                    placeholder="achats@company.com"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Téléphone / WhatsApp</label>
                  <input
                    type="tel"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                    placeholder="+39 02 8192831"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Adresse / Port de destination</label>
                <input
                  type="text"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  placeholder="ex. Port de Gênes, Via Roma 14"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Notes Commerciales</label>
                <textarea
                  rows={2}
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  placeholder="Historique, exigences particulières..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-abh-sapphire py-2.5 text-white font-semibold hover:bg-abh-midnight transition-colors"
                >
                  {editingClient ? 'Enregistrer les Modifications' : 'Créer le Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD / EDIT ORDER (With Existing vs New Client)  */}
      {/* ======================================================== */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-abh-border max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-abh-sapphire p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-1">
              {editingOrder ? `Modifier Commande ${editingOrder.order_number}` : 'Nouvelle Commande Commerciale'}
            </h3>
            <p className="text-xs text-abh-slate mb-4">
              Sélectionnez un client existant ou créez-en un directement pour cette commande.
            </p>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              {/* Only show client chooser when creating a new order */}
              {!editingOrder ? (
                <div className="rounded-xl border border-abh-border bg-abh-pearl/30 p-3 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-abh-midnight">Client de la commande</span>
                    <div className="flex rounded-lg bg-white border border-abh-border p-0.5 text-[11px] self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setOrderClientMode('existing')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                          orderClientMode === 'existing'
                            ? 'bg-abh-sapphire text-white'
                            : 'text-gray-600 hover:text-abh-sapphire'
                        }`}
                      >
                        Client Existant
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderClientMode('new')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                          orderClientMode === 'new'
                            ? 'bg-abh-sapphire text-white'
                            : 'text-gray-600 hover:text-abh-sapphire'
                        }`}
                      >
                        + Nouveau Client
                      </button>
                    </div>
                  </div>

                  {orderClientMode === 'existing' ? (
                    <div>
                      {clients.length === 0 ? (
                        <p className="text-amber-800 text-[11px]">
                          Aucun client existant. Choisissez &quot;+ Nouveau Client&quot; pour en créer un.
                        </p>
                      ) : (
                        <select
                          value={orderForm.client_id}
                          onChange={(e) => {
                            const chosenId = e.target.value;
                            const match = clients.find((c) => c.id === chosenId);
                            setOrderForm({
                              ...orderForm,
                              client_id: chosenId,
                              client_name: match ? match.name : '',
                            });
                          }}
                          className="w-full rounded-xl border border-abh-border p-2.5 bg-white text-abh-midnight font-medium focus:outline-none focus:border-abh-amber"
                        >
                          {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.country}) {c.contact_person ? `— ${c.contact_person}` : ''}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ) : (
                    /* Inline New Client Creation Form */
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-medium text-abh-midnight mb-1">
                          Raison Sociale / Nom du Client *
                        </label>
                        <input
                          type="text"
                          required
                          value={orderForm.new_client_name}
                          onChange={(e) => setOrderForm({ ...orderForm, new_client_name: e.target.value })}
                          className="w-full rounded-xl border border-abh-border p-2 bg-white focus:outline-none focus:border-abh-amber"
                          placeholder="ex. Global Olive Trading Ltd"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-abh-midnight mb-1">Pays *</label>
                          <input
                            type="text"
                            required
                            value={orderForm.new_client_country}
                            onChange={(e) => setOrderForm({ ...orderForm, new_client_country: e.target.value })}
                            className="w-full rounded-xl border border-abh-border p-2 bg-white focus:outline-none focus:border-abh-amber"
                            placeholder="ex. Espagne"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-abh-midnight mb-1">Contact</label>
                          <input
                            type="text"
                            value={orderForm.new_client_contact}
                            onChange={(e) => setOrderForm({ ...orderForm, new_client_contact: e.target.value })}
                            className="w-full rounded-xl border border-abh-border p-2 bg-white focus:outline-none focus:border-abh-amber"
                            placeholder="ex. Carlos Perez"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-abh-midnight mb-1">Email</label>
                          <input
                            type="email"
                            value={orderForm.new_client_email}
                            onChange={(e) => setOrderForm({ ...orderForm, new_client_email: e.target.value })}
                            className="w-full rounded-xl border border-abh-border p-2 bg-white focus:outline-none focus:border-abh-amber"
                            placeholder="contact@globalolive.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-abh-midnight mb-1">Téléphone</label>
                          <input
                            type="tel"
                            value={orderForm.new_client_phone}
                            onChange={(e) => setOrderForm({ ...orderForm, new_client_phone: e.target.value })}
                            className="w-full rounded-xl border border-abh-border p-2 bg-white focus:outline-none focus:border-abh-amber"
                            placeholder="+34 91 123 4567"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-abh-pearl/40 border border-abh-border text-xs">
                  <span className="text-abh-slate font-medium">Client : </span>
                  <span className="font-bold text-abh-midnight">{editingOrder.client_name}</span>
                </div>
              )}

              {/* Product & Packaging */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Produit *</label>
                  <select
                    value={orderForm.product_name}
                    onChange={(e) => setOrderForm({ ...orderForm, product_name: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 bg-white focus:outline-none focus:border-abh-amber"
                  >
                    <option value="Huile d'Olive Vierge Extra">Huile d Olive Vierge Extra</option>
                    <option value="Huile d'Olive Biologique">Huile d Olive Biologique</option>
                    <option value="Huile d'Olive Raffinée">Huile d Olive Raffinée</option>
                    <option value="Huile de Grignons d'Olive">Huile de Grignons d Olive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Conditionnement *</label>
                  <input
                    type="text"
                    required
                    value={orderForm.packaging}
                    onChange={(e) => setOrderForm({ ...orderForm, packaging: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                    placeholder="Flexitank 24 000L"
                  />
                </div>
              </div>

              {/* Quantities & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Quantité ({orderForm.unit}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-abh-border p-2.5 font-mono font-bold focus:outline-none focus:border-abh-amber"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Prix Unitaire *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={orderForm.unit_price}
                    onChange={(e) => setOrderForm({ ...orderForm, unit_price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-abh-border p-2.5 font-mono font-bold focus:outline-none focus:border-abh-amber"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Devise *</label>
                  <select
                    value={orderForm.currency}
                    onChange={(e) => setOrderForm({ ...orderForm, currency: e.target.value as Currency })}
                    className="w-full rounded-xl border border-abh-border p-2.5 bg-white font-bold focus:outline-none focus:border-abh-amber"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="TND">TND (DT)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              {/* Live total calculation */}
              <div className="rounded-xl bg-abh-sand/50 p-3 border border-abh-border flex items-center justify-between text-xs">
                <span className="text-abh-slate font-medium">Montant Total Calculé :</span>
                <span className="font-heading font-bold text-base text-abh-sapphire">
                  {(orderForm.quantity * orderForm.unit_price).toLocaleString()} {orderForm.currency}
                </span>
              </div>

              {/* Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Date de Commande</label>
                  <input
                    type="date"
                    value={orderForm.order_date}
                    onChange={(e) => setOrderForm({ ...orderForm, order_date: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Statut Commande</label>
                  <select
                    value={orderForm.order_status}
                    onChange={(e) => setOrderForm({ ...orderForm, order_status: e.target.value as any })}
                    className="w-full rounded-xl border border-abh-border p-2.5 bg-white focus:outline-none focus:border-abh-amber"
                  >
                    <option value="confirmed">Confirmé</option>
                    <option value="in_production">En production</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Notes / Spécifications</label>
                <textarea
                  rows={2}
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  placeholder="Incoterm CIF / FOB, exigences d analyse..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-abh-sapphire py-2.5 text-white font-semibold hover:bg-abh-midnight transition-colors"
                >
                  {editingOrder ? 'Enregistrer les Modifications' : 'Générer la Commande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD PAYMENT LINE                                */}
      {/* ======================================================== */}
      {paymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-abh-border max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-abh-sapphire p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-1 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <span>Enregistrer un Règlement</span>
            </h3>
            <p className="text-xs text-abh-slate mb-4">
              Commande : <b>{selectedOrder.order_number}</b> ({selectedOrder.client_name})<br />
              Solde restant dû : <b className="text-amber-800">{selectedOrder.remaining_amount.toLocaleString()} {selectedOrder.currency}</b>
            </p>

            <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Date du Versement *</label>
                  <input
                    type="date"
                    required
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Montant ({selectedOrder.currency}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={paymentForm.amount || ''}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber font-mono font-bold"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Mode de Paiement</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as any })}
                  className="w-full rounded-xl border border-abh-border p-2.5 bg-white focus:outline-none focus:border-abh-amber"
                >
                  <option value="wire_transfer">Virement Bancaire International (SWIFT)</option>
                  <option value="letter_of_credit">Crédit Documentaire Irrévocable (L/C)</option>
                  <option value="check">Chèque Certifié / Traite</option>
                  <option value="cash">Espèces</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Référence Bancaire</label>
                <input
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber font-mono"
                  placeholder="ex. SWIFT FT240928192"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Notes</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  placeholder="Acompte 30%, solde à l embarquement..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Valider la Ligne de Règlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD DELIVERY LINE (B/L)                         */}
      {/* ======================================================== */}
      {deliveryModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-abh-border max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setDeliveryModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-abh-sapphire p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-heading font-bold text-abh-sapphire mb-1 flex items-center gap-2">
              <Ship className="h-5 w-5 text-abh-sapphire" />
              <span>Enregistrer une Expédition (BL)</span>
            </h3>
            <p className="text-xs text-abh-slate mb-4">
              Commande : <b>{selectedOrder.order_number}</b> ({selectedOrder.client_name})<br />
              Reste à expédier : <b>{selectedOrder.remaining_quantity} {selectedOrder.unit}</b>
            </p>

            <form onSubmit={handleAddDelivery} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Date d Expédition *</label>
                  <input
                    type="date"
                    required
                    value={deliveryForm.date}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, date: e.target.value })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-abh-midnight">Quantité ({selectedOrder.unit}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={deliveryForm.quantity || ''}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, quantity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber font-mono font-bold"
                    placeholder="ex. 21.0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">N° Connaissement Maritime (Bill of Lading) *</label>
                <input
                  type="text"
                  required
                  value={deliveryForm.bl_number}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, bl_number: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber font-mono uppercase"
                  placeholder="ex. MSCU-9281928"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-abh-midnight">Navire / Compagnie Maritime / Port</label>
                <input
                  type="text"
                  value={deliveryForm.notes}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-abh-border p-2.5 focus:outline-none focus:border-abh-amber"
                  placeholder="MSC Le Havre, Port de Rades vers Marseille..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-abh-sapphire py-2.5 text-white font-semibold hover:bg-abh-midnight transition-colors shadow-xs"
                >
                  Confirmer la Ligne d Expédition BL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: DELETE CONFIRMATION                             */}
      {/* ======================================================== */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-abh-midnight/70 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-abh-border text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-abh-midnight">
                Confirmer la suppression
              </h3>
              <p className="text-xs text-abh-slate mt-1">
                Êtes-vous sûr de vouloir supprimer cet élément ?<br />
                <b className="text-abh-midnight">{deleteConfirm.title}</b>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ open: false, type: 'client', id: '', title: '' })}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirm.type === 'client') {
                    handleDeleteClient(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'order') {
                    handleDeleteOrder(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'payment' && deleteConfirm.parentOrderId) {
                    handleDeletePaymentLine(deleteConfirm.parentOrderId, deleteConfirm.id);
                  } else if (deleteConfirm.type === 'delivery' && deleteConfirm.parentOrderId) {
                    handleDeleteDeliveryLine(deleteConfirm.parentOrderId, deleteConfirm.id);
                  }
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-xs"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
