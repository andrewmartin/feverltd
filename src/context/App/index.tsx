import React, { useState } from 'react'
import { IMenuItem } from 'src/types'

interface IAppReducer {
  menuItems: IMenuItem[]
}

const AppStateContext = React.createContext<IAppReducer | undefined>(undefined)

const AppProvider: React.FC<{ menuItems: IMenuItem[] }> = (props) => {
  const { children, menuItems } = props
  const [menuState] = useState(menuItems)

  return (
    <AppStateContext.Provider
      value={{
        menuItems: menuState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppProvider')
  }
  return context
}

export { AppProvider, useAppState }
