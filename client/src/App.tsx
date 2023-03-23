import { type ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { useState } from 'react'
import { Appearance } from 'react-native-web'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Dashboard } from './instructor/Dashboard'
import { StudentApplicationOverview } from './instructor/StudentApplicationsView/StudentApplicationOverview'
import { StudentApplicationSubmissionPage } from './student/StudentApplicationSubmissionPage'

const router = createBrowserRouter([
  {
    path: '/management/',
    // element: <Dashboard child={<Text>Welcome to the management dashboard!</Text>} />,
    children: [
      {
        path: 'student-applications',
        element: <Dashboard child={<StudentApplicationOverview />} />,
      },
    ],
  },
  {
    path: '/',
    element: <StudentApplicationSubmissionPage />,
  },
])

export const App = (): JSX.Element => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    Appearance.getColorScheme() ?? 'light',
  )
  const toggleColorScheme = (value?: ColorScheme): void => {
    setColorScheme(value ?? (colorScheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <RouterProvider router={router} />
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  )
}

export default App
