import { IconChevronRight } from '@tabler/icons-react'
import { Combobox, TextInput, useCombobox, Checkbox, ActionIcon, Group } from '@mantine/core'
import './TransferList.scss'
import { useState } from 'react'

interface RenderListProps {
  options: TransferListItem[]
  onTransfer(options: string[]): void
  type: 'forward' | 'backward'
}

const RenderList = ({ options, onTransfer, type }: RenderListProps): JSX.Element => {
  const combobox = useCombobox()
  const [value, setValue] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const handleValueSelect = (val: string): void =>
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
    )

  const items = options
    .filter((item) => item.label.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option
        value={item.value}
        key={item.value}
        active={value.includes(item.value)}
        onMouseOver={() => combobox.resetSelectedOption()}
      >
        <Group gap='sm'>
          <Checkbox
            checked={value.includes(item.value)}
            onChange={() => {}}
            aria-hidden
            tabIndex={-1}
            style={{ pointerEvents: 'none' }}
          />
          <span>{item.label}</span>
        </Group>
      </Combobox.Option>
    ))

  return (
    <div className='renderList' data-type={type}>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
        <Combobox.EventsTarget>
          <Group wrap='nowrap' gap={0} className='controls'>
            <TextInput
              placeholder='Search groceries'
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
              className='control'
              onClick={() => {
                onTransfer(value)
                setValue([])
              }}
            >
              <IconChevronRight className='icon' />
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

  const handleTransfer = (transferFrom: number, options: string[]): void =>
    setData((current) => {
      const transferTo = transferFrom === 0 ? 1 : 0
      const transferFromData = current[transferFrom].filter((item) => !options.includes(item.value))
      const transferToData = [...current[transferTo], ...options]

      const result = []
      result[transferFrom] = transferFromData
      result[transferTo] = transferToData
      onChange(result as TransferListItem[][])
      return result as TransferListItem[][]
    })

  return (
    <div className='root'>
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
