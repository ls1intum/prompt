import { Text } from '@mantine/core'
import { type StudentApplicationNote } from '../redux/studentApplicationSlice/studentApplicationSlice'
import moment from 'moment'

interface StudentApplicationCommentProps {
  studentApplicationComment: StudentApplicationNote
}

export const StudentApplicationComment = ({
  studentApplicationComment,
}: StudentApplicationCommentProps): JSX.Element => {
  return (
    <fieldset
      style={{
        textAlign: 'center',
        borderRadius: '0.25rem',
        borderWidth: '0.0625rem solid #373A40',
        display: 'flex',
        justifyContent: 'flex-start',
        fontSize: '14px',
      }}
    >
      <legend style={{ textAlign: 'left', padding: '0.5vw', fontSize: '14px', fontWeight: '500' }}>
        {studentApplicationComment.author.username} ·{' '}
        {moment(studentApplicationComment.timestamp).format('DD-MM-YYYY hh:mm')}
      </legend>
      <Text>{studentApplicationComment.comment}</Text>
    </fieldset>
  )
}
