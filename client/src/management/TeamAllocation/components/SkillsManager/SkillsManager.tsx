import { useEffect, useState } from 'react'
import { SkillCard } from './SkillCard'
import { Button, Grid } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { SkillCreationModal } from './SkillCreationModal'
import { useQuery } from '@tanstack/react-query'
import { Skill } from '../../../../interface/skill'
import { Query } from '../../../../state/query'
import { getSkills } from '../../../../network/skill'
import { useSkillStore } from '../../../../state/zustand/useSkillStore'
import { useCourseIterationStore } from '../../../../state/zustand/useCourseIterationStore'

export const SkillsManager = (): JSX.Element => {
  const { selectedCourseIteration } = useCourseIterationStore()
  const { skills, setSkills } = useSkillStore()
  const [skillCreationModalOpened, setSkillCreationModalOpened] = useState(false)

  const { data: fetchedSkills } = useQuery<Skill[]>({
    queryKey: [Query.SKILL],
    queryFn: () => getSkills(selectedCourseIteration?.id ?? ''),
    enabled: !!selectedCourseIteration,
  })

  useEffect(() => {
    setSkills(fetchedSkills ?? [])
  }, [fetchedSkills, setSkills])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'right', margin: '2vh 0' }}>
        <SkillCreationModal
          opened={skillCreationModalOpened}
          onClose={() => {
            setSkillCreationModalOpened(false)
          }}
        />
        <Button
          leftSection={<IconPlus />}
          variant='filled'
          onClick={() => {
            setSkillCreationModalOpened(true)
          }}
        >
          Create Skill
        </Button>
      </div>
      <Grid grow>
        {skills.map((skill) => (
          <Grid.Col span={4} key={skill.id}>
            <SkillCard skill={skill} />
          </Grid.Col>
        ))}
      </Grid>
    </>
  )
}
