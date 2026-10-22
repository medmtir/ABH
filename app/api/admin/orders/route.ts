import { NextRequest, NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';
import { Order, Currency } from '@/lib/types';

export async function GET(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const db = loadDatabase();
  const orders = (db.orders || []).filter((o) => !o.is_deleted);

  // Compute financial KPIs strictly by currency
  const kpis: Record<Currency, { total: number; paid: number; remaining: number }> = {
    EUR: { total: 0, paid: 0, remaining: 0 },
    TND: { total: 0, paid: 0, remaining: 0 },
    USD: { total: 0, paid: 0, remaining: 0 },
  };

  orders.forEach((o) => {
    const cur = (o.currency || 'EUR') as Currency;
    if (kpis[cur]) {
      kpis[cur].total += o.total_amount || 0;
      kpis[cur].paid += o.paid_amount || 0;
      kpis[cur].remaining += o.remaining_amount || 0;
    }
  });

  return NextResponse.json({
    orders,
    kpis,
    total_orders: orders.length,
  });
}

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      client_name,
      product_id,
      product_name,
      packaging,
      quantity,
      unit = 'tonnes',
      unit_price,
      currency = 'EUR',
      order_date,
      notes,
    } = body;

    if (!client_name || !product_name || !quantity || !unit_price) {
      return NextResponse.json(
        { error: 'Veuillez remplir les informations obligatoires' },
        { status: 400 }
      );
    }

    const db = loadDatabase();
    const total_amount = Number(quantity) * Number(unit_price);
    const year = new Date().getFullYear();
    const count = (db.orders || []).length + 1;
    const order_number = `CMD-${year}-${String(count).padStart(3, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order_number,
      client_id: client_id || '',
      client_name,
      product_id: product_id || '',
      product_name,
      packaging: packaging || 'Flexitank 24 000L',
      quantity: Number(quantity),
      unit,
      unit_price: Number(unit_price),
      currency: currency as Currency,
      total_amount,
      paid_amount: 0,
      remaining_amount: total_amount,
      payment_status: 'unpaid',
      order_status: 'confirmed',
      order_date: order_date || new Date().toISOString().split('T')[0],
      payments: [],
      delivery_installments: [],
      delivered_quantity: 0,
      remaining_quantity: Number(quantity),
      delivery_status: 'pending',
      is_deleted: false,
      notes: notes || '',
      created_at: new Date().toISOString(),
    };

    if (!Array.isArray(db.orders)) {
      db.orders = [];
    }

    db.orders.unshift(newOrder);
    saveDatabase(db);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création commande' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const db = loadDatabase();
    const order = (db.orders || []).find((o) => o.id === id);

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    Object.assign(order, updates);

    // If quantity or unit_price changed, recalculate totals
    if (updates.quantity !== undefined || updates.unit_price !== undefined) {
      order.quantity = Number(order.quantity);
      order.unit_price = Number(order.unit_price);
      order.total_amount = Number((order.quantity * order.unit_price).toFixed(2));
      order.remaining_amount = Number(Math.max(0, order.total_amount - (order.paid_amount || 0)).toFixed(2));
      order.remaining_quantity = Number(Math.max(0, order.quantity - (order.delivered_quantity || 0)).toFixed(2));

      if (order.paid_amount <= 0) {
        order.payment_status = 'unpaid';
      } else if (order.remaining_amount <= 0) {
        order.payment_status = 'paid';
      } else {
        order.payment_status = 'partial';
      }

      if (order.delivered_quantity <= 0) {
        order.delivery_status = 'pending';
      } else if (order.remaining_quantity <= 0) {
        order.delivery_status = 'delivered';
      } else {
        order.delivery_status = 'partial';
      }
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour commande' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const db = loadDatabase();
    const order = (db.orders || []).find((o) => o.id === id);

    if (order) {
      order.is_deleted = true;
      order.deleted_at = new Date().toISOString();
      saveDatabase(db);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression commande' }, { status: 500 });
  }
}
