import React from 'react'
import {
  Navbar,
  Group,
  ScrollArea,
  createStyles,
  Switch,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconAdjustments,
  IconLock,
  IconSun,
  IconMoonStars,
} from '@tabler/icons-react'
import { LinksGroup } from './NavBarLinksGroup'

const mockdata = [
  {
    label: 'Student Applications',
    icon: IconGauge,
    navigateTo: '/management/student-applications',
  },
  {
    label: 'Team Allocation',
    icon: IconNotes,
    initiallyOpened: true,
    navigateTo: '/management/student-applications',
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Infrastructure',
    icon: IconCalendarStats,
    navigateTo: '/student-applications',
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Grading', icon: IconPresentationAnalytics, navigateTo: '/student-applications' },
  { label: 'Artifacts', icon: IconAdjustments, navigateTo: '/student-applications' },
  {
    label: 'Security',
    navigateTo: '/student-applications',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
]

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    height: '100vh',
    width: '25vw',
  },

  links: {
    marginLeft: '2vh 1vw',
  },

  linksInner: {
    paddingTop: '3vh',
    paddingBottom: '3vh',
  },
}))

export const NavigationBar = (): JSX.Element => {
  const { classes } = useStyles()
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  return (
    <Navbar p='md' className={classes.navbar} width={{ base: 300 }}>
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
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>
    </Navbar>
  )
}
