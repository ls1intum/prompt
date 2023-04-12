import { useState } from 'react'
import { Group, Box, Collapse, ThemeIcon, UnstyledButton, Text, createStyles } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: '0.5vh 0.5vw',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,
    borderRadius: '0.8rem',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: '0.5vh 0.5vw',
    marginLeft: '4vw',
    fontSize: theme.fontSizes.sm,
    borderRadius: '0.8rem',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}))

interface LinksGroupProps {
  icon: React.FC<any>
  label: string
  navigateTo: string
  initiallyOpened?: boolean
  links?: Array<{ label: string; link: string }>
}

export const NavigationBarLinksGroup = ({
  icon: Icon,
  label,
  navigateTo,
  initiallyOpened,
  links,
}: LinksGroupProps): JSX.Element => {
  const { classes, theme } = useStyles()
  const navigate = useNavigate()
  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened ?? false)
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft
  const items = (hasLinks ? links : []).map((link) => (
    <Text<'a'>
      component='a'
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(event) => {
        event.preventDefault()
      }}
    >
      {link.label}
    </Text>
  ))

  return (
    <>
      <UnstyledButton
        onClick={() => {
          setOpened((o) => !o)
        }}
        className={classes.control}
      >
        <Group position='apart' spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '1vw' }}>
            <ThemeIcon variant='light' size={30}>
              <Icon size='1.1rem' />
            </ThemeIcon>
            <Text
              onClick={() => {
                navigate(navigateTo)
              }}
            >
              {label}
            </Text>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size='1rem'
              stroke={1.5}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}
