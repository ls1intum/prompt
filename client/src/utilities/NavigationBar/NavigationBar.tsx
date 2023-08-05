import {
  Navbar,
  Card,
  Group,
  createStyles,
  Switch,
  useMantineColorScheme,
  useMantineTheme,
  Center,
  Select,
  ActionIcon,
  SimpleGrid,
  Stack,
  Text,
  Title,
  rem,
  getStylesRef,
  Avatar,
  Button,
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
  IconSchool,
} from '@tabler/icons-react'
import type Keycloak from 'keycloak-js'
import { useLocation, useNavigate } from 'react-router-dom'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { useDispatch } from 'react-redux'
import { setCurrentState } from '../../redux/courseIterationSlice/courseIterationSlice'
import { WorkspaceSelectionDialog } from '../../instructor/CourseIterationManager/components/CourseIterationManager/WorkspaceSelectionDialog'
import { useEffect, useState } from 'react'

const navigationContents = [
  {
    label: 'Course Iteration Management',
    icon: IconAppsFilled,
    link: '/management/course-iterations',
  },
  { label: 'Student Applications', icon: IconNews, link: '/management/applications' },
  { label: 'Team Allocation', icon: IconUsers, link: '/management/team-allocation' },
  { label: 'Intro Course', icon: IconSchool, link: '/management/intro-course' },
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
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const navigate = useNavigate()

  return (
    <>
      {selectedCourseIteration ? (
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

export const NavigationBar = ({ keycloak }: { keycloak: Keycloak }): JSX.Element => {
  const { classes, cx } = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const courseIterations = useAppSelector((state) => state.courseIterations.courseIterations)
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const auth = useAppSelector((state) => state.auth)
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
          {selectedCourseIteration && (
            <Navbar.Section style={{ margin: '5vh 0' }}>
              <Select
                searchable
                label='Course Iteration'
                data={courseIterations.map((courseIteration) => {
                  return {
                    value: courseIteration.id.toString(),
                    label: courseIteration.semesterName,
                  }
                })}
                value={selectedCourseIteration.id.toString()}
                onChange={(changedCourseIterationId: string) => {
                  const changedCourseIteration = courseIterations.find(
                    (as) => as.id.toString() === changedCourseIterationId,
                  )
                  if (changedCourseIteration) {
                    void dispatch(setCurrentState(changedCourseIteration))
                  }
                }}
              />
            </Navbar.Section>
          )}
          {linksContent}
        </Navbar.Section>
        <Navbar.Section className={classes.footer}>
          <Center>
            <Stack>
              <Group>
                <Avatar color='blue' radius='xl'>{`${auth.firstName.at(0) ?? ''}${
                  auth.lastName.at(0) ?? ''
                }`}</Avatar>
                <Text c='dimmed' fw={500}>
                  {auth.firstName} {auth.lastName}
                </Text>
              </Group>
              <Button
                leftIcon={<IconLogout />}
                onClick={() => {
                  void keycloak.logout({ redirectUri: window.location.origin + '/management' })
                }}
              >
                Logout
              </Button>
            </Stack>
          </Center>
        </Navbar.Section>
      </Navbar>
    </>
  )
}
