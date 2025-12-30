import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '../components/Header'
import { UserChoicesProvider } from '../contexts/UserChoicesContext'
import { CurrencyProvider } from '../contexts/CurrencyContext'
import { AppSettingsProvider } from '../contexts/AppSettingsContext'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AppSettingsProvider>
      <CurrencyProvider>
        <UserChoicesProvider>
          <Header />
          <Outlet />
        </UserChoicesProvider>
      </CurrencyProvider>
    </AppSettingsProvider>
  )
}
