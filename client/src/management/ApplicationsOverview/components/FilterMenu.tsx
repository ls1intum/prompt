import {
  Button,
  Checkbox,
  Menu,
  NumberInput,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import { IconFilter } from '@tabler/icons-react'
import { Filters } from '../ApplicationOverview'
import { ApplicationStatus, Gender } from '../../../interface/application'
import { MenuItemCheckbox } from './MenuItemCheckbox'

interface FilterMenuProps {
  filters: Filters
  setFilters: (updateFn: (prevFilters: Filters) => Filters) => void
}

export const FilterMenu = ({ filters, setFilters }: FilterMenuProps): JSX.Element => {
  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setFilters((currFilters) => ({
      ...currFilters,
      status: checked
        ? [...currFilters.status, status]
        : currFilters.status.filter((existingStatus) => existingStatus !== status.toString()),
    }))
  }

  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  function getTextColor(isTextActive: boolean) {
    return isTextActive ? 'darkgray' : colorScheme === 'dark' ? theme.colors.dark[0] : theme.black
  }

  return (
    <Menu withArrow closeOnItemClick={false}>
      <Menu.Target>
        <Button leftSection={<IconFilter size={18} />} variant='default'>
          Filter
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Gender</Menu.Label>
        <MenuItemCheckbox
          label='Male'
          checked={filters.gender.includes(Gender.MALE)}
          onChange={(e) => {
            setFilters((currFilters) => ({
              ...currFilters,
              gender: e.currentTarget.checked
                ? [...currFilters.gender, Gender.MALE]
                : currFilters.gender.filter((gender) => gender !== Gender.MALE),
            }))
          }}
        />
        <MenuItemCheckbox
          label='Female'
          checked={filters.gender.includes(Gender.FEMALE)}
          onChange={(e) => {
            setFilters((currFilters) => ({
              ...currFilters,
              gender: e.currentTarget.checked
                ? [...currFilters.gender, Gender.FEMALE]
                : currFilters.gender.filter((gender) => gender !== Gender.FEMALE),
            }))
          }}
        />
        <MenuItemCheckbox
          label='Unkown / Other'
          checked={
            filters.gender.includes(Gender.PREFER_NOT_TO_SAY) ||
            filters.gender.includes(Gender.OTHER)
          }
          onChange={(e) => {
            setFilters((currFilters) => ({
              ...currFilters,
              gender: e.currentTarget.checked
                ? [...currFilters.gender, Gender.OTHER]
                : currFilters.gender.filter((gender) => gender !== Gender.OTHER),
            }))
          }}
        />

        <Menu.Divider />
        <Menu.Label>Assessment</Menu.Label>
        <MenuItemCheckbox
          label='No Score'
          checked={filters.assessment.noScore}
          onChange={(e) => {
            setFilters((oldFilters: Filters) => {
              return {
                ...oldFilters,
                assessment: {
                  minScore: 0,
                  maxScore: 100,
                  noScore: e.currentTarget.checked,
                },
              }
            })
          }}
        />
        <Menu.Item component='div'>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <NumberInput
              description='Min Score'
              placeholder='0'
              value={filters.assessment.minScore}
              min={0}
              max={100}
              onChange={(value) => {
                setFilters((oldFilters: Filters) => {
                  return {
                    ...oldFilters,
                    assessment: {
                      minScore: +value,
                      noScore: +value > 0 ? false : oldFilters.assessment.noScore,
                      maxScore: oldFilters.assessment.noScore
                        ? 100
                        : oldFilters.assessment.maxScore,
                    },
                  }
                })
              }}
              style={{
                width: '6rem',
              }}
              styles={{
                input: {
                  color: getTextColor(filters.assessment.minScore === 0),
                  opacity: filters.assessment.minScore === 0 ? 0.8 : 1,
                },
              }}
            />
            <NumberInput
              description='Max Score'
              placeholder='100'
              value={filters.assessment.maxScore}
              min={0}
              max={100}
              onChange={(value) => {
                setFilters((oldFilters: Filters) => {
                  return {
                    ...oldFilters,
                    assessment: {
                      minScore: oldFilters.assessment.minScore,
                      maxScore: +value,
                      noScore: +value > 0 ? false : oldFilters.assessment.noScore,
                    },
                  }
                })
              }}
              style={{ width: '6rem' }}
              styles={{
                input: {
                  color:
                    filters.assessment.maxScore === 100
                      ? 'darkgray'
                      : colorScheme === 'dark'
                        ? theme.colors.dark[0]
                        : theme.black,
                  opacity: filters.assessment.maxScore === 100 ? 0.8 : 1,
                },
              }}
            />
          </div>
        </Menu.Item>

        <Menu.Divider />
        <Menu.Label>Assessment</Menu.Label>
        {Object.keys(ApplicationStatus).map((status) => (
          <MenuItemCheckbox
            key={status}
            label={ApplicationStatus[status]}
            checked={filters.status.includes(status)}
            onChange={(e) => handleStatusFilterChange(status, e.currentTarget.checked)}
          />
        ))}

        <Menu.Divider />
        <div style={{ padding: '0.5rem ' }}>
          <Button
            variant='light'
            fullWidth
            onClick={() => {
              setFilters((oldFilters: Filters) => {
                return {
                  ...oldFilters,
                  gender: [],
                  status: [],
                  assessment: {
                    noScore: false,
                    minScore: 0,
                    maxScore: 100,
                  },
                }
              })
            }}
          >
            Reset Filters
          </Button>
        </div>
      </Menu.Dropdown>
    </Menu>
  )
}
