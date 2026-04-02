import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { ref, onValue, off } from "firebase/database"
import { db } from "../firebase"
import {
  fetchRaces,
  fetchRace,
  fetchSubrace,
  fetchClasses,
  fetchClass,
  fetchSkills,
  fetchTrait,
  fetchClassSpells,
  fetchSpell,
} from "../services/srd"
import type { PlayerCharacter } from "../types/character"

// --- SRD Data Queries ---

export function useRaces() {
  return useQuery({
    queryKey: ["srd", "races"],
    queryFn: fetchRaces,
  })
}

export function useRace(index: string | undefined) {
  return useQuery({
    queryKey: ["srd", "race", index],
    queryFn: () => fetchRace(index!),
    enabled: !!index,
  })
}

export function useSubrace(index: string | undefined) {
  return useQuery({
    queryKey: ["srd", "subrace", index],
    queryFn: () => fetchSubrace(index!),
    enabled: !!index,
  })
}

export function useClasses() {
  return useQuery({
    queryKey: ["srd", "classes"],
    queryFn: fetchClasses,
  })
}

export function useClass(index: string | undefined) {
  return useQuery({
    queryKey: ["srd", "class", index],
    queryFn: () => fetchClass(index!),
    enabled: !!index,
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ["srd", "skills"],
    queryFn: fetchSkills,
  })
}

export function useTrait(index: string | undefined) {
  return useQuery({
    queryKey: ["srd", "trait", index],
    queryFn: () => fetchTrait(index!),
    enabled: !!index,
  })
}

export function useClassSpells(classIndex: string | undefined) {
  return useQuery({
    queryKey: ["srd", "classSpells", classIndex],
    queryFn: () => fetchClassSpells(classIndex!),
    enabled: !!classIndex,
  })
}

export function useSpell(index: string | undefined) {
  return useQuery({
    queryKey: ["srd", "spell", index],
    queryFn: () => fetchSpell(index!),
    enabled: !!index,
  })
}

// --- Preload all data needed for character creation ---

export function useCharacterCreationData() {
  const races = useRaces()
  const classes = useClasses()
  const skills = useSkills()

  return {
    races: races.data ?? [],
    classes: classes.data ?? [],
    skills: skills.data ?? [],
    isLoading: races.isLoading || classes.isLoading || skills.isLoading,
    error: races.error ?? classes.error ?? skills.error,
  }
}

// --- Firebase Character List ---

export function usePlayerCharacters(userId: string) {
  const [characters, setCharacters] = useState<PlayerCharacter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const charsRef = ref(db, `players/${userId}/characters`)
    onValue(charsRef, (snap) => {
      const data = snap.val() as Record<string, PlayerCharacter> | null
      setCharacters(data ? Object.values(data) : [])
      setIsLoading(false)
    })
    return () => off(charsRef)
  }, [userId])

  return { characters, isLoading }
}
