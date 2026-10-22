import { NextRequest, NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/lib/db/db';
import { validateAdminSession } from '@/lib/auth';
import { Payment } from '@/lib/types';

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { order_id, date, amount, method, reference, notes } = await request.json();

    if (!order_id || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Montant valide requis' }, { status: 400 });
    }

    const db = loadDatabase();
    const order = (db.orders || []).find((o) => o.id === order_id);

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    const paymentAmount = Number(amount);
    if (paymentAmount > order.remaining_amount + 0.01) {
      return NextResponse.json(
        { error: `Le montant dépasse le solde restant (${order.remaining_amount} ${order.currency})` },
        { status: 400 }
      );
    }

    const newPayment: Payment = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: date || new Date().toISOString().split('T')[0],
      amount: paymentAmount,
      method: method || 'wire_transfer',
      reference: reference || '',
      notes: notes || '',
    };

    if (!Array.isArray(order.payments)) {
      order.payments = [];
    }

    order.payments.push(newPayment);
    order.paid_amount = Number((order.paid_amount + paymentAmount).toFixed(2));
    order.remaining_amount = Number(Math.max(0, order.total_amount - order.paid_amount).toFixed(2));

    if (order.remaining_amount <= 0) {
      order.payment_status = 'paid';
    } else {
      order.payment_status = 'partial';
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur enregistrement acompte' }, { status: 500 });
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
    const payment_id = searchParams.get('payment_id');

    if (!order_id || !payment_id) {
      return NextResponse.json({ error: 'order_id et payment_id requis' }, { status: 400 });
    }

    const db = loadDatabase();
    const order = (db.orders || []).find((o) => o.id === order_id);

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    order.payments = (order.payments || []).filter((p) => p.id !== payment_id);
    const totalPaid = (order.payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    order.paid_amount = Number(totalPaid.toFixed(2));
    order.remaining_amount = Number(Math.max(0, order.total_amount - order.paid_amount).toFixed(2));

    if (order.paid_amount <= 0) {
      order.payment_status = 'unpaid';
    } else if (order.remaining_amount <= 0) {
      order.payment_status = 'paid';
    } else {
      order.payment_status = 'partial';
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression ligne de paiement' }, { status: 500 });
  }
}
