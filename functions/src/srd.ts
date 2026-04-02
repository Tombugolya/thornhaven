import * as admin from "firebase-admin";

const SRD_BASE = "https://www.dnd5eapi.co/api";

/**
 * Fetch from the SRD API with Firebase RTDB caching.
 * Cache key: cache/srd/{sanitized-path}
 * Cache never expires (SRD data is static).
 */
export async function fetchSrd<T>(path: string): Promise<T> {
  const cacheKey = `cache/srd/${path.replace(/\//g, "_")}`;
  const db = admin.database();

  // Check cache first
  const snap = await db.ref(cacheKey).once("value");
  if (snap.exists()) {
    return snap.val() as T;
  }

  // Fetch from SRD API
  const url = `${SRD_BASE}${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SRD API error: ${response.status} ${response.statusText} for ${url}`);
  }
  const data = (await response.json()) as T;

  // Cache in RTDB (fire and forget)
  db.ref(cacheKey).set(data).catch(() => {
    // Cache write failure is non-critical
  });

  return data;
}

// --- Typed fetch helpers ---

interface SrdListResponse {
  count: number;
  results: Array<{ index: string; name: string; url: string; level?: number }>;
}

export async function getRaces() {
  const data = await fetchSrd<SrdListResponse>("/races");
  return data.results;
}

export async function getRace(index: string) {
  return fetchSrd(`/races/${index}`);
}

export async function getSubrace(index: string) {
  return fetchSrd(`/subraces/${index}`);
}

export async function getClasses() {
  const data = await fetchSrd<SrdListResponse>("/classes");
  return data.results;
}

export async function getClass(index: string) {
  return fetchSrd(`/classes/${index}`);
}

export async function getClassSpells(classIndex: string) {
  const data = await fetchSrd<SrdListResponse>(`/classes/${classIndex}/spells`);
  return data.results;
}

export async function getSpell(index: string) {
  return fetchSrd(`/spells/${index}`);
}

export async function getSkills() {
  const data = await fetchSrd<SrdListResponse>("/skills");
  // Fetch full details for each skill (need ability_score mapping)
  const details = await Promise.all(
    data.results.map((s) => fetchSrd(`/skills/${s.index}`))
  );
  return details;
}

export async function getTrait(index: string) {
  return fetchSrd(`/traits/${index}`);
}
