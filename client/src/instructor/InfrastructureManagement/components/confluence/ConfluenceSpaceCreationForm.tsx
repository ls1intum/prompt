import { Button, MultiSelect, Stack } from '@mantine/core'
import { useState } from 'react'
import { createConfluenceSpaces } from '../../../../service/confluenceService'

interface ConfluenceSpaceCreationFormProps {
  projectNames: string[]
}

export const ConfluenceSpaceCreationForm = ({
  projectNames,
}: ConfluenceSpaceCreationFormProps): JSX.Element => {
  const [spaceNameSuggestions, setSpaceNameSuggestions] = useState(projectNames)
  const [spaceNamesToCreate, setSpaceNamesToCreate] = useState(spaceNameSuggestions)

  return (
    <Stack>
      <MultiSelect
        label='Space Names'
        data={spaceNameSuggestions}
        placeholder='Select or type space names to create'
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          setSpaceNameSuggestions((current) => [...current, query])
          return query
        }}
        value={spaceNamesToCreate}
        onChange={setSpaceNamesToCreate}
      />
      <Button
        onClick={() => {
          void createConfluenceSpaces(spaceNamesToCreate)
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
