
import { ScrollVelocityContainer, ScrollVelocityRow } from "./ui/scroll-based-velocity"

export function ScrollBasedVelocityDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <ScrollVelocityContainer className="text-3xl font-bold tracking-[-0.02em] md:text-6xl md:leading-[4rem]">
        <ScrollVelocityRow baseVelocity={20} direction={1}>
         Draw Magical
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={20} direction={-1}>
          Draw Magical 
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}
