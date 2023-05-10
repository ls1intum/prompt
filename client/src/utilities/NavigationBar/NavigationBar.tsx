import {
  Navbar,
  Card,
  Group,
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
  rem,
  getStylesRef,
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
import { useLocation, useNavigate } from 'react-router-dom'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { useDispatch } from 'react-redux'
import { setCurrentState } from '../../redux/applicationSemesterSlice/applicationSemesterSlice'
import { WorkspaceSelectionDialog } from '../../instructor/ApplicationSemesterManager/WorkspaceSelectionDialog'
import { useEffect, useState } from 'react'

const navigationContents = [
  {
    label: 'Application Semester Management',
    icon: IconAppsFilled,
    link: '/management/application-semesters',
  },
  { label: 'Student Applications', icon: IconNews, link: '/management/student-applications' },
  { label: 'Team Allocation', icon: IconUsers, link: '/management/team-allocation' },
  { label: 'Infrastructure', icon: IconDeviceDesktop, link: '/management/infrastructure' },
  { label: 'Grading', icon: IconStairs, link: '/student-applications' },
  { label: 'Artifacts', icon: IconCode, link: '/student-applications' },
]

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
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
                    navigate(item.link)
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
  const { classes, cx } = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const applicationSemesters = useAppSelector(
    (state) => state.applicationSemester.applicationSemesters,
  )
  const selectedApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.currentState,
  )
  const location = useLocation()
  const [active, setActive] = useState(location.pathname)

  useEffect(() => {
    setActive(location.pathname)
  }, [location.pathname])

  const linksContent = navigationContents.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.link === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault()
        setActive(item.link)
        navigate(item.link)
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ))

  return (
    <>
      <Navbar height={'100vh'} width={{ sm: 300 }} p='md'>
        <Navbar.Section grow>
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
          {linksContent}
        </Navbar.Section>
        <Navbar.Section className={classes.footer}>
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
