import { Box } from '@mantine/core'

interface RowAlignmentProps {
  children: React.ReactNode
}

export const RowAlignment = ({ children }: RowAlignmentProps): JSX.Element => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2vw',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {children}
    </Box>
  )
}
