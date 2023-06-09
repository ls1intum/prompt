import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { useEffect, useState } from 'react'
import { fetchSkills } from '../../../../redux/skillsSlice/thunks/fetchSkills'
import { SkillCard } from './SkillCard'
import { Button, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { SkillCreationModal } from './SkillCreationModal'

export const SkillsManager = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const fetchedSkills = useAppSelector((state) => state.skills.skills)
  const [skillCreationModalOpened, setSkillCreationModalOpened] = useState(false)

  useEffect(() => {
    void dispatch(fetchSkills())
  }, [])

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
          leftIcon={<IconPlus />}
          variant='filled'
          onClick={() => {
            setSkillCreationModalOpened(true)
          }}
        >
          Create Skill
        </Button>
      </div>
      <Stack style={{ alignItems: 'center' }}>
        {fetchedSkills.map((skill) => (
          <div key={skill.id}>
            <SkillCard skill={skill} />
          </div>
        ))}
      </Stack>
    </>
  )
}
