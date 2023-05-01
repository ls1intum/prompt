import { Button, Checkbox, MultiSelect, Stack, Tooltip } from '@mantine/core'
import { useState } from 'react'
import { createBitbucketProjects } from '../../../../service/bitbucketService'

interface BitbucketProjectsCreationFormProps {
  projectNames: string[]
  defaultWithRepository?: boolean
}

export const BitbucketProjectsCreationForm = ({
  projectNames,
  defaultWithRepository,
}: BitbucketProjectsCreationFormProps): JSX.Element => {
  const [projectNameSuggestions, setProjectNameSuggestions] = useState(projectNames)
  const [projectNamesToCreate, setProjectNamesToCreate] = useState(projectNameSuggestions)
  const [createProjectsWithRepositories, setCreateProjectsWithRepositories] = useState(
    !!defaultWithRepository,
  )

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
          void createBitbucketProjects(projectNamesToCreate, createProjectsWithRepositories)
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
