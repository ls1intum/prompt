import {
  ComboboxData,
  MultiSelect,
  MultiSelectProps,
  Select,
  SelectProps,
  Stack,
  Text,
} from '@mantine/core'

interface FormSelectFieldProps {
  label: string
  placeholder: string
  readValue: string
  data: ComboboxData
  required?: boolean
  disabled?: boolean
  multiselect?: boolean
  readOnly?: boolean
  selectProps?: SelectProps
  multiselectProps?: MultiSelectProps
}

export const FormSelectField = ({
  label,
  placeholder,
  readValue,
  data,
  selectProps,
  multiselectProps,
  required = false,
  disabled = false,
  multiselect = false,
  readOnly = false,
}: FormSelectFieldProps): JSX.Element => {
  return readOnly ? (
    <Stack style={{ gap: '0' }}>
      <Text c='dimmed' fz='xs' fw={700}>
        {label}
      </Text>
      <Text fz='sm' lineClamp={20}>
        {readValue}
      </Text>
    </Stack>
  ) : multiselect ? (
    <MultiSelect
      label={label}
      placeholder={placeholder}
      data={data}
      required={required}
      withAsterisk={required}
      disabled={disabled}
      {...multiselectProps}
    />
  ) : (
    <Select
      label={label}
      placeholder={placeholder}
      data={data}
      required={required}
      withAsterisk={required}
      disabled={disabled}
      searchable
      {...selectProps}
    />
  )
}
