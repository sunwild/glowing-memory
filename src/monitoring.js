import * as Sentry from '@sentry/browser'
import { onCLS, onFID, onLCP } from 'web-vitals'

export function initMonitoring() {
  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN })
  onCLS(metric => Sentry.captureMessage(`CLS:${metric.value}`))
  onFID(metric => Sentry.captureMessage(`FID:${metric.value}`))
  onLCP(metric => Sentry.captureMessage(`LCP:${metric.value}`))
}
