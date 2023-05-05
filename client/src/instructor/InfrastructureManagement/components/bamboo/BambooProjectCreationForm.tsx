import { Button, MultiSelect, Stack } from '@mantine/core'
import { createBambooProjects } from '../../../../service/bambooService'
import { useState } from 'react'

interface BambooProjectCreationFormProps {
  projectNames: string[]
}

export const BambooProjectCreationForm = ({
  projectNames,
}: BambooProjectCreationFormProps): JSX.Element => {
  const [projectNameSuggestions, setProjectNameSuggestions] = useState(projectNames)
  const [projectNamesToCreate, setProjectNamesToCreate] = useState(projectNameSuggestions)

  return (
    <Stack>
      <MultiSelect
        label='Project Names'
        data={projectNameSuggestions}
        placeholder='Select or type project names to create'
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          setProjectNameSuggestions((current) => [...current, query])
          return query
        }}
        value={projectNamesToCreate}
        onChange={setProjectNamesToCreate}
      />
      <Button
        onClick={() => {
          void createBambooProjects(
            projectNamesToCreate.map((pn) => {
              return {
                name: pn,
                key: pn,
              }
            }),
          )
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
