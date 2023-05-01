import { Button, MultiSelect, Select, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import {
  type BitbucketProject,
  fetchBitbucketProjects,
  createBitbucketProjectRepositories,
} from '../../../../service/bitbucketService'

interface BitbucketStudentRepositoryCreationFormProps {
  iosTag: string
  students: string[]
}

export const BitbucketStudentRepositoryCreationForm = ({
  iosTag,
  students,
}: BitbucketStudentRepositoryCreationFormProps): JSX.Element => {
  const [fetchedBitbucketProjects, setFetchedBitbucketProjects] = useState<BitbucketProject[]>([])
  const [selectedBitbucketProject, setSelectedBitbucketProject] = useState<string | null>()
  const [studentUsernames, setStudentUsernames] = useState<string[]>([])

  useEffect(() => {
    const loadBitbucketProjects = async (): Promise<void> => {
      const response = await fetchBitbucketProjects(`${iosTag.toLowerCase()}-intro`)
      if (response) {
        setFetchedBitbucketProjects(response)

        const iosTagBitbucketProject = response
          .filter((p) => p.key.toLowerCase() === `${iosTag.toLowerCase()}-intro`)
          .at(0)
        if (iosTagBitbucketProject) {
          setSelectedBitbucketProject(iosTagBitbucketProject.key)
        }
      }
    }
    void loadBitbucketProjects()
  }, [])

  useEffect(() => {
    setStudentUsernames(students)
  }, [students])

  return (
    <Stack>
      <Select
        label='Project'
        data={fetchedBitbucketProjects.map((p) => p.key)}
        placeholder='Select Bitbucket project'
        searchable
        value={selectedBitbucketProject}
        onChange={setSelectedBitbucketProject}
      />
      <MultiSelect
        label='Student Repositories'
        data={students}
        placeholder='Select or type a username to create'
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          setStudentUsernames((current) => [...current, query])
          return query
        }}
        value={studentUsernames}
        onChange={setStudentUsernames}
      />
      <Button
        variant='filled'
        disabled={!selectedBitbucketProject}
        onClick={() => {
          if (selectedBitbucketProject) {
            void createBitbucketProjectRepositories(selectedBitbucketProject, studentUsernames)
          }
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
