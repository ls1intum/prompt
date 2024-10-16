import { Checkbox, Menu } from '@mantine/core'

interface MenuItemCheckboxProps {
  label: string
  checked: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined
}

export const MenuItemCheckbox = ({
  label,
  checked,
  onChange,
}: MenuItemCheckboxProps): JSX.Element => {
  return (
    <Menu.Item component='div'>
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
        <Checkbox
          label={label}
          checked={checked}
          styles={{
            input: {
              cursor: 'pointer', // Ensures the pointer is shown over the checkbox
            },
            label: {
              cursor: 'pointer', // Ensures the pointer is shown over the checkbox label
            },
          }}
          onChange={onChange}
        />
      </label>
    </Menu.Item>
  )
}
