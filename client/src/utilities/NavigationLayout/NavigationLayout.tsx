import { useDisclosure } from '@mantine/hooks'
import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  Select,
  Switch,
  Text,
  rem,
  useMantineColorScheme,
} from '@mantine/core'
import { Permission } from '../../redux/authSlice/authSlice'
import {
  IconAppsFilled,
  IconDeviceDesktop,
  IconLogout,
  IconMail,
  IconMoonStars,
  IconNews,
  IconSchool,
  IconStairs,
  IconSun,
  IconUsers,
} from '@tabler/icons-react'
import type Keycloak from 'keycloak-js'
import { useLocation, useNavigate } from 'react-router-dom'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentState } from '../../redux/courseIterationSlice/courseIterationSlice'
import styles from './NavigationLayout.module.scss'
import classNames from 'classnames'
import useDeviceDetection from '../hooks/useDeviceDetection'

const navigationContents = [
  {
    label: 'Course Iteration Management',
    icon: IconAppsFilled,
    link: '/management/course-iterations',
    permission: [Permission.PM],
  },
  {
    label: 'Student Applications',
    icon: IconNews,
    link: '/management/applications',
    permission: [Permission.PM],
  },
  {
    label: 'Intro Course',
    icon: IconSchool,
    link: '/management/intro-course',
    permission: [Permission.PM, Permission.TUTOR],
  },
  {
    label: 'Team Allocation',
    icon: IconUsers,
    link: '/management/team-allocation',
    permission: [Permission.PM],
  },
  {
    label: 'Infrastructure',
    icon: IconDeviceDesktop,
    link: '/management/infrastructure',
    permission: [Permission.PM],
  },
  {
    label: 'Grading',
    icon: IconStairs,
    link: '/management/grading',
    permission: [Permission.PM],
  },
  {
    label: 'Mailing',
    icon: IconMail,
    link: '/management/mailing',
    permission: [Permission.PM],
  },
]

interface NavigationLayoutProps {
  keycloak: Keycloak
  children: React.ReactNode
}

export const NavigationLayout = ({ keycloak, children }: NavigationLayoutProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [navigationRoutes, setNavigationRoutes] = useState(navigationContents)
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const courseIterations = useAppSelector((state) => state.courseIterations.courseIterations)
  const location = useLocation()
  const [active, setActive] = useState(location.pathname)
  const isMobileDevice = useDeviceDetection() === 'mobile'

  useEffect(() => {
    setActive(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    setNavigationRoutes((current) =>
      current.filter((c) => c.permission.some((p) => keycloak.hasResourceRole(p, 'prompt-server'))),
    )
  }, [keycloak])

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md' justify='space-between'>
          <Group h='100%'>
            <Group h='100%'>
              <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
              <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom='sm' size='sm' />
            </Group>
            <Switch
              checked={colorScheme === 'dark'}
              onChange={() => {
                toggleColorScheme()
              }}
              size='md'
              onLabel={<IconSun color='white' size={20} stroke={1.5} />}
              offLabel={<IconMoonStars color='gray' size={20} stroke={1.5} />}
            />
          </Group>
          <Menu>
            <Menu.Target>
              <Group className={styles.avatar}>
                <Avatar color='blue' radius='xl'>{`${auth.firstName.at(0) ?? ''}${
                  auth.lastName.at(0) ?? ''
                }`}</Avatar>
                {!isMobileDevice && (
                  <Text c='dimmed' fw={500}>
                    {auth.firstName} {auth.lastName}
                  </Text>
                )}
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color='red'
                leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => {
                  void keycloak.logout({ redirectUri: window.location.origin + '/management' })
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md' className={styles.navbar}>
        <AppShell.Section>
          <Select
            searchable
            label='Course Iteration'
            data={courseIterations.map((courseIteration) => {
              return {
                value: courseIteration.id.toString(),
                label: courseIteration.semesterName,
              }
            })}
            value={selectedCourseIteration?.id.toString()}
            onChange={(changedCourseIterationId) => {
              const changedCourseIteration = courseIterations.find(
                (as) => as.id.toString() === changedCourseIterationId,
              )
              if (changedCourseIteration) {
                void dispatch(setCurrentState(changedCourseIteration))
              }
            }}
          />
        </AppShell.Section>
        <AppShell.Section>
          {navigationRoutes.map((item) => (
            <a
              className={classNames(styles.navEntry, {
                [styles.navEntryActive]: item.link === active,
              })}
              href={item.link}
              key={item.label}
              onClick={(event) => {
                event.preventDefault()
                if (isMobileDevice) {
                  toggleMobile()
                }
                navigate(item.link)
              }}
            >
              <item.icon stroke={1.5} />
              <span>{item.label}</span>
            </a>
          ))}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}