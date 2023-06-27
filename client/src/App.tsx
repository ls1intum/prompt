import { type ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { useState } from 'react'
import { Appearance } from 'react-native-web'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ManagementConsole } from './instructor/ManagementConsole'
import { StudentApplicationOverview } from './instructor/StudentApplicationsView/StudentApplicationOverview'
import { ApplicationSubmissionPage } from './student/StudentApplicationSubmissionPage/ApplicationSubmissionPage'
import { StudentTeamPostKickoffSubmissionPage } from './student/StudentPostKickoffSubmissionPage/StudentPostKickoffSubmissionPage'
import { TeamAllocationConsole } from './instructor/TeamAllocation/TeamAllocationConsole'
import { InfrastructureManagement } from './instructor/InfrastructureManagement/InstrastructureManagement'
import { Notifications } from '@mantine/notifications'
import { CourseIterationConsole } from './instructor/CourseIterationManager/CourseIterationConsole'
import { DeveloperApplicationForm } from './forms/DeveloperApplicationForm'
import { ApplicationFormAccessMode } from './forms/DefaultApplicationForm'
import { CoachApplicationForm } from './forms/CoachApplicationForm'
import { TutorApplicationForm } from './forms/TutorApplicationForm'

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
                path='/management/course-iterations'
                element={<ManagementConsole child={<CourseIterationConsole />} />}
              />
              <Route
                path='/management/applications'
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
                element={<Navigate to='/management/applications' replace={true} />}
              />
              <Route
                path='/applications/developer'
                element={
                  <ApplicationSubmissionPage
                    child={
                      <DeveloperApplicationForm
                        accessMode={ApplicationFormAccessMode.STUDENT}
                        onSuccess={() => {}}
                      />
                    }
                  />
                }
              />
              <Route
                path='/applications/coach'
                element={
                  <ApplicationSubmissionPage
                    child={
                      <CoachApplicationForm
                        accessMode={ApplicationFormAccessMode.STUDENT}
                        onSuccess={() => {}}
                      />
                    }
                  />
                }
              />
              <Route
                path='/applications/tutor'
                element={
                  <ApplicationSubmissionPage
                    child={
                      <TutorApplicationForm
                        accessMode={ApplicationFormAccessMode.STUDENT}
                        onSuccess={() => {}}
                      />
                    }
                  />
                }
              />
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
