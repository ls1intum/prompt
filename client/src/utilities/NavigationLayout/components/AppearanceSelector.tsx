import { MantineColorScheme, Radio, Stack, useMantineColorScheme } from '@mantine/core'
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'
import * as styles from './AppearanceSelector.module.scss'

interface AppearanceRadioCardProps {
  value: 'light' | 'dark' | 'auto'
  icon: JSX.Element
  label: string
}

const AppearanceRadioCard = ({ value, icon, label }: AppearanceRadioCardProps) => (
  <Radio.Card radius='md' style={{ border: 'none', padding: '8px' }} className={styles.root} value={value}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        {label}
      </div>
      <Radio.Indicator />
    </div>
  </Radio.Card>
)

export const AppearanceSelector = (): JSX.Element => {
  const { colorScheme, setColorScheme } = useMantineColorScheme()

  return (
    <Radio.Group
      style={{ width: '100%' }}
      value={colorScheme}
      onChange={(e) => {
        setColorScheme(e as MantineColorScheme)
      }}
    >
      <Stack gap='xs' style={{ padding: '8px' }}>
        <AppearanceRadioCard
          value='light'
          icon={<IconSun size={18} style={{ marginRight: '8px' }} />}
          label='Light Mode'
        />
        <AppearanceRadioCard
          value='dark'
          icon={<IconMoon size={18} style={{ marginRight: '8px' }} />}
          label='Dark Mode'
        />
        <AppearanceRadioCard
          value='auto'
          icon={<IconDeviceDesktop size={18} style={{ marginRight: '8px' }} />}
          label='System Default'
        />
      </Stack>
    </Radio.Group>
  )
}
