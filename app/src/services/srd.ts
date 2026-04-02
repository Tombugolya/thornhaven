import type {
  SrdRace,
  SrdSubrace,
  SrdClass,
  SrdSkill,
  SrdTrait,
  SrdLevelDetail,
  SrdReference,
  SrdSpellDetail,
} from "../types/character"

const BASE_URL = "https://www.dnd5eapi.co/api"

// In-memory cache — SRD data is static, never changes
const cache = new Map<string, unknown>()

async function fetchJson<T>(path: string): Promise<T> {
  const cached = cache.get(path)
  if (cached) return cached as T

  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`SRD API error: ${response.status} ${response.statusText}`)
  }
  const data: T = await response.json()
  cache.set(path, data)
  return data
}

interface SrdListResponse {
  count: number
  results: SrdReference[]
}

// --- Races ---

export async function fetchRaces(): Promise<SrdReference[]> {
  const data = await fetchJson<SrdListResponse>("/races")
  return data.results
}

export async function fetchRace(index: string): Promise<SrdRace> {
  return fetchJson<SrdRace>(`/races/${index}`)
}

export async function fetchSubrace(index: string): Promise<SrdSubrace> {
  return fetchJson<SrdSubrace>(`/subraces/${index}`)
}

// --- Classes ---

export async function fetchClasses(): Promise<SrdReference[]> {
  const data = await fetchJson<SrdListResponse>("/classes")
  return data.results
}

export async function fetchClass(index: string): Promise<SrdClass> {
  return fetchJson<SrdClass>(`/classes/${index}`)
}

export async function fetchClassLevel(classIndex: string, level: number): Promise<SrdLevelDetail> {
  return fetchJson<SrdLevelDetail>(`/classes/${classIndex}/levels/${level}`)
}

// --- Spells ---

interface SrdSpellListItem {
  index: string
  name: string
  level: number
  url: string
}

export async function fetchClassSpells(classIndex: string): Promise<SrdSpellListItem[]> {
  const data = await fetchJson<{ count: number; results: SrdSpellListItem[] }>(
    `/classes/${classIndex}/spells`,
  )
  return data.results
}

export async function fetchSpell(index: string): Promise<SrdSpellDetail> {
  return fetchJson<SrdSpellDetail>(`/spells/${index}`)
}

// --- Skills ---

export async function fetchSkills(): Promise<SrdSkill[]> {
  const data = await fetchJson<SrdListResponse>("/skills")
  // Fetch full details for each skill (need ability_score mapping)
  const skills = await Promise.all(
    data.results.map((s) => fetchJson<SrdSkill>(`/skills/${s.index}`)),
  )
  return skills
}

// --- Traits ---

export async function fetchTrait(index: string): Promise<SrdTrait> {
  return fetchJson<SrdTrait>(`/traits/${index}`)
}

// --- Preload commonly needed data ---

export async function preloadCharacterCreationData(): Promise<{
  races: SrdReference[]
  classes: SrdReference[]
  skills: SrdSkill[]
}> {
  const [races, classes, skills] = await Promise.all([fetchRaces(), fetchClasses(), fetchSkills()])
  return { races, classes, skills }
}
