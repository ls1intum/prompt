import { useState } from 'react'
import {
  JIRA_PROJECT_CATEGORIES_MGMT,
  createJiraProjectCategories,
} from '../../../../service/jiraService'
import { Button, MultiSelect, Stack } from '@mantine/core'

interface JiraProjectCategoriesCreationFormProps {
  iosTag?: string
  mode: 'mgmt' | 'teams'
  initialProjectCategoriesToCreate?: string[]
}

export const JiraProjectCategoriesCreationForm = ({
  iosTag,
  mode,
  initialProjectCategoriesToCreate,
}: JiraProjectCategoriesCreationFormProps): JSX.Element => {
  const [projectCategorySuggestions, setProjectCategorySuggestions] = useState(
    mode === 'mgmt'
      ? JIRA_PROJECT_CATEGORIES_MGMT.map(
          (projectCategory) => (iosTag?.toUpperCase() ?? '') + projectCategory,
        )
      : initialProjectCategoriesToCreate ?? [],
  )
  const [projectCategoriesToCreate, setProjectCategoriesToCreate] = useState<string[]>(
    mode === 'mgmt' ? projectCategorySuggestions : initialProjectCategoriesToCreate ?? [],
  )

  return (
    <Stack>
      <MultiSelect
        label='Project Categories'
        data={projectCategorySuggestions}
        placeholder='Select or type project categories to create'
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          setProjectCategorySuggestions((current) => [...current, query])
          return query
        }}
        value={projectCategoriesToCreate}
        onChange={setProjectCategoriesToCreate}
      />
      <Button
        disabled={projectCategoriesToCreate.length === 0}
        onClick={() => {
          void createJiraProjectCategories(projectCategoriesToCreate)
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
