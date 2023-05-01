import {
  Navbar,
  Card,
  Group,
  ScrollArea,
  createStyles,
  Switch,
  useMantineColorScheme,
  useMantineTheme,
  Button,
  Center,
  Select,
  ActionIcon,
  SimpleGrid,
  Stack,
  Title,
} from '@mantine/core'
import {
  IconSun,
  IconMoonStars,
  IconNews,
  IconUsers,
  IconDeviceDesktop,
  IconStairs,
  IconCode,
  IconAppsFilled,
  IconLogout,
} from '@tabler/icons-react'
import { NavigationBarLinksGroup } from './NavigationBarLinksGroup'
import { useNavigate } from 'react-router-dom'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { useDispatch } from 'react-redux'
import { setCurrentState } from '../../redux/applicationSemesterSlice/applicationSemesterSlice'
import { WorkspaceSelectionDialog } from '../../instructor/ApplicationSemesterManager/WorkspaceSelectionDialog'

const navigationContents = [
  {
    label: 'Application Semester Management',
    icon: IconAppsFilled,
    navigateTo: '/management/application-semesters',
  },
  {
    label: 'Student Applications',
    icon: IconNews,
    navigateTo: '/management/student-applications',
  },
  {
    label: 'Team Allocation',
    icon: IconUsers,
    navigateTo: '/management/team-allocation',
  },
  {
    label: 'Infrastructure',
    icon: IconDeviceDesktop,
    navigateTo: '/management/infrastructure',
  },
  { label: 'Grading', icon: IconStairs, navigateTo: '/student-applications' },
  { label: 'Artifacts', icon: IconCode, navigateTo: '/student-applications' },
]

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    height: '100vh',
    width: '20vw',
  },

  links: {
    marginLeft: '1vw',
  },

  linksInner: {
    paddingVertical: '3vh',
  },
}))

export const DashboardWelcome = (): JSX.Element => {
  const selectedApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.currentState,
  )
  const navigate = useNavigate()

  return (
    <>
      {selectedApplicationSemester ? (
        <>
          <Center style={{ paddingTop: '5vh' }}>
            <Title>Welcome to PROMPT!</Title>
          </Center>
          <SimpleGrid cols={3} style={{ padding: '20vh 10vw' }}>
            {navigationContents.map((item) => {
              return (
                <Card
                  key={item.label}
                  shadow='md'
                  padding='lg'
                  radius='md'
                  withBorder
                  onClick={() => {
                    navigate(item.navigateTo)
                  }}
                >
                  <Stack style={{ display: 'flex', alignItems: 'center' }}>
                    <ActionIcon size={100}>{<item.icon size={100} />}</ActionIcon>
                    <Title order={4}>{item.label}</Title>
                  </Stack>
                </Card>
              )
            })}
          </SimpleGrid>
        </>
      ) : (
        <WorkspaceSelectionDialog />
      )}
    </>
  )
}

export const NavigationBar = (): JSX.Element => {
  const { classes } = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const links = navigationContents.map((item) => (
    <NavigationBarLinksGroup {...item} key={item.label} />
  ))
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const applicationSemesters = useAppSelector(
    (state) => state.applicationSemester.applicationSemesters,
  )
  const selectedApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.currentState,
  )

  return (
    <>
      <Navbar
        p='md'
        className={classes.navbar}
        width={{
          sm: 300,
          lg: 300,
          base: 100,
        }}
      >
        <Navbar.Section>
          <Group position='center' my={20}>
            <Switch
              checked={colorScheme === 'dark'}
              onChange={() => {
                toggleColorScheme()
              }}
              size='md'
              onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
              offLabel={<IconMoonStars color={theme.colors.gray[6]} size={20} stroke={1.5} />}
            />
          </Group>
        </Navbar.Section>
        {selectedApplicationSemester && (
          <Navbar.Section style={{ margin: '5vh 0' }}>
            <Select
              searchable
              label='Application Semester'
              data={applicationSemesters.map((applicationSemester) => {
                return {
                  value: applicationSemester.id.toString(),
                  label: applicationSemester.semesterName,
                }
              })}
              value={selectedApplicationSemester.id.toString()}
              onChange={(changedApplicationSemesterId: string) => {
                const changedApplicationSemester = applicationSemesters.find(
                  (as) => as.id.toString() === changedApplicationSemesterId,
                )
                if (changedApplicationSemester) {
                  void dispatch(setCurrentState(changedApplicationSemester))
                }
              }}
            />
          </Navbar.Section>
        )}
        <Navbar.Section grow className={classes.links} component={ScrollArea}>
          <div className={classes.linksInner}>{links}</div>
        </Navbar.Section>
        <Navbar.Section>
          <Center>
            <Button
              leftIcon={<IconLogout />}
              onClick={() => {
                localStorage.removeItem('userId')
                localStorage.removeItem('jwt_token')
                navigate('/management/signin')
              }}
            >
              Logout
            </Button>
          </Center>
        </Navbar.Section>
      </Navbar>
    </>
  )
}
