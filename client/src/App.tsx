import { type ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Appearance } from 'react-native-web'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Dashboard } from './instructor/Dashboard'
import { SignIn } from './instructor/SignIn/SignIn'
import { SignUp } from './instructor/SignUp/SignUp'
import { StudentApplicationOverview } from './instructor/StudentApplicationsView/StudentApplicationOverview'
import { refreshToken } from './redux/authenticationSlice/thunks/refreshToken'
import { type AppDispatch } from './redux/store'
import { StudentApplicationSubmissionPage } from './student/StudentApplicationSubmissionPage'
import { DashboardWelcome } from './utilities/NavigationBar/NavigationBar'
import { StudentTeamProjectPreferencePage } from './student/StudentProjectTeamPreferencesPage/StudentTeamProjectPreferencePage'
import { TeamAllocationConsole } from './instructor/TeamAllocation/TeamAllocationConsole'
import { ApplicationSemesterManager } from './instructor/ApplicationSemesterManager/ApplicationSemesterManager'
import { InfrastructureManagement } from './instructor/InfrastructureManagement/InstrastructureManagement'
import { Notifications } from '@mantine/notifications'

export const App = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    Appearance.getColorScheme() ?? 'light',
  )
  const toggleColorScheme = (value?: ColorScheme): void => {
    setColorScheme(value ?? (colorScheme === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    const refreshTokenFromLocalStorage = localStorage.getItem('refreshToken')
    if (refreshTokenFromLocalStorage) {
      void dispatch(refreshToken())
    }
  }, [])

  useEffect(() => {
    console.log(process.env.REACT_APP_SERVER_HOST)
  }, [process.env.REACT_APP_SERVER_HOST])

  return (
    <div>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <Notifications limit={5} />
          <BrowserRouter>
            <Routes>
              <Route path='/management/signup' element={<SignUp />} />
              <Route path='/management/signin' element={<SignIn />} />
              <Route
                path='/management/application-semesters'
                element={<Dashboard child={<ApplicationSemesterManager />} />}
              />
              <Route
                path='/management/student-applications'
                element={<Dashboard child={<StudentApplicationOverview />} />}
              />
              <Route
                path='/management/team-allocation'
                element={<Dashboard child={<TeamAllocationConsole />} />}
              />
              <Route
                path='/management/infrastructure'
                element={<Dashboard child={<InfrastructureManagement />} />}
              />
              <Route path='/management' element={<DashboardWelcome />} />
              <Route path='/' element={<StudentApplicationSubmissionPage />} />
              <Route
                path='/preferences/:studentId'
                element={<StudentTeamProjectPreferencePage />}
              />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  )
}

export default App
