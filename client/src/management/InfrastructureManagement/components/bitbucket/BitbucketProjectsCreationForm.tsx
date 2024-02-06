import { Button, Checkbox, Stack, Tooltip } from '@mantine/core'
import { useState } from 'react'
import { createBitbucketProjects } from '../../../../network/bitbucketService'
import { MultiSelectCreatable, MultiSelectItem } from '../../../../utilities/CustomMultiSelect'

interface BitbucketProjectsCreationFormProps {
  projectNames: string[]
  defaultWithRepository?: boolean
}

export const BitbucketProjectsCreationForm = ({
  projectNames,
  defaultWithRepository,
}: BitbucketProjectsCreationFormProps): JSX.Element => {
  const [projectNameSuggestions, setProjectNameSuggestions] = useState<MultiSelectItem[]>(
    projectNames.map((p) => ({ label: p, value: p })),
  )
  const [projectNamesToCreate, setProjectNamesToCreate] = useState(projectNameSuggestions)
  const [createProjectsWithRepositories, setCreateProjectsWithRepositories] = useState(
    !!defaultWithRepository,
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
      <Tooltip label='The repository created for the project will have the same name as the project key.'>
        <Checkbox
          label='Create with Repository'
          checked={createProjectsWithRepositories}
          onChange={(e) => {
            setCreateProjectsWithRepositories(e.target.checked)
          }}
        />
      </Tooltip>
      <Button
        onClick={() => {
          void createBitbucketProjects(
            projectNamesToCreate.map((p) => p.value),
            createProjectsWithRepositories,
          )
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
