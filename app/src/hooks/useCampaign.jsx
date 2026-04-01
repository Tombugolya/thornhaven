import { createContext, useContext, useState, useEffect } from "react";
import { campaigns } from "../data/campaigns";
import { useBroadcast } from "./useBroadcast";

const CampaignContext = createContext(null);

export function CampaignProvider({ children }) {
  const { lastMessage, showToPlayer, role } = useBroadcast();
  const [campaignId, setCampaignId] = useState(() => {
    const urlCampaign = new URLSearchParams(window.location.search).get("campaign");
    if (urlCampaign && campaigns.find((c) => c.id === urlCampaign)) return urlCampaign;
    if (campaigns.length === 1) return campaigns[0].id;
    try {
      return localStorage.getItem("dm:campaignId") || campaigns[0].id;
    } catch {
      return campaigns[0].id;
    }
  });

  const campaign = campaigns.find((c) => c.id === campaignId) || campaigns[0];

  // DM selects campaign → broadcast to player
  const selectCampaign = (id) => {
    setCampaignId(id);
    try {
      localStorage.setItem("dm:campaignId", id);
    } catch {}
    showToPlayer("selectCampaign", null, { campaignId: id });
  };

  // Player listens for campaign selection from DM
  useEffect(() => {
    if (role === "player" && lastMessage?.type === "selectCampaign") {
      setCampaignId(lastMessage.campaignId);
    }
  }, [lastMessage, role]);

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
  );
}

export function useCampaign() {
  return useContext(CampaignContext);
}
