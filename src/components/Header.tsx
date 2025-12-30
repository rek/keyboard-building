import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  Home,
  Menu,
  Network,
  SquareFunction,
  X,
  DollarSign,
  Settings,
  GraduationCap,
  Palette,
} from 'lucide-react'
import { useCurrency, CURRENCY_CONFIG, Currency } from '../contexts/CurrencyContext'
import { useAppSettings, Theme } from '../contexts/AppSettingsContext'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { currency, setCurrency } = useCurrency()
  const { settings, updateSetting, setLearningMode, setTheme } = useAppSettings()

  return (
    <>
      <header
        className="p-4 flex items-center relative z-20"
        style={{
          background: 'var(--color-bg-secondary)',
          borderBottom: '3px solid var(--color-border)',
          color: 'var(--color-text-primary)'
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 transition-all hover:bg-black hover:text-white"
          style={{
            border: '2px solid var(--color-border)',
            background: 'transparent'
          }}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1
          className="ml-4 text-lg md:text-xl font-bold tracking-wide"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Link
            to="/"
            className="transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-orange)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
          >
            [SPLIT_KB_GUIDE]
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'var(--color-bg-secondary)',
          borderRight: '3px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          boxShadow: '8px 0 0 0 var(--color-border)'
        }}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{
            borderBottom: '3px solid var(--color-border)',
            fontFamily: 'var(--font-display)'
          }}
        >
          <h2 className="text-xl font-bold tracking-wide">NAVIGATION</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 transition-all hover:bg-black hover:text-white"
            style={{
              border: '2px solid var(--color-border)',
              background: 'transparent'
            }}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto" style={{ fontFamily: 'var(--font-display)' }}>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 transition-all mb-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 transition-all mb-2 border-2',
              style: {
                borderColor: 'var(--color-accent-orange)',
                background: 'var(--color-accent-orange)',
                color: 'white'
              }
            }}
          >
            <Home size={20} />
            <span className="font-semibold tracking-wide text-sm">HOME</span>
          </Link>

          <Link
            to="/builder"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 transition-all mb-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 transition-all mb-2 border-2',
              style: {
                borderColor: 'var(--color-accent-orange)',
                background: 'var(--color-accent-orange)',
                color: 'white'
              }
            }}
          >
            <SquareFunction size={20} />
            <span className="font-semibold tracking-wide text-sm">BUILDER</span>
          </Link>

          <Link
            to="/components"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 transition-all mb-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 transition-all mb-2 border-2',
              style: {
                borderColor: 'var(--color-accent-orange)',
                background: 'var(--color-accent-orange)',
                color: 'white'
              }
            }}
          >
            <Network size={20} />
            <span className="font-semibold tracking-wide text-sm">COMPONENTS</span>
          </Link>

          {/* App Settings */}
          <div className="mt-4 mb-2 pt-4" style={{ borderTop: '2px solid var(--color-border-light)' }}>
            <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>
              <Settings size={14} />
              <span>SETTINGS</span>
            </div>

            {/* Learning Mode Toggle */}
            <div className="px-3 py-2">
              <button
                onClick={() => setLearningMode(!settings.learningMode)}
                className="w-full flex items-center justify-between px-3 py-2 transition-all border-2"
                style={{
                  borderColor: settings.learningMode ? 'var(--color-accent-teal)' : 'var(--color-border-light)',
                  background: settings.learningMode ? 'var(--color-accent-teal)' : 'transparent',
                  color: settings.learningMode ? 'white' : 'var(--color-text-primary)'
                }}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  <span className="text-xs font-bold tracking-wide">LEARN MODE</span>
                </div>
                <div
                  className="w-10 h-5 border-2 transition-all"
                  style={{
                    borderColor: settings.learningMode ? 'white' : 'var(--color-border)',
                    background: 'transparent'
                  }}
                >
                  <div
                    className="w-4 h-3.5 transition-transform"
                    style={{
                      background: settings.learningMode ? 'white' : 'var(--color-border)',
                      transform: settings.learningMode ? 'translateX(18px)' : 'translateX(0)'
                    }}
                  />
                </div>
              </button>
              <p className="text-xs mt-1 px-1" style={{ color: 'var(--color-text-secondary)' }}>
                Hides pricing and vendor links
              </p>
            </div>

            {/* Individual Toggles (when not in learning mode) */}
            {!settings.learningMode && (
              <div className="px-3 py-2 space-y-2">
                <label className="flex items-center justify-between cursor-pointer p-2 transition-all hover:bg-gray-100">
                  <span className="text-xs font-semibold tracking-wide">SHOW PRICING</span>
                  <input
                    type="checkbox"
                    checked={settings.showPricing}
                    onChange={(e) => updateSetting('showPricing', e.target.checked)}
                    className="w-4 h-4"
                    style={{ accentColor: 'var(--color-accent-orange)' }}
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer p-2 transition-all hover:bg-gray-100">
                  <span className="text-xs font-semibold tracking-wide">SHOW VENDORS</span>
                  <input
                    type="checkbox"
                    checked={settings.showVendors}
                    onChange={(e) => updateSetting('showVendors', e.target.checked)}
                    className="w-4 h-4"
                    style={{ accentColor: 'var(--color-accent-orange)' }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Theme Settings */}
          <div className="mb-2 pt-4" style={{ borderTop: '2px solid var(--color-border-light)' }}>
            <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>
              <Palette size={14} />
              <span>THEME</span>
            </div>
            <div className="grid grid-cols-3 gap-2 px-3 py-2">
              {(['light', 'dark', 'blueprint'] as Theme[]).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className="px-2 py-3 text-xs font-bold transition-all border-2 flex flex-col items-center gap-1"
                  style={{
                    borderColor: settings.theme === themeOption ? 'var(--color-accent-orange)' : 'var(--color-border-light)',
                    background: settings.theme === themeOption ? 'var(--color-accent-orange)' : 'transparent',
                    color: settings.theme === themeOption ? 'white' : 'var(--color-text-primary)'
                  }}
                >
                  <div className="text-[10px] tracking-widest uppercase">
                    {themeOption === 'light' ? 'VINTAGE' : themeOption === 'dark' ? 'TERMINAL' : 'BLUEPRINT'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Currency Settings */}
          {settings.showPricing && (
            <div className="mb-2 pt-4" style={{ borderTop: '2px solid var(--color-border-light)' }}>
              <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>
                <DollarSign size={14} />
                <span>CURRENCY</span>
              </div>
              <div className="flex gap-2 px-3 py-2">
                {(['USD', 'NPR'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className="flex-1 px-3 py-2 text-xs font-bold transition-all border-2"
                    style={{
                      borderColor: currency === curr ? 'var(--color-accent-teal)' : 'var(--color-border-light)',
                      background: currency === curr ? 'var(--color-accent-teal)' : 'transparent',
                      color: currency === curr ? 'white' : 'var(--color-text-primary)'
                    }}
                  >
                    <div className="tracking-wide">{curr}</div>
                    <div className="text-xs opacity-75">
                      {CURRENCY_CONFIG[curr].symbol}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </nav>
      </aside>
    </>
  )
}
