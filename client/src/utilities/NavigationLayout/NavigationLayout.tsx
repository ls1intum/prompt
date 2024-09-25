import { useDisclosure } from '@mantine/hooks'
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  MenuTarget,
  Select,
  Switch,
  Text,
  rem,
  useMantineColorScheme,
} from '@mantine/core'
import {
  IconAppsFilled,
  IconDeviceDesktop,
  IconLogout,
  IconMail,
  IconMoonStars,
  IconNews,
  IconSchool,
  IconSelector,
  IconStairs,
  IconSun,
  IconUsers,
} from '@tabler/icons-react'
import type Keycloak from 'keycloak-js'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import * as styles from './NavigationLayout.module.scss'
import classNames from 'classnames'
import useDeviceDetection from '../hooks/useDeviceDetection'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'
import { useAuthenticationStore } from '../../state/zustand/useAuthenticationStore'
import { Permission } from '../../interface/authentication'
import { useQueryClient } from '@tanstack/react-query'
import { GravatarAvatar } from '../Avatar/GravatarAvatar'
import { AppearanceSelector } from './components/AppearanceSelector'

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
    permission: [Permission.PM, Permission.COACH, Permission.PL],
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
  const queryClient = useQueryClient()
  const { user } = useAuthenticationStore()
  const navigate = useNavigate()
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [navigationRoutes, setNavigationRoutes] = useState(navigationContents)
  const { selectedCourseIteration, courseIterations, setSelectedCourseIteration } =
    useCourseIterationStore()
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
      layout='alt'
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened }, // on desktop it is opened by default
      }}
      padding='md'
    >
      {isMobileDevice && (
        <AppShell.Header>
          <Group h='100%' px='md' justify='space-between'>
            <Group h='100%'>
              <Group h='100%'>
                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom='sm' size='sm' />
              </Group>
            </Group>
            <Menu>
              <Menu.Target>
                {user && (
                  <Group className={styles.avatar}>
                    <Avatar color='blue' radius='xl'>{`${user.firstName.at(0) ?? ''}${
                      user.lastName.at(0) ?? ''
                    }`}</Avatar>
                    {!isMobileDevice && (
                      <Text c='dimmed' fw={500}>
                        {user.firstName} {user.lastName}
                      </Text>
                    )}
                  </Group>
                )}
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
      )}
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
                const oldCourseIterationSemesterName = selectedCourseIteration?.semesterName
                setSelectedCourseIteration(changedCourseIteration)
                queryClient.invalidateQueries({ queryKey: [oldCourseIterationSemesterName] })
              }
            }}
          />
        </AppShell.Section>
        <AppShell.Section>
          {navigationRoutes.map((item) => (
            <Link
              className={classNames(styles.navEntry, {
                [styles.navEntryActive]: item.link === active,
              })}
              to={item.link}
              key={item.label}
              reloadDocument
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
            </Link>
          ))}
        </AppShell.Section>

        <AppShell.Section className={styles.navbarBottom}>
          <Menu width='target' closeOnItemClick={false}>
            <MenuTarget>
              <Button
                justify='space-between'
                fullWidth
                rightSection={<IconSelector />}
                leftSection={
                  <>
                    <GravatarAvatar
                      firstName={user?.firstName}
                      lastName={user?.lastName}
                      email={user?.email ?? ''}
                      imgSize={150} // Adjust avatar size
                      avatarSize='lg'
                    />
                    {user !== undefined && (
                      <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
                        <Text fw={700}>
                          {user.firstName} {user.lastName}
                        </Text>
                        <Text c='dimmed' size='xs'>
                          {user.email}
                        </Text>
                      </div>
                    )}
                  </>
                }
                variant='default'
                size='xl'
                mt='md'
                style={{
                  padding: '6px 6px',
                  borderRadius: '8px',
                  height: '4rem',
                  width: '100%',
                }}
              />
            </MenuTarget>

            <Menu.Dropdown>
              <Menu.Label>Appearance</Menu.Label>
              <AppearanceSelector />

              <Menu.Divider />
              <Menu.Item
                variant='outline'
                color='red'
                leftSection={<IconLogout size={18} />}
                onClick={() => {
                  void keycloak.logout({ redirectUri: window.location.origin + '/management' })
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
