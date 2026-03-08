import { createFileRoute } from '@tanstack/react-router'
import { useAppSettings } from '../contexts/AppSettingsContext'

export const Route = createFileRoute('/tools')({
  component: ToolsPage,
})

const TOOL_CATEGORIES = [
  {
    id: 'essential',
    title: 'Essential Tools',
    description: 'Required for any soldered build (handwired, custom PCB, or PCB kit)',
    tools: [
      {
        name: 'Soldering Iron',
        notes: 'Temperature-controlled recommended. Hakko FX-888D or TS80P are popular choices. Budget: ~$25 for a passable iron, ~$80+ for a quality one.',
        required: true,
        estimatedCost: '$25–$100',
      },
      {
        name: 'Solder (63/37 or 60/40)',
        notes: '0.6–0.8mm rosin-core solder. 63/37 is eutectic (preferred) — it goes liquid-to-solid instantly with no pasty phase.',
        required: true,
        estimatedCost: '$8–$15',
      },
      {
        name: 'Flux',
        notes: 'No-clean rosin flux pen or paste. Dramatically improves solder flow and joint quality on pads that have oxidised.',
        required: true,
        estimatedCost: '$6–$12',
      },
      {
        name: 'Flush Cutters / Wire Cutters',
        notes: 'For trimming diode leads, wire ends, and zip-tie tails flush with the PCB. Japanese flush cutters (e.g., Hakko CHP-170) are excellent.',
        required: true,
        estimatedCost: '$10–$20',
      },
      {
        name: 'Multimeter',
        notes: 'Essential for continuity testing (checking solder bridges, verifying switch matrix wiring, and diagnosing dead keys).',
        required: true,
        estimatedCost: '$15–$40',
      },
      {
        name: 'Tweezers (ESD-safe)',
        notes: 'Fine-point anti-static tweezers for placing SMD components, diodes, and hot-swap sockets.',
        required: true,
        estimatedCost: '$8–$20',
      },
    ],
  },
  {
    id: 'strongly-recommended',
    title: 'Strongly Recommended',
    description: 'Not strictly required but will make your build much easier and more reliable',
    tools: [
      {
        name: 'ESD Wrist Strap',
        notes: 'Prevents electrostatic discharge that can silently damage controllers, LEDs, and OLED displays. A $5 precaution that protects a $100+ build.',
        required: false,
        estimatedCost: '$5–$10',
      },
      {
        name: 'Solder Wick / Desoldering Pump',
        notes: 'For removing solder bridges and desoldering misplaced components. Wick (braid) is more controllable for keyboard work.',
        required: false,
        estimatedCost: '$5–$15',
      },
      {
        name: 'Helping Hands / PCB Holder',
        notes: 'Holds the PCB at a comfortable angle while soldering. Prevents burns and improves joint quality.',
        required: false,
        estimatedCost: '$10–$25',
      },
      {
        name: 'Isopropyl Alcohol (IPA 90%+)',
        notes: 'Cleans flux residue from PCB after soldering. Use with a soft-bristle brush (toothbrush works).',
        required: false,
        estimatedCost: '$5–$10',
      },
      {
        name: 'Tip Tinner / Brass Wool',
        notes: 'Keeps your soldering iron tip clean and tinned, extending tip life and improving heat transfer.',
        required: false,
        estimatedCost: '$5–$10',
      },
    ],
  },
  {
    id: 'handwired',
    title: 'Handwired Builds Only',
    description: 'Additional tools needed when wiring switches without a PCB',
    tools: [
      {
        name: 'Wire (28–30 AWG)',
        notes: 'Thin solid-core or stranded wire for rows and columns. Solid-core is easier to route; stranded is more flexible. Different colours for rows/columns.',
        required: true,
        estimatedCost: '$8–$15',
      },
      {
        name: 'Wire Strippers',
        notes: 'For stripping insulation cleanly without nicking the conductor. Adjustable automatic strippers are fastest for repetitive work.',
        required: true,
        estimatedCost: '$10–$20',
      },
      {
        name: 'Diodes (1N4148 × 100+)',
        notes: 'One diode per switch for the key matrix. Through-hole (TH) are easier to hand-solder; SMD (SOD-123) are smaller. Buy extras.',
        required: true,
        estimatedCost: '$2–$5 (pack of 100)',
      },
      {
        name: 'Heat-shrink Tubing',
        notes: 'For insulating exposed connections and preventing shorts on bare wire joints.',
        required: false,
        estimatedCost: '$5–$10',
      },
    ],
  },
  {
    id: 'custom-pcb',
    title: 'Custom PCB Builds Only',
    description: 'Software and additional items needed when designing your own PCB',
    tools: [
      {
        name: 'KiCad (free software)',
        notes: 'Open-source PCB design suite. Use with ai03\'s MX keyboard switch library. Required for custom PCB design.',
        required: true,
        estimatedCost: 'Free',
      },
      {
        name: 'SMD Soldering Kit',
        notes: 'Fine-tip iron or hot air station for soldering USB connectors, SMD diodes, and LEDs. Your standard iron may work with practice.',
        required: false,
        estimatedCost: '$30–$80',
      },
      {
        name: 'Magnifying Glass / Loupe',
        notes: 'For inspecting SMD solder joints and checking for bridges under QFP/TQFP chips.',
        required: false,
        estimatedCost: '$10–$30',
      },
    ],
  },
  {
    id: 'wireless',
    title: 'Wireless (ZMK / nice!nano) Builds',
    description: 'Extra items for wireless split builds',
    tools: [
      {
        name: 'JST PH 2.0 Battery Connector',
        notes: 'Matches the battery connector on nice!nano. Buy batteries with matching connectors, or verify polarity carefully before connecting.',
        required: true,
        estimatedCost: '$1–$3',
      },
      {
        name: 'LiPo Battery (301230 or similar)',
        notes: 'A small LiPo cell that fits in your case. Common sizes: 100–500mAh. Check your case design for dimensions.',
        required: true,
        estimatedCost: '$5–$15',
      },
    ],
  },
]

