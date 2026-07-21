/**
 * LifeCTRL Payment Links Configuration
 *
 * Centralized mapping of kit titles and products to Stripe payment links.
 * Update links here and all UI components pick them up automatically.
 */

// ── Stripe Payment Links ──

export const STRIPE_LINKS = {
  /** LifeCTRL Pro monthly subscription */
  pro: 'https://buy.stripe.com/9B6cN52g666o77edVC6kg01',

  /** Human Concierge session booking */
  concierge: 'https://buy.stripe.com/28E00jf2S8ewdvC9Fm6kg08',
} as const;

/**
 * Map of kit title → Stripe payment link.
 * Titles must match exactly what's stored in the database (seedKits.ts).
 */
export const KIT_PAYMENT_LINKS: Record<string, string> = {
  'Job Loss Recovery Kit': 'https://buy.stripe.com/28E3cvf2S8ewgHO3gY6kg02',
  'Moving & Relocation Kit': 'https://buy.stripe.com/5kQ9ATdYOfGYdvC3gY6kg03',
  'Financial Reset Kit': 'https://buy.stripe.com/fZu5kD07YamEajq18Q6kg04',
  'First-Time Renter Kit': 'https://buy.stripe.com/6oU3cv9IycuM3V29Fm6kg05',
  'Career Pivot Kit': 'https://buy.stripe.com/4gM7sL1c2cuM63a8Bi6kg06',
  'Paperwork Overhaul Kit': 'https://buy.stripe.com/eVq6oH2g6amE0IQ2cU6kg07',
};

/**
 * Get a Stripe payment link for a kit by its title.
 * Returns undefined if no link is configured for the given title.
 */
export function getKitPaymentLink(title: string): string | undefined {
  return KIT_PAYMENT_LINKS[title];
}

/**
 * Open a Stripe payment link in a new tab.
 */
export function openPaymentLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
