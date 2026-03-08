import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/glossary')({
  component: GlossaryPage,
})

const GLOSSARY_TERMS = [
  {
    term: 'Cherry MX',
    definition:
      'A family of mechanical key switches made by Cherry GmbH. Widely cloned; the "MX" footprint is the most common PCB footprint for 5-pin or 3-pin (PCB-mount) switches.',
  },
  {
    term: 'Choc (Kailh Choc)',
    definition:
      'Low-profile mechanical switches made by Kailh. Choc v1 and v2 are not compatible with each other. Popular in slim and travel keyboards.',
  },
  {
    term: 'Column-stagger',
    definition:
      'A keyboard layout where each column of keys is offset vertically to better align with finger lengths, compared to the row-stagger of traditional keyboards.',
  },
  {
    term: 'Custom PCB',
    definition:
      'A Printed Circuit Board designed specifically for your keyboard, ordered from a manufacturer (e.g., JLCPCB, PCBWay). Requires KiCad design skills and a 2–4 week lead time.',
  },
  {
    term: 'Diode',
    definition:
      'A 1N4148 through-hole or SOD-123 SMD component placed on each switch. Diodes prevent "ghosting" (phantom keypresses) and enable N-key rollover (NKRO).',
  },
  {
    term: 'Elite-C',
    definition:
      'A Pro Micro clone with a USB-C port and a more durable connector design. Uses the same ATmega32U4 MCU as Pro Micro, compatible with QMK and Vial.',
  },
  {
    term: 'ESD (Electrostatic Discharge)',
    definition:
      'Static electricity discharge that can permanently damage microcontrollers, LEDs, and PCBs. Use a grounded wrist strap and anti-static mat when handling components.',
  },
  {
    term: 'Encoder (Rotary Encoder)',
    definition:
      'A knob that can be rotated (and often clicked) to send arbitrary keycodes. Useful for volume control, scrolling, or layer switching. Requires firmware support.',
  },
  {
    term: 'Ergonomic-3D',
    definition:
      'A keyboard form factor with significant column stagger, optional tenting (angling the halves), and sometimes a curved plate that follows the natural arc of the fingers.',
  },
  {
    term: 'Firmware',
    definition:
      'Software that runs on the keyboard controller MCU, defining key mappings, layers, macros, and features. Common options: QMK, Vial, ZMK, KMK.',
  },
  {
    term: 'Flat-splay',
    definition:
      'A split keyboard layout that lies flat but has its halves angled outward (splayed) to reduce ulnar deviation. Less extreme than ergonomic-3D.',
  },
  {
    term: 'Gasket mount',
    definition:
      'A case mounting style where the PCB or top plate sits on a layer of soft gaskets rather than being screwed directly to the case, providing a softer, bouncier typing feel.',
  },
  {
    term: 'Gerbers',
    definition:
      'A set of manufacturing files exported from PCB design software (KiCad, Eagle) that describes copper layers, silkscreen, drill holes, and board outline for PCB fabrication.',
  },
  {
    term: 'Handwired',
    definition:
      'A build method where switches are mounted in a plate or case and wired together manually using wire and diodes, without a PCB. Flexible but time-consuming.',
  },
  {
    term: 'Hot-swap sockets',
    definition:
      'Mill-Max or Kailh sockets soldered to a PCB that allow switches to be inserted and removed without soldering. Require PCB support and are slightly more expensive.',
  },
  {
    term: 'KiCad',
    definition:
      'Free, open-source PCB design software. The standard tool for custom keyboard PCB design. Has a large library of keyboard-specific footprints (e.g., ai03\'s MX library).',
  },
  {
    term: 'KMK',
    definition:
      'Python-based keyboard firmware for RP2040 / CircuitPython boards. Easier to configure than QMK (edit a Python file) but with a smaller feature set.',
  },
  {
    term: 'Layer',
    definition:
      'A virtual keyboard layout that is activated by holding or toggling a key. Allows a 40% keyboard to access all symbols, numbers, and function keys.',
  },
  {
    term: 'MCU (Microcontroller Unit)',
    definition:
      'The chip that runs the keyboard firmware. Common MCUs: ATmega32U4 (Pro Micro, Elite-C), RP2040 (Pi Pico, KB2040), nRF52840 (nice!nano for wireless).',
  },
  {
    term: 'N-key rollover (NKRO)',
    definition:
      'The ability to register any number of simultaneous keypresses. Requires diodes in the matrix. Most QMK boards support NKRO; some older USB HID implementations limit to 6KRO.',
  },
  {
    term: 'nice!nano',
    definition:
      'A Pro Micro replacement controller with a Nordic nRF52840 BLE chip, enabling wireless splits. Used with ZMK firmware. Compatible with LiPo batteries.',
  },
  {
    term: 'OLED display',
    definition:
      'A small I2C monochrome display (typically 128×32 or 128×64) that can show layer status, WPM, logos, or custom animations. Requires firmware support (QMK/ZMK).',
  },
  {
    term: 'PCB-kit',
    definition:
      'A pre-designed PCB (and often a case) sold as a kit for a specific keyboard. Less flexible than a custom PCB but much easier — you just solder switches.',
  },
  {
    term: 'Pro Micro',
    definition:
      'The most common and cheapest keyboard controller. Uses ATmega32U4 MCU with micro-USB. Compatible with QMK and Vial. Clones from AliExpress cost ~$4.',
  },
  {
    term: 'QMK (Quantum Mechanical Keyboard)',
    definition:
      'The most popular open-source keyboard firmware. Supports hundreds of features: layers, macros, RGB, encoders, OLED, etc. Configured in C and compiled via CLI or GitHub Actions.',
  },
  {
    term: 'RP2040',
    definition:
      'Raspberry Pi\'s dual-core ARM Cortex-M0+ microcontroller. Used in the Pi Pico and KB2040. Supported by QMK, Vial, and KMK. More powerful than AVR-based controllers.',
  },
  {
    term: 'RGB',
    definition:
      'Multi-colour LEDs (WS2812B or SK6812) that can be individually addressed via a single data line. QMK supports RGB effects, animations, and per-key colour mapping.',
  },
  {
    term: 'Split keyboard',
    definition:
      'A keyboard divided into two separate halves, each with roughly half the keys. The halves communicate via a TRRS cable or wirelessly (ZMK). Improves ergonomics by allowing a shoulder-width key position.',
  },
  {
    term: 'Stabiliser',
    definition:
      'A component that prevents larger keys (spacebar, shift, enter, backspace) from wobbling. Split keyboards typically use stabilisers only on the spacebar or thumb cluster keys.',
  },
  {
    term: 'Tenting',
    definition:
      'Angling the keyboard halves so the inner edges are higher than the outer edges, reducing forearm pronation and wrist strain. Achieved with tenting legs, stands, or 3D-printed cases.',
  },
  {
    term: 'TRRS',
    definition:
      'Tip-Ring-Ring-Sleeve — a 3.5mm audio-style jack with 4 contacts used to carry the I2C or UART signal between split keyboard halves. Also carries power. Not to be confused with TRS (3 contacts).',
  },
  {
    term: 'Vial',
    definition:
      'A fork of QMK that adds an on-the-fly GUI configurator (no recompile needed). Pairs with the Vial desktop app for real-time keymap editing over USB.',
  },
  {
    term: 'ZMK',
    definition:
      'Modern open-source firmware focused on wireless/BLE keyboards. Required for nice!nano builds. Configured via a GitHub Actions workflow that produces a .uf2 firmware file.',
  },
]

function GlossaryPage() {
  const [search, setSearch] = useState('')

  const filtered = GLOSSARY_TERMS.filter(
    ({ term, definition }) =>
      term.toLowerCase().includes(search.toLowerCase()) ||
      definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          GLOSSARY
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Key terms and concepts for split keyboard building.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border-2 text-sm font-mono"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            outline: 'none',
          }}
        />
      </div>

      {/* Terms */}
      <div className="space-y-1">
        {filtered.map(({ term, definition }) => (
          <div
            key={term}
            className="glass-panel-light p-4 border-2"
            style={{
              borderColor: 'var(--color-border-light)',
              background: 'var(--color-bg-secondary)',
            }}
          >
            <dt
              className="font-bold text-sm mb-1"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-teal)',
              }}
            >
              {term.toUpperCase()}
            </dt>
            <dd className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {definition}
            </dd>
          </div>
        ))}
        {filtered.length === 0 && (
          <p
            className="text-sm text-center py-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            No terms match your search.
          </p>
        )}
      </div>
    </main>
  )
}
