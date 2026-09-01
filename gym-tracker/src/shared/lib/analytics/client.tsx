"use client";

/**
 * Analytics removed — private two-user app, nothing to measure.
 * No-op stubs kept so existing call sites compile.
 */
import type { ReactNode } from "react";

const AnalyticsProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

const track = (_name: string, _payload?: Record<string, unknown>) => {};

export { AnalyticsProvider, track };
