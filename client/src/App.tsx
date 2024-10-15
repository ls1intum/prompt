import { MantineProvider } from '@mantine/core'
import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ManagementConsole, ManagementRoot } from './management/ManagementConsole'
import { StudentApplicationOverview } from './management/ApplicationsOverview/ApplicationOverview'
import { ApplicationSubmissionPage } from './student/StudentApplicationSubmissionPage/ApplicationSubmissionPage'
import { PostKickoffSubmission } from './student/PostKickoffSubmission/PostKickoffSubmission'
import { TeamAllocationConsole } from './management/TeamAllocation/TeamAllocationConsole'
import { InfrastructureManagement } from './management/InfrastructureManagement/InstrastructureManagement'
import { Notifications } from '@mantine/notifications'
import { CourseIterationConsole } from './management/CourseIterationManager/CourseIterationConsole'
import { DeveloperApplicationForm } from './forms/DeveloperApplicationForm'
import { ApplicationFormAccessMode } from './forms/DefaultApplicationForm'
import { CoachApplicationForm } from './forms/CoachApplicationForm'
import { TutorApplicationForm } from './forms/TutorApplicationForm'
import { LandingPage } from './utilities/LandingPage/LandingPage'
import { ThesisApplicationForm } from './forms/ThesisApplicationForm'
import { IntroCourseConsole } from './management/IntroCourse/IntroCourseConsole'
import type Keycloak from 'keycloak-js'
import { ThesisApplicationsManagementConsole } from './management/ThesisApplicationsManagement/ThesisApplicationsManagementConsole'
import { DevelopmentProfileSubmission } from './student/DevelopmentProfileSubmission/DevelopmentProfileSubmission'
import { MailingManagementConsole } from './management/MailingManagement/MailingManagementConsole'
import { GradingManagementConsole } from './management/Grading/GradingManagementConsole'
import { ContextMenuProvider } from 'mantine-contextmenu'
import '../public/prompt_logo.svg'
import { Fallback } from './utilities/Fallback/Fallback'

import '@mantine/core/styles.layer.css'
import '@mantine/dates/styles.layer.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import '@mantine/dropzone/styles.css'
import 'mantine-contextmenu/styles.layer.css'
import 'mantine-datatable/styles.layer.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Permission } from './interface/authentication'
import { IntroCourseAbsenceSelfReport } from './student/IntroCourseAbsenceSelfReport/IntroCourseAbsenceSelfReport'
import { StudentConsole } from './student/StudentConsole/StudentConsole'

const SampleComponent = React.lazy(() => import('sample_component/App'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const App = (): JSX.Element => {
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>()

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider defaultColorScheme='auto'>
        <ContextMenuProvider>
          <Notifications limit={5} />
          <BrowserRouter>
            <Routes>
              <Route
                path='/mod-fed'
                element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <SampleComponent />
                  </React.Suspense>
                }
              />
              <Route
                path='/management/course-iterations'
                element={
                  <ManagementConsole
                    child={<CourseIterationConsole />}
                    permission={[Permission.PM]}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/applications'
                element={
                  <ManagementConsole
                    child={<StudentApplicationOverview />}
                    permission={[Permission.PM]}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/team-allocation'
                element={
                  <ManagementConsole
                    child={<TeamAllocationConsole />}
                    permission={[Permission.PM]}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/intro-course'
                element={
                  <ManagementConsole
                    child={keycloakValue ? <IntroCourseConsole keycloak={keycloakValue} /> : <></>}
                    permission={[Permission.PM, Permission.TUTOR]}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/infrastructure'
                element={
                  <ManagementConsole
                    child={<InfrastructureManagement />}
                    permission={[Permission.PM]}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/grading'
                element={
                  <ManagementConsole
                    child={<GradingManagementConsole />}
                    permission={[Permission.PM, Permission.COACH, Permission.PL]}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management/mailing'
                element={
                  <ManagementConsole
                    child={<MailingManagementConsole />}
                    permission={[Permission.PM, Permission.CHAIR_MEMBER]}
                    onKeycloakValueChange={setKeycloakValue}
                  />
                }
              />
              <Route
                path='/management'
                element={
                  <ManagementConsole
                    child={<ManagementRoot />}
                    permission={[Permission.PM, Permission.TUTOR, Permission.COACH, Permission.PL]}
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
                path='/kick-off/:semesterName'
                element={
                  <StudentConsole
                    onKeycloakValueChange={setKeycloakValue}
                    child={<PostKickoffSubmission />}
                  />
                }
              />
              <Route
                path='/intro-course/development-profile'
                element={
                  <StudentConsole
                    onKeycloakValueChange={setKeycloakValue}
                    child={<DevelopmentProfileSubmission />}
                  />
                }
              />
              <Route
                path='/intro-course/:semesterName/absences'
                element={
                  <StudentConsole
                    onKeycloakValueChange={setKeycloakValue}
                    child={<IntroCourseAbsenceSelfReport />}
                  />
                }
              />
              <Route
                path='/applications/thesis'
                element={
                  <ApplicationSubmissionPage
                    child={<ThesisApplicationForm accessMode={ApplicationFormAccessMode.STUDENT} />}
                  />
                }
              />
              <Route path='/' element={<LandingPage />} />
              <Route path='*' element={<Fallback />} />
            </Routes>
          </BrowserRouter>
        </ContextMenuProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default App
