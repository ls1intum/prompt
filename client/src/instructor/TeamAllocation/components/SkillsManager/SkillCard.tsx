import { Badge, Button, Card, Group, Modal, Text } from '@mantine/core'
import { type Skill } from '../../../../redux/skillsSlice/skillsSlice'
import { IconTrash } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../../redux/store'
import { deleteSkill } from '../../../../redux/skillsSlice/thunks/deleteSkill'
import { toggleSkill } from '../../../../redux/skillsSlice/thunks/toggleSkill'
import { useState } from 'react'

interface SkillDeletionConfirmationModalProps {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  skill: Skill
}

export const SkillDeletionConfirmationModal = ({
  opened,
  onClose,
  onConfirm,
  skill,
}: SkillDeletionConfirmationModalProps): JSX.Element => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={`Are you sure you want to delete the skill ${skill.title}?`}
    >
      <Button
        onClick={() => {
          onConfirm()
          onClose()
        }}
      >
        Confirm
      </Button>
    </Modal>
  )
}

interface SkillCardProps {
  skill: Skill
}

export const SkillCard = ({ skill }: SkillCardProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [deletionConfirmationModalOpened, setDeletionConfirmationModalOpened] = useState(false)

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder style={{ width: '50vw' }}>
      <Group align='apart' mt='md' mb='xs'>
        <Text fw={500}>{skill.title}</Text>
        <Badge
          color={skill.active ? 'green' : 'red'}
          variant='light'
          onClick={() => {
            if (skill.id) {
              void dispatch(toggleSkill(skill.id))
            }
          }}
        >
          {skill.active ? 'Active' : 'Disabled'}
        </Badge>
      </Group>
      <Text size='sm' color='dimmed'>
        {skill.description}
      </Text>
      <Group align='right'>
        <SkillDeletionConfirmationModal
          opened={deletionConfirmationModalOpened}
          onClose={() => {
            setDeletionConfirmationModalOpened(false)
          }}
          onConfirm={() => {
            if (skill.id) {
              void dispatch(deleteSkill(skill.id))
            }
          }}
          skill={skill}
        />
        <Button
          variant='outline'
          leftSection={<IconTrash />}
          onClick={() => {
            setDeletionConfirmationModalOpened(true)
          }}
        >
          Delete
        </Button>
      </Group>
    </Card>
  )
}
