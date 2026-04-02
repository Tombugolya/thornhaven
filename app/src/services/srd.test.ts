const mockRacesResponse = {
  count: 2,
  results: [
    { index: "elf", name: "Elf", url: "/api/races/elf" },
    { index: "dwarf", name: "Dwarf", url: "/api/races/dwarf" },
  ],
}

describe("fetchRaces", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Clear the module-level cache by re-importing fresh each time
    vi.resetModules()
  })

  it("calls the correct URL and returns results", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRacesResponse),
    })
    vi.stubGlobal("fetch", mockFetch)

    const { fetchRaces: freshFetchRaces } = await import("./srd")
    const results = await freshFetchRaces()

    expect(mockFetch).toHaveBeenCalledWith("https://www.dnd5eapi.co/api/races")
    expect(results).toEqual(mockRacesResponse.results)
  })

  it("caches results so second call does not fetch again", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRacesResponse),
    })
    vi.stubGlobal("fetch", mockFetch)

    const { fetchRaces: freshFetchRaces } = await import("./srd")

    await freshFetchRaces()
    await freshFetchRaces()

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
