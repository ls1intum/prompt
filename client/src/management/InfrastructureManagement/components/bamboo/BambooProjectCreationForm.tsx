import { Button, Stack } from '@mantine/core'
import { createBambooProjects } from '../../../../service/bambooService'
import { useState } from 'react'
import { MultiSelectCreatable, MultiSelectItem } from '../../../../utilities/CustomMultiSelect'

interface BambooProjectCreationFormProps {
  projectNames: string[]
}

export const BambooProjectCreationForm = ({
  projectNames,
}: BambooProjectCreationFormProps): JSX.Element => {
  const [projectNameSuggestions, setProjectNameSuggestions] = useState<MultiSelectItem[]>(
    projectNames.map((p) => ({ label: p, value: p })),
  )
  const [projectNamesToCreate, setProjectNamesToCreate] = useState<MultiSelectItem[]>(
    projectNameSuggestions.map((p) => ({ label: p.label, value: p.value })),
  )

  return (
    <Stack>
      <MultiSelectCreatable
        label='Project Names'
        data={projectNameSuggestions}
        onCreate={(query) => {
          setProjectNameSuggestions((current) => [...current, { label: query, value: query }])
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
                name: pn.value,
                key: pn.value,
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
