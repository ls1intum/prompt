import { type ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { useState } from 'react'
import { Appearance } from 'react-native-web'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ManagementConsole, ManagementRoot } from './instructor/ManagementConsole'
import { StudentApplicationOverview } from './instructor/ApplicationsOverview/ApplicationOverview'
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
import { RootPage } from './utilities/NavigationBar/RootPage'
import { ThesisApplicationForm } from './forms/ThesisApplicationForm'
import { IntroCourseConsole } from './instructor/IntroCourse/IntroCourseConsole'
import type Keycloak from 'keycloak-js'
import { ThesisApplicationsManagementConsole } from './instructor/ThesisApplicationsManagement/ThesisApplicationsManagementConsole'

export const App = (): JSX.Element => {
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>()
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
                path='/management/thesis-applications'
                element={<ThesisApplicationsManagementConsole />}
              />
              <Route
                path='/management/course-iterations'
                element={
                  <ManagementConsole
                    child={<CourseIterationConsole />}
                    permission={['ipraktikum-pm']}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/applications'
                element={
                  <ManagementConsole
                    child={<StudentApplicationOverview />}
                    permission={['ipraktikum-pm']}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/team-allocation'
                element={
                  <ManagementConsole
                    child={<TeamAllocationConsole />}
                    permission={['ipraktikum-pm']}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/intro-course'
                element={
                  <ManagementConsole
                    child={keycloakValue ? <IntroCourseConsole keycloak={keycloakValue} /> : <></>}
                    permission={['ipraktikum-pm', 'ipraktikum-tutor']}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/infrastructure'
                element={
                  <ManagementConsole
                    child={<InfrastructureManagement />}
                    permission={['ipraktikum-pm']}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management'
                element={
                  <ManagementConsole
                    child={<ManagementRoot />}
                    permission={['ipraktikum-pm', 'ipraktikum-tutor']}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
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
              <Route
                path='/applications/thesis'
                element={
                  <ApplicationSubmissionPage
                    child={<ThesisApplicationForm accessMode={ApplicationFormAccessMode.STUDENT} />}
                  />
                }
              />
              <Route path='/' element={<RootPage />} />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  )
}

export default App
