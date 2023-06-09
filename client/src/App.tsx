import { type ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { useState } from 'react'
import { Appearance } from 'react-native-web'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ManagementConsole } from './instructor/ManagementConsole'
import { StudentApplicationOverview } from './instructor/StudentApplicationsView/StudentApplicationOverview'
import { StudentApplicationSubmissionPage } from './student/StudentApplicationSubmissionPage/StudentApplicationSubmissionPage'
import { StudentTeamPostKickoffSubmissionPage } from './student/StudentPostKickoffSubmissionPage/StudentPostKickoffSubmissionPage'
import { TeamAllocationConsole } from './instructor/TeamAllocation/TeamAllocationConsole'
import { ApplicationSemesterManager } from './instructor/ApplicationSemesterManager/ApplicationSemesterManager'
import { InfrastructureManagement } from './instructor/InfrastructureManagement/InstrastructureManagement'
import { Notifications } from '@mantine/notifications'

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
          <Notifications limit={5} />
          <BrowserRouter>
            <Routes>
              <Route
                path='/management/application-semesters'
                element={<ManagementConsole child={<ApplicationSemesterManager />} />}
              />
              <Route
                path='/management/student-applications'
                element={<ManagementConsole child={<StudentApplicationOverview />} />}
              />
              <Route
                path='/management/team-allocation'
                element={<ManagementConsole child={<TeamAllocationConsole />} />}
              />
              <Route
                path='/management/infrastructure'
                element={<ManagementConsole child={<InfrastructureManagement />} />}
              />
              <Route
                path='/management'
                element={<Navigate to='/management/student-applications' replace={true} />}
              />
              <Route path='/' element={<StudentApplicationSubmissionPage />} />
              <Route
                path='/kick-off/:studentPublicId'
                element={<StudentTeamPostKickoffSubmissionPage />}
              />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  )
}

export default App
