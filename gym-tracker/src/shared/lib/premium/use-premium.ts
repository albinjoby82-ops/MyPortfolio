"use client";

import type { PremiumStatus, UserSubscription } from "@/shared/types/premium.types";

/**
 * Two-user private app: there is no paid tier, so everyone is "premium".
 *
 * These hooks keep the original signatures so the many call sites inherited
 * from the upstream base still compile. The Stripe/RevenueCat plumbing behind
 * them has been deleted.
 */

export function usePremiumStatus() {
  return { data: { isPremium: true } as PremiumStatus, isLoading: false, isPending: false, error: null };
}

export function useSubscription() {
  return { data: { isActive: true } as UserSubscription, isLoading: false, isPending: false, error: null };
}

export function useIsPremium(): boolean {
  return true;
}
