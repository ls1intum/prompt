import { Text } from '@mantine/core'
import { type InstructorComment } from '../interface/application'
import moment from 'moment'

interface StudentApplicationCommentProps {
  instructorComment: InstructorComment
}

export const StudentApplicationComment = ({
  instructorComment,
}: StudentApplicationCommentProps): JSX.Element => {
  return (
    <fieldset
      style={{
        textAlign: 'center',
        borderRadius: '0.25rem',
        borderWidth: '0.0625rem solid #373A40 !important',
        display: 'flex',
        justifyContent: 'flex-start',
        fontSize: '13px',
      }}
    >
      <legend
        style={{
          textAlign: 'right',
          padding: '0.5vw',
          fontSize: '13px',
          fontWeight: '500',
        }}
      >
        {instructorComment.author} ·{' '}
        {moment(instructorComment.timestamp).diff(moment(), 'days') < 7
          ? moment(instructorComment.timestamp).fromNow()
          : moment(instructorComment.timestamp).format('DD-MM-YYYY hh:mm')}
      </legend>
      <Text>{instructorComment.text}</Text>
    </fieldset>
  )
}
