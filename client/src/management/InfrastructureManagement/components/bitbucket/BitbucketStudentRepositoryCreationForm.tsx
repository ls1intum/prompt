import { Button, Select, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import {
  type BitbucketProject,
  fetchBitbucketProjects,
  createBitbucketProjectRepositories,
} from '../../../../network/bitbucketService'
import { MultiSelectCreatable, MultiSelectItem } from '../../../../utilities/CustomMultiSelect'

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
  const [studentUsernames, setStudentUsernames] = useState<MultiSelectItem[]>([])

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
  }, [iosTag])

  useEffect(() => {
    setStudentUsernames(
      students.map((s) => {
        return { label: s, value: s }
      }),
    )
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
      <MultiSelectCreatable
        label='Student Repositories'
        data={students.map((s) => {
          return { label: s, value: s }
        })}
        onCreate={(query) => {
          setStudentUsernames((current) => [...current, { label: query, value: query }])
          return query
        }}
        value={studentUsernames}
        onChange={setStudentUsernames}
      />
      <Button
        variant='filled'
        disabled={!selectedBitbucketProject || students.length === 0}
        onClick={() => {
          if (selectedBitbucketProject) {
            void createBitbucketProjectRepositories(
              selectedBitbucketProject,
              studentUsernames.map((s) => s.value),
            )
          }
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
