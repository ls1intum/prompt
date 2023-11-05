import { ActionIcon, Button, Checkbox, Group, Select, Stack, Table, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import {
  JIRA_PROJECTS_MGMT,
  createJiraProjects,
  type JiraProject,
  type JiraProjectCategory,
  fetchJiraProjectCategories,
} from '../../../../service/jiraService'
import { IconX } from '@tabler/icons-react'
import { isNotEmpty, useForm } from '@mantine/form'

interface JiraProjectsCreationFormProps {
  iosTag: string
  mode: 'mgmt' | 'teams'
  initialProjectsToCreate?: JiraProject[]
}

export const JiraProjectsCreationForm = ({
  iosTag,
  mode,
  initialProjectsToCreate,
}: JiraProjectsCreationFormProps): JSX.Element => {
  const [projectLeadUsername, setProjectLeadUsername] = useState('')
  const [prependIosTagNewProject, setPrependIosTagNewProject] = useState(false)
  const newProjectForm = useForm<JiraProject>({
    initialValues: {
      name: '',
      key: '',
      lead: '',
      categoryId: '',
    },
    validateInputOnBlur: true,
    validate: {
      name: isNotEmpty('Project name cannot be empty.'),
    },
  })

  const [fetchedProjectCategories, setFetchedProjectCategories] = useState<JiraProjectCategory[]>(
    [],
  )
  const [projectsToCreate, setProjectsToCreate] = useState<JiraProject[]>(
    initialProjectsToCreate ?? [],
  )
  const projects = projectsToCreate.map((projectToCreate) => (
    <tr key={projectToCreate.name}>
      <td>{projectToCreate.name}</td>
      <td>
        {fetchedProjectCategories.filter((jpc) => jpc.id === projectToCreate.categoryId).at(0)
          ?.name ?? ''}
      </td>
      <td>
        <ActionIcon
          onClick={() => {
            setProjectsToCreate(projectsToCreate.filter((ptc) => ptc.name !== projectToCreate.name))
          }}
        >
          <IconX />
        </ActionIcon>
      </td>
    </tr>
  ))

  useEffect(() => {
    const loadJiraProjectCategories = async (): Promise<void> => {
      const response = await fetchJiraProjectCategories()
      if (response) {
        setFetchedProjectCategories(response)
      }
    }
    void loadJiraProjectCategories()
  }, [])

  useEffect(() => {
    if (mode === 'mgmt') {
      setProjectsToCreate(
        JIRA_PROJECTS_MGMT.map((project) => {
          return {
            name: iosTag.toUpperCase() + project,
            key: iosTag.toUpperCase() + project,
            categoryId:
              fetchedProjectCategories
                .filter((jpc) => jpc.name === iosTag.toUpperCase() + project.toUpperCase())
                .at(0)?.id ?? '',
            lead: projectLeadUsername,
          }
        }),
      )
    } else if (mode === 'teams') {
      setProjectsToCreate(
        projectsToCreate.map((project) => {
          return {
            ...project,
            categoryId:
              fetchedProjectCategories.filter((pc) => pc.name === project.name).at(0)?.id ?? '',
          }
        }),
      )
    }
  }, [fetchedProjectCategories, iosTag, mode, projectLeadUsername, projectsToCreate])

  return (
    <Stack>
      <TextInput
        placeholder='Project lead username'
        required
        withAsterisk
        label='Project Lead Username'
        value={projectLeadUsername}
        onChange={(e) => {
          setProjectLeadUsername(e.target.value)
        }}
      />
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Project Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{projects}</tbody>
      </Table>
      <Stack>
        <Group align='center' grow style={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextInput
            placeholder='Project name'
            label='Project Name'
            {...newProjectForm.getInputProps('name')}
          />
          <Select
            label='Project Category'
            placeholder='Project category'
            searchable
            nothingFoundMessage='No project categories found.'
            data={[
              ...fetchedProjectCategories.map((jiraProjectCategory) => {
                return {
                  value: jiraProjectCategory.id ?? '',
                  label: jiraProjectCategory.name,
                }
              }),
            ]}
            {...newProjectForm.getInputProps('categoryId')}
          />
          <Button
            variant='filled'
            disabled={!newProjectForm.isValid()}
            onClick={() => {
              if (prependIosTagNewProject) {
                setProjectsToCreate([
                  ...projectsToCreate,
                  {
                    ...newProjectForm.values,
                    name: iosTag.toUpperCase() + newProjectForm.values.name,
                  },
                ])
              } else {
                setProjectsToCreate([...projectsToCreate, newProjectForm.values])
              }
              newProjectForm.reset()
            }}
          >
            Add Project
          </Button>
        </Group>
        <Checkbox
          label='Prepand iOS tag'
          checked={prependIosTagNewProject}
          onChange={(e) => {
            setPrependIosTagNewProject(e.target.checked)
          }}
        />
      </Stack>
      <Button
        disabled={!projectLeadUsername}
        onClick={() => {
          void createJiraProjects(
            projectsToCreate.map((ptc) => {
              return {
                ...ptc,
                lead: projectLeadUsername,
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
