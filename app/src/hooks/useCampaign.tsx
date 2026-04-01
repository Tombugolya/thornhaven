import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Campaign } from "../types/campaign"
import { campaigns } from "../data/campaigns"
import { useBroadcast } from "./useBroadcast"

interface CampaignContextValue {
  campaign: Campaign
  campaigns: Campaign[]
  selectCampaign: (id: string) => void
  showSelector: boolean
}

const CampaignContext = createContext<CampaignContextValue | null>(null)

export function CampaignProvider({ children }: { children: ReactNode }) {
  const { lastMessage, showToPlayer, role } = useBroadcast()
  const [campaignId, setCampaignId] = useState(() => {
    if (campaigns.length === 1) return campaigns[0].id
    try {
      return localStorage.getItem("dm:campaignId") || campaigns[0].id
    } catch {
      return campaigns[0].id
    }
  })

  const campaign = campaigns.find((c) => c.id === campaignId) || campaigns[0]

  // DM selects campaign → broadcast to player
  const selectCampaign = (id: string) => {
    setCampaignId(id)
    try {
      localStorage.setItem("dm:campaignId", id)
    } catch {}
    showToPlayer("selectCampaign", null, { campaignId: id })
  }

  // Player listens for campaign selection from DM
  useEffect(() => {
    if (role === "player" && lastMessage?.type === "selectCampaign") {
      setCampaignId((lastMessage as { type: "selectCampaign"; campaignId: string }).campaignId)
    }
  }, [lastMessage, role])

  return (
    <CampaignContext.Provider
      value={{
        campaign,
        campaigns,
        selectCampaign,
        showSelector: campaigns.length > 1,
      }}
    >
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  return useContext(CampaignContext) as CampaignContextValue
}
