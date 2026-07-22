/**
 * LifeCTRL SaaS — Stripe Webhook Integration
 * Monetization Bus → Core Database Synchronization
 *
 * Security: Cryptographic Webhook Signature Verification
 *
 * Adapted from the production Express handler to Hono + bun:sqlite.
 * The production handler uses PostgreSQL; this version uses SQLite via getDb().
 * All credit/debit logic mirrors the production handler exactly.
 *
 * Integration notes:
 * - Webhook endpoint must read the raw body (c.req.text()) — never c.req.json()
 * - client_reference_id must be set to the user's numeric ID during Stripe checkout session creation
 * - Three env vars required: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 *   (DATABASE_PRIVATE_URL is not needed — we use SQLite via getDb())
 */

import type { Context } from 'hono';
import Stripe from 'stripe';
import { getDb } from './db';

// Lazy-init Stripe singleton
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('[Monetization Bus] STRIPE_SECRET_KEY environment variable is not set');
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: '2025-06-30.acacia' as any, // Stripe API version
    });
  }
  return _stripe;
}

/**
 * Main webhook handler for Hono.
 * Must be called with the raw request body — uses c.req.text(), NOT c.req.json().
 */
export async function handleStripeWebhook(c: Context): Promise<Response> {
  const sig = c.req.header('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    console.error('[Monetization Bus Error] Missing stripe-signature header');
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  if (!endpointSecret) {
    console.error('[Monetization Bus Error] STRIPE_WEBHOOK_SECRET is not configured');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // CRITICAL: Read raw body for cryptographic signature verification.
  // Never use c.req.json() here — Stripe requires the raw buffer.
  let rawBody: string;
  try {
    rawBody = await c.req.text();
  } catch (err: any) {
    console.error(`[Monetization Bus Error] Failed to read raw body: ${err.message}`);
    return new Response('Failed to read request body', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    // Cryptographically verify that the payload hasn't been tampered with
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error(`[Monetization Bus Error] Signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as any;
  let userId: string | number | undefined;
  let customerId: string | undefined;
  let subscriptionStatus: string | undefined;

  // Process specific checkout and subscription lifecycle states
  switch (event.type) {
    // Scenario 1: Initial subscription purchase successful
    case 'checkout.session.completed':
      userId = session.client_reference_id; // User's numeric ID passed from the signup/payment gate
      customerId = session.customer;

      if (!userId) {
        console.error('[Monetization Bus Error] checkout.session.completed missing client_reference_id');
        break;
      }

      // Retrieve full subscription details to extract exact status
      if (session.subscription) {
        try {
          const stripe = getStripe();
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          subscriptionStatus = subscription.status; // typically 'active'

          await updateCustomerAndSubscription(Number(userId), customerId, subscriptionStatus);
        } catch (err: any) {
          console.error(`[Monetization Bus Error] Failed to retrieve subscription: ${err.message}`);
        }
      }
      break;

    // Scenario 2: Successful monthly/annual recurring renewal payment
    case 'invoice.payment_succeeded':
      customerId = session.customer;
      subscriptionStatus = 'active';

      if (customerId) {
        await updateSubscriptionStatusByCustomer(customerId, subscriptionStatus);
      }
      break;

    // Scenario 3: Payment fails or subscription is explicitly cancelled
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      customerId = session.customer;
      subscriptionStatus = session.status; // e.g., 'past_due', 'unpaid', or 'canceled'

      if (customerId) {
        await updateSubscriptionStatusByCustomer(customerId, subscriptionStatus);
      }
      break;

    default:
      // Ignore unhandled informational operational logs
      console.log(`[Monetization Bus] Unhandled telemetry event type: ${event.type}`);
  }

  // Return a 200 response immediately to inform Stripe the payload was processed safely
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Helper: Links Stripe Account Generation Data to User Account State.
 * Called during initial checkout.session.completed.
 */
async function updateCustomerAndSubscription(
  userId: number,
  customerId: string,
  status: string,
): Promise<void> {
  const db = getDb();
  try {
    const result = db.prepare(
      `UPDATE users
       SET stripe_customer_id = ?, stripe_subscription_status = ?
       WHERE id = ?`
    ).run(customerId, status, userId);
    console.log(
      `[Monetization Bus Success] User ${userId} updated: customer=${customerId}, status=${status}`
    );
  } catch (error: any) {
    console.error(`[Database Error] Failed to execute initial checkout mapping:`, error.message);
  }
}

/**
 * Helper: Updates Access Gate for Existing Recurring Customers.
 * Called for invoice.payment_succeeded, customer.subscription.updated, and
 * customer.subscription.deleted events.
 */
async function updateSubscriptionStatusByCustomer(
  customerId: string,
  status: string,
): Promise<void> {
  const db = getDb();
  try {
    const result = db.prepare(
      `UPDATE users
       SET stripe_subscription_status = ?
       WHERE stripe_customer_id = ?`
    ).run(status, customerId);
    console.log(
      `[Monetization Bus Success] Syncing Customer ${customerId}. ` +
      `System Status: ${status} (${result.changes} rows altered).`
    );
  } catch (error: any) {
    console.error(`[Database Error] Failed to update subscription state:`, error.message);
  }
}
