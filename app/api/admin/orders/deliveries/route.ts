import { NextRequest, NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';
import { DeliveryInstallment } from '@/lib/types';

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { order_id, date, quantity, bl_number, notes } = await request.json();

    if (!order_id || !quantity || Number(quantity) <= 0) {
      return NextResponse.json({ error: 'Quantité livrée requise' }, { status: 400 });
    }

    const db = loadDatabase();
    const order = (db.orders || []).find((o) => o.id === order_id);

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    const deliveredQty = Number(quantity);

    const newDelivery: DeliveryInstallment = {
      id: `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: date || new Date().toISOString().split('T')[0],
      quantity: deliveredQty,
      bl_number: bl_number || '',
      notes: notes || '',
    };

    if (!Array.isArray(order.delivery_installments)) {
      order.delivery_installments = [];
    }

    order.delivery_installments.push(newDelivery);
    order.delivered_quantity = Number((order.delivered_quantity + deliveredQty).toFixed(2));
    order.remaining_quantity = Number(Math.max(0, order.quantity - order.delivered_quantity).toFixed(2));

    if (order.remaining_quantity <= 0) {
      order.delivery_status = 'delivered';
      order.order_status = 'delivered';
    } else {
      order.delivery_status = 'partial';
      order.order_status = 'shipped';
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur enregistrement livraison maritime' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get('order_id');
    const delivery_id = searchParams.get('delivery_id');

    if (!order_id || !delivery_id) {
      return NextResponse.json({ error: 'order_id et delivery_id requis' }, { status: 400 });
    }

    const db = loadDatabase();
    const order = (db.orders || []).find((o) => o.id === order_id);

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    order.delivery_installments = (order.delivery_installments || []).filter((d) => d.id !== delivery_id);
    const totalDelivered = (order.delivery_installments || []).reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
    order.delivered_quantity = Number(totalDelivered.toFixed(2));
    order.remaining_quantity = Number(Math.max(0, order.quantity - order.delivered_quantity).toFixed(2));

    if (order.delivered_quantity <= 0) {
      order.delivery_status = 'pending';
      if (order.order_status === 'shipped' || order.order_status === 'delivered') {
        order.order_status = 'confirmed';
      }
    } else if (order.remaining_quantity <= 0) {
      order.delivery_status = 'delivered';
      order.order_status = 'delivered';
    } else {
      order.delivery_status = 'partial';
      order.order_status = 'shipped';
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression ligne de livraison' }, { status: 500 });
  }
}
