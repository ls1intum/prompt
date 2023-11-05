import { Stack, Text } from '@mantine/core'
import { IconBarrierBlock } from '@tabler/icons-react'

export const GradingManagementConsole = (): JSX.Element => {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Stack style={{ alignContent: 'center', alignItems: 'center' }}>
        <IconBarrierBlock size={300} color='yellow' />
        <Text c='dimmed' fw={500} fz='lg'>
          Construction Site
        </Text>
      </Stack>
    </div>
  )
}