function ToolsPage() {
  const { settings } = useAppSettings()
  const showPricing = settings.showPricing

  const allRequired = TOOL_CATEGORIES.flatMap((c) => c.tools.filter((t) => t.required))
  const totalMin = allRequired
    .map((t) => {
      const match = /\d+/.exec(t.estimatedCost)
      return match ? parseInt(match[0], 10) : 0
    })
    .reduce((a, b) => a + b, 0)

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          TOOLS_CHECKLIST
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Everything you need before starting your split keyboard build.
        </p>
      </div>

      {/* Starter budget — only shown when pricing is visible */}
      {showPricing && (
        <div
          className="mb-8 p-4 border-2"
          style={{
            borderColor: 'var(--color-accent-teal)',
            background: 'var(--color-bg-secondary)',
          }}
        >
          <div
            className="text-xs font-bold tracking-wide mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}
          >
            STARTER_BUDGET
          </div>
          <div
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent-teal)' }}
          >
            ~${totalMin}+
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Estimated minimum for essential tools (if starting from zero). Many builders already own
            some of these.
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-8">
        {TOOL_CATEGORIES.map((category) => (
          <div key={category.id}>
            <h2
              className="text-lg font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              {category.title.toUpperCase()}
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {category.description}
            </p>
            <div className="space-y-2">
              {category.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="glass-panel-light p-4 border-2 flex items-start gap-4"
                  style={{
                    borderColor: tool.required ? 'var(--color-border)' : 'var(--color-border-light)',
                    background: 'var(--color-bg-secondary)',
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className="tool-checkbox w-5 h-5 border-2"
                      style={{ borderColor: 'var(--color-border)' }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-bold text-sm"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {tool.name.toUpperCase()}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 border font-bold"
                        style={{
                          borderColor: tool.required
                            ? 'var(--color-accent-orange)'
                            : 'var(--color-border-light)',
                          color: tool.required
                            ? 'var(--color-accent-orange)'
                            : 'var(--color-text-secondary)',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {tool.required ? 'REQUIRED' : 'RECOMMENDED'}
                      </span>
                      {showPricing && (
                        <span
                          className="text-xs ml-auto"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {tool.estimatedCost}
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {tool.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
