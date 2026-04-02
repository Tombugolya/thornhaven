import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Tooltip from "./Tooltip"

describe("Tooltip", () => {
  it("does not show tooltip text by default", () => {
    render(<Tooltip text="Helpful info">Label</Tooltip>)

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("shows tooltip text on hover", async () => {
    const user = userEvent.setup()
    render(<Tooltip text="Helpful info">Label</Tooltip>)

    const trigger = screen.getByRole("button", { name: "Helpful info" })
    await user.hover(trigger)

    expect(screen.getByRole("tooltip")).toHaveTextContent("Helpful info")
  })

  it("toggles tooltip visibility on click", () => {
    render(<Tooltip text="Helpful info">Label</Tooltip>)

    const trigger = screen.getByRole("button", { name: "Helpful info" })

    // Click to show
    fireEvent.click(trigger)
    expect(screen.getByRole("tooltip")).toBeInTheDocument()

    // Click to hide
    fireEvent.click(trigger)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })
})
