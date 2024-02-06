import { ActionIcon, Button, Group, Stack, Table, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { type ConfluenceSpace, createConfluenceSpaces } from '../../../../network/confluenceService'
import { IconX } from '@tabler/icons-react'
import { useForm } from '@mantine/form'

interface ConfluenceSpaceCreationFormProps {
  iosTag: string
  spaces: ConfluenceSpace[]
}

export const ConfluenceSpaceCreationForm = ({
  iosTag,
  spaces,
}: ConfluenceSpaceCreationFormProps): JSX.Element => {
  const [spacesToCreate, setSpacesToCreate] = useState<ConfluenceSpace[]>([])
  const newConfluenceSpace = useForm<ConfluenceSpace>({
    initialValues: {
      name: '',
      key: '',
    },
  })

  useEffect(() => {
    setSpacesToCreate([
      ...spacesToCreate,
      ...spaces.map((space) => {
        return {
          name: `${iosTag.toUpperCase()} ${space.name}`,
          key: `${iosTag.toUpperCase()}${space.key}`,
        }
      }),
    ])
  }, [iosTag, spaces, spacesToCreate])

  return (
    <Stack>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Space Name</th>
            <th>Space Key</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {spacesToCreate.map((space) => (
            <tr key={`${space.key}`}>
              <td>{space.name}</td>
              <td>{space.key}</td>
              <td>
                <ActionIcon
                  onClick={() => {
                    setSpacesToCreate(spaces.filter((s) => s.key !== space.key))
                  }}
                >
                  <IconX />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group align='center' grow style={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextInput
          placeholder='Space name'
          label='Space Name'
          {...newConfluenceSpace.getInputProps('name')}
        />
        <TextInput
          placeholder='Space key'
          label='Space key'
          {...newConfluenceSpace.getInputProps('key')}
        />
        <Button
          variant='filled'
          onClick={() => {
            setSpacesToCreate([...spacesToCreate, newConfluenceSpace.values])
            newConfluenceSpace.reset()
          }}
        >
          Add
        </Button>
      </Group>
      <Button
        onClick={() => {
          void createConfluenceSpaces(spacesToCreate)
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
