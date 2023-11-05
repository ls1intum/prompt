import { useState } from 'react'
import {
  JIRA_PROJECT_CATEGORIES_MGMT,
  createJiraProjectCategories,
} from '../../../../service/jiraService'
import { Button, Stack } from '@mantine/core'
import { MultiSelectCreatable } from '../../../../utilities/CustomMultiSelect/MultiSelectCreatable'
import { MultiSelectItem } from '../../../../utilities/CustomMultiSelect'

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
  const [projectCategorySuggestions, setProjectCategorySuggestions] = useState<MultiSelectItem[]>(
    mode === 'mgmt'
      ? JIRA_PROJECT_CATEGORIES_MGMT.map((projectCategory) => {
          return {
            label: (iosTag?.toUpperCase() ?? '') + projectCategory,
            value: (iosTag?.toUpperCase() ?? '') + projectCategory,
          }
        })
      : initialProjectCategoriesToCreate?.map((pp) => {
          return { label: pp, value: pp }
        }) ?? [],
  )
  const [projectCategoriesToCreate, setProjectCategoriesToCreate] = useState<MultiSelectItem[]>(
    mode === 'mgmt'
      ? projectCategorySuggestions.map((p) => {
          return { label: p.label, value: p.value }
        })
      : initialProjectCategoriesToCreate?.map((pp) => {
          return { label: pp, value: pp }
        }) ?? [],
  )

  return (
    <Stack>
      <MultiSelectCreatable
        label='Project Categories'
        data={projectCategorySuggestions}
        onCreate={(query) => {
          setProjectCategorySuggestions((current) => [...current, { label: query, value: query }])
          return query
        }}
        value={projectCategoriesToCreate}
        onChange={setProjectCategoriesToCreate}
      />
      <Button
        disabled={projectCategoriesToCreate.length === 0}
        onClick={() => {
          void createJiraProjectCategories(projectCategoriesToCreate.map((p) => p.value))
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
