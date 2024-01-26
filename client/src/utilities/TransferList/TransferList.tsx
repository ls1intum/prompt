import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Combobox, TextInput, useCombobox, Checkbox, ActionIcon, Group } from '@mantine/core'
import './TransferList.scss'
import { useEffect, useMemo, useState } from 'react'

interface RenderListProps {
  options: TransferListItem[]
  onTransfer(options: TransferListItem[]): void
  type: 'forward' | 'backward'
}

const RenderList = ({ options, onTransfer, type }: RenderListProps): JSX.Element => {
  const combobox = useCombobox()
  const [value, setValue] = useState<TransferListItem[]>([])
  const [search, setSearch] = useState('')

  const handleValueSelect = (val: TransferListItem): void =>
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
    )

  const items = useMemo(() => {
    return options
      .filter((item) => item.label.toLowerCase().includes(search.toLowerCase().trim()))
      .map((item) => (
        <Combobox.Option
          value={item.value}
          key={item.value}
          active={value.some((v) => v.value === item.value)}
          onMouseOver={() => combobox.resetSelectedOption()}
        >
          <Group gap='sm'>
            <Checkbox
              checked={value.some((v) => v.value === item.value)}
              onChange={() => {}}
              aria-hidden
              tabIndex={-1}
              style={{ pointerEvents: 'none' }}
            />
            <span>{item.label}</span>
          </Group>
        </Combobox.Option>
      ))
  }, [combobox, options, search, value])

  return (
    <div data-type={type}>
      <Combobox
        store={combobox}
        onOptionSubmit={(values) => {
          handleValueSelect({ label: values, value: values })
        }}
      >
        <Combobox.EventsTarget>
          <Group wrap='nowrap' gap={0} className='controls'>
            <TextInput
              placeholder='Search...'
              style={{ width: '20vw' }}
              classNames={{ input: 'input' }}
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value)
                combobox.updateSelectedOptionIndex()
              }}
            />
            <ActionIcon
              radius={0}
              variant='default'
              size={36}
              onClick={() => {
                onTransfer(value)
                setValue([])
              }}
            >
              {type === 'forward' ? <IconChevronRight /> : <IconChevronLeft />}
            </ActionIcon>
          </Group>
        </Combobox.EventsTarget>

        <div className='list'>
          <Combobox.Options>
            {items.length > 0 ? items : <Combobox.Empty>Nothing found....</Combobox.Empty>}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  )
}

export interface TransferListItem {
  label: string
  value: string
}

interface TransferListProps {
  leftSectionData: TransferListItem[]
  rightSectionData: TransferListItem[]
  leftSectionTitle: string
  rightSectionTitle: string
  onChange: (data: TransferListItem[][]) => void
}

export const TransferList = ({
  leftSectionData,
  rightSectionData,
  onChange,
}: TransferListProps): JSX.Element => {
  const [data, setData] = useState<TransferListItem[][]>([leftSectionData, rightSectionData])

  const handleTransfer = (transferFrom: number, options: TransferListItem[]): void =>
    setData((current) => {
      const transferTo = transferFrom === 0 ? 1 : 0
      const transferFromData = current[transferFrom].filter(
        (item) => !options.some((o) => o.value === item.value),
      )
      const transferToData = [...current[transferTo], ...options]

      const result: TransferListItem[][] = []
      result[transferFrom] = transferFromData
      result[transferTo] = transferToData
      onChange(result as TransferListItem[][])
      return result as TransferListItem[][]
    })

  useEffect(() => {
    setData([leftSectionData, rightSectionData])
  }, [leftSectionData, rightSectionData])

  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <RenderList
        type='forward'
        options={data[0]}
        onTransfer={(options) => handleTransfer(0, options)}
      />
      <RenderList
        type='backward'
        options={data[1]}
        onTransfer={(options) => handleTransfer(1, options)}
      />
    </div>
  )
}
