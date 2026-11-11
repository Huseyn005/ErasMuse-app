// supabase/functions/_shared/guard.ts
// Shared protections for public Edge Functions:
//   - CORS allow-list (only your own site origins are accepted)
//   - request size limit
//   - best-effort per-IP rate limit
//
// ALLOWED_ORIGINS is a Supabase secret: a comma-separated list of exact origins,
// e.g. "https://your-site.vercel.app,http://localhost:3001"

export type CorsHeaders = Record<string, string>;

function allowedOrigins(): string[] {
  return (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

/** CORS headers if the request comes from an allowed site, otherwise null. */
export function corsFor(req: Request): CorsHeaders | null {
  const origin = req.headers.get("origin");
  if (!origin || !allowedOrigins().includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function json(
  body: unknown,
  status = 200,
  headers: CorsHeaders = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

export function tooLarge(req: Request, maxBytes: number): boolean {
  const len = Number(req.headers.get("content-length") ?? 0);
  return Number.isFinite(len) && len > maxBytes;
}

// Best-effort limiter: memory is per function instance, so it slows down
// casual abuse but is not a hard guarantee.
const hits = new Map<string, number[]>();

export function rateLimited(
  key: string,
  max = 20,
  windowMs = 10 * 60 * 1000,
): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    }
  }
  return false;
}
