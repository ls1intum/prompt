import { Badge, Button, Card, Group, Modal, Stack, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { Skill } from '../../../../interface/skill'
import { useMutation, useQueryClient } from 'react-query'
import { Query } from '../../../../state/query'
import { deleteSkill, toggleSkill } from '../../../../network/skill'

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
  const queryClient = useQueryClient()
  const [deletionConfirmationModalOpened, setDeletionConfirmationModalOpened] = useState(false)

  const deActivateSkill = useMutation({
    mutationFn: () => {
      return toggleSkill(skill.id ?? '')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.SKILL] })
    },
  })

  const removeSkill = useMutation({
    mutationFn: () => {
      return deleteSkill(skill.id ?? '')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.SKILL] })
    },
  })

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder style={{ width: '100%', height: '100%' }}>
      <SkillDeletionConfirmationModal
        opened={deletionConfirmationModalOpened}
        onClose={() => {
          setDeletionConfirmationModalOpened(false)
        }}
        onConfirm={() => {
          if (skill.id) {
            removeSkill.mutate()
          }
        }}
        skill={skill}
      />
      <Stack justify='space-between' style={{ height: '100%' }}>
        <Text fw={500}>{skill.title}</Text>
        <Text size='sm' c='dimmed'>
          {skill.description}
        </Text>
        <Group justify='space-between'>
          <Button
            variant='outline'
            leftSection={<IconTrash />}
            onClick={() => {
              setDeletionConfirmationModalOpened(true)
            }}
          >
            Delete
          </Button>
          <Badge
            color={skill.active ? 'green' : 'red'}
            variant='light'
            onClick={() => {
              if (skill.id) {
                deActivateSkill.mutate()
              }
            }}
          >
            {skill.active ? 'Active' : 'Disabled'}
          </Badge>
        </Group>
      </Stack>
    </Card>
  )
}
