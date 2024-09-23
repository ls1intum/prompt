import { Chip, Group, rem } from '@mantine/core'
import { Filters } from '../ApplicationOverview'
import { IconX } from '@tabler/icons-react'
import { Gender } from '../../../interface/application'

interface FilterChipsProps {
  filters: Filters
  setFilters: (updateFn: (prevFilters: Filters) => Filters) => void
}

export const FilterChips = ({ filters, setFilters }: FilterChipsProps): JSX.Element => {
  return (
    <Chip.Group multiple>
      <Group justify='left'>
        {filters.gender.map((gender) => (
          <Chip
            key={gender}
            icon={<IconX style={{ width: rem(16), height: rem(16) }} />}
            color='blue'
            variant='filled'
            defaultChecked
            onClick={() => {
              setFilters((oldFilters: Filters) => {
                return {
                  ...oldFilters,
                  gender: oldFilters.gender.filter((g) => g !== gender),
                }
              })
            }}
          >
            {gender === Gender.OTHER ? 'Unknown Gender' : gender}
          </Chip>
        ))}
        {filters.status.map((status) => (
          <Chip
            key={status}
            icon={<IconX style={{ width: rem(16), height: rem(16) }} />}
            color='blue'
            variant='filled'
            defaultChecked
            onClick={() => {
              setFilters((oldFilters: Filters) => {
                return {
                  ...oldFilters,
                  status: oldFilters.status.filter((s) => s !== status),
                }
              })
            }}
          >
            {status}
          </Chip>
        ))}
        {filters.assessment.maxScore < 100 && (
          <Chip
            key='maxScore'
            icon={<IconX style={{ width: rem(16), height: rem(16) }} />}
            color='blue'
            variant='filled'
            defaultChecked
            onClick={() => {
              setFilters((oldFilters: Filters) => {
                return {
                  ...oldFilters,
                  assessment: {
                    ...oldFilters.assessment,
                    maxScore: 100,
                    noScore: false,
                  },
                }
              })
            }}
          >
            Max Score: {filters.assessment.maxScore}
          </Chip>
        )}
        {filters.assessment.minScore > 0 && (
          <Chip
            key='minScore'
            icon={<IconX style={{ width: rem(16), height: rem(16) }} />}
            color='blue'
            variant='filled'
            defaultChecked
            onClick={() => {
              setFilters((oldFilters: Filters) => {
                return {
                  ...oldFilters,
                  assessment: {
                    ...oldFilters.assessment,
                    minScore: 0,
                  },
                }
              })
            }}
          >
            Min Score: {filters.assessment.minScore}
          </Chip>
        )}
        {filters.assessment.noScore && (
          <Chip
            key='minScore'
            icon={<IconX style={{ width: rem(16), height: rem(16) }} />}
            color='blue'
            variant='filled'
            defaultChecked
            onClick={() => {
              setFilters((oldFilters: Filters) => {
                return {
                  ...oldFilters,
                  assessment: {
                    ...oldFilters.assessment,
                    noScore: false,
                    minScore: 0,
                    maxScore: 100,
                  },
                }
              })
            }}
          >
            No Score
          </Chip>
        )}
      </Group>
    </Chip.Group>
  )
}
