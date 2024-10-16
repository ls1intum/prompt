import { PillsInput, Pill, Combobox, CheckIcon, Group, useCombobox } from '@mantine/core'
import { useState } from 'react'
import { MultiSelectItem } from '.'

interface MultiSelectSearchableProps {
  label: string
  data: MultiSelectItem[]
  value: MultiSelectItem[]
  onChange: (value: MultiSelectItem[]) => void
}

export const MultiSelectSearchable = ({
  value,
  onChange,
}: MultiSelectSearchableProps): JSX.Element => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [search, setSearch] = useState('')

  const handleValueSelect = (val: string): void =>
    onChange(
      value.includes({ label: val, value: val })
        ? value.filter(
            (v) => v.value.trim().toLowerCase() !== val && v.label.trim().toLowerCase() !== val,
          )
        : [...value, { label: val, value: val }],
    )

  const handleValueRemove = (val: string): void =>
    onChange(value.filter((v) => v.value.trim().toLowerCase() !== val.trim().toLowerCase()))

  const values = value.map((item) => (
    <Pill key={item.value} withRemoveButton onRemove={() => handleValueRemove(item.value)}>
      {item.label}
    </Pill>
  ))

  const options = value
    .filter(
      (item) =>
        item.value.toLowerCase().includes(search.trim().toLowerCase()) ||
        item.label.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .map((item) => (
      <Combobox.Option value={item.value} key={item.value} active={value.includes(item)}>
        <Group gap='sm'>
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{item.label}</span>
        </Group>
      </Combobox.Option>
    ))

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder='Search values'
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex()
                  setSearch(event.currentTarget.value)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault()
                    handleValueRemove(value[value.length - 1].value)
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
