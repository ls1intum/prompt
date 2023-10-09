import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor, BubbleMenu } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  ColorPicker,
  Group,
  Select,
  Stack,
  Tabs,
  Text,
} from '@mantine/core'
import { MailTemplate, fetchMailTemplate, updateMailTemplate } from '../../service/mailingService'
import { useEffect, useState } from 'react'
import { IconEyeCheck, IconHtml, IconInfoCircle } from '@tabler/icons-react'
import {
  StudentAndCourseIterationInstructions,
  StudentAndCourseIterationAndDeveloperApplicationInstructions,
  ThesisApplicationAndStudentAndThesisAdvisorInstructions,
  ThesisApplicationAndStudentInstructions,
  StudentAndCourseIterationAndCoachApplicationInstructions,
  StudentAndCourseIterationAndTutorApplicationInstructions,
  fillMockStudentPlaceholders,
  fillMockCourseIterationPlaceholders,
  fillMockThesisAdvisorPlaceholders,
  fillMockThesisApplicationPlaceholders,
  fillDeveloperApplicationPlaceholders,
  fillMockCoachApplicationPlaceholders,
  fillMockTutorApplicationPlaceholders,
} from './components/TemplateInstructions'

export const MailingManagementConsole = (): JSX.Element => {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
  const [instructionsOpened, setInstructionsOpened] = useState(false)
  const [activeTab, setActiveTab] = useState<string | null>('editor')
  const [previewContent, setPreviewContent] = useState<string>('')
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      ColorPicker,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  })

  useEffect(() => {
    void (async () => {
      if (activeTemplate) {
        const response = await fetchMailTemplate(activeTemplate)
        if (response) {
          editor?.chain().setContent(response).run()
        }
      }
    })()
  }, [editor, activeTemplate])

  useEffect(() => {
    if (activeTab === 'preview') {
      let preview = fillMockStudentPlaceholders(editor?.getHTML() ?? '')
      preview = fillMockCourseIterationPlaceholders(preview)
      if (
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.THESIS_APPLICATION_CONFIRMATION ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.THESIS_APPLICATION_CREATED ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.THESIS_APPLICATION_ACCEPTANCE ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.THESIS_APPLICATION_REJECTION ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.THESIS_APPLICATION_ACCEPTANCE_NO_ADVISOR
      ) {
        preview = fillMockThesisAdvisorPlaceholders(preview)
        preview = fillMockThesisApplicationPlaceholders(preview)
      }
      if (
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.DEVELOPER_APPLICATION_CONFIRMATION ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.TECHNICAL_DETAILS_SUBMISSION_INVIATION ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.KICK_OFF_SUBMISSION_INVITATION
      ) {
        preview = fillDeveloperApplicationPlaceholders(preview)
      }
      if (
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.COACH_APPLICATION_ACCEPTANCE ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.COACH_APPLICATION_REJECTION ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.COACH_APPLICATION_CONFIRMATION ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.COACH_INTERVIEW_INVITATION
      ) {
        preview = fillMockCoachApplicationPlaceholders(preview)
      }
      if (
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.TUTOR_APPLICATION_ACCEPTANCE ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.TUTOR_APPLICATION_REJECTION ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.TUTOR_APPLICATION_CONFIRMATION ||
        MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
          MailTemplate.TUTOR_INTERVIEW_INVITATION
      ) {
        preview = fillMockTutorApplicationPlaceholders(preview)
      }
      setPreviewContent(preview)
    }
  }, [activeTab])

  return (
    <Stack>
      <Group style={{ alignItems: 'end' }}>
        <Select
          style={{ width: '60vw' }}
          label='Template'
          placeholder='Template'
          data={Object.keys(MailTemplate).map((key) => {
            return {
              label: MailTemplate[key as keyof typeof MailTemplate],
              value: key,
            }
          })}
          value={activeTemplate}
          onChange={(value) => {
            setActiveTab('editor')
            setActiveTemplate(value as MailTemplate)
          }}
        />
        <ActionIcon
          size={36}
          color='blue'
          variant='filled'
          onClick={() => {
            setInstructionsOpened(!instructionsOpened)
          }}
        >
          <IconInfoCircle />
        </ActionIcon>
      </Group>
      <Collapse in={instructionsOpened}>
        <Card>
          <Text fz='xs'>
            For the below template you can use the following placeholders. Please wrap each accessor
            with double curly brackets.
          </Text>
          {(MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
            MailTemplate.TECHNICAL_DETAILS_SUBMISSION_INVIATION ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.KICK_OFF_SUBMISSION_INVITATION ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.COACH_INTERVIEW_INVITATION ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.TUTOR_INTERVIEW_INVITATION ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.COACH_APPLICATION_ACCEPTANCE ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.TUTOR_APPLICATION_ACCEPTANCE ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.COACH_APPLICATION_REJECTION ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.TUTOR_APPLICATION_REJECTION) && (
            <StudentAndCourseIterationInstructions />
          )}
          {MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
            MailTemplate.DEVELOPER_APPLICATION_CONFIRMATION && (
            <StudentAndCourseIterationAndDeveloperApplicationInstructions />
          )}
          {MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
            MailTemplate.COACH_APPLICATION_CONFIRMATION && (
            <StudentAndCourseIterationAndCoachApplicationInstructions />
          )}
          {MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
            MailTemplate.TUTOR_APPLICATION_CONFIRMATION && (
            <StudentAndCourseIterationAndTutorApplicationInstructions />
          )}
          {(MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
            MailTemplate.THESIS_APPLICATION_ACCEPTANCE_NO_ADVISOR ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.THESIS_APPLICATION_REJECTION ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.THESIS_APPLICATION_CONFIRMATION ||
            MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
              MailTemplate.THESIS_APPLICATION_CREATED) && (
            <ThesisApplicationAndStudentInstructions />
          )}
          {MailTemplate[activeTemplate as keyof typeof MailTemplate] ===
            MailTemplate.THESIS_APPLICATION_ACCEPTANCE && (
            <ThesisApplicationAndStudentAndThesisAdvisorInstructions />
          )}
        </Card>
      </Collapse>
      <Tabs
        defaultValue='editor'
        value={activeTab}
        onTabChange={(value) => {
          setActiveTab(value)
        }}
      >
        <Tabs.List>
          <Tabs.Tab value='editor' icon={<IconHtml size='0.8rem' />}>
            Editor
          </Tabs.Tab>
          <Tabs.Tab value='preview' icon={<IconEyeCheck size='0.8rem' />}>
            Preview
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='editor' pt='xs'>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
                <RichTextEditor.H5 />
                <RichTextEditor.H6 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.ColorPicker
                  colors={[
                    '#25262b',
                    '#868e96',
                    '#fa5252',
                    '#e64980',
                    '#be4bdb',
                    '#7950f2',
                    '#4c6ef5',
                    '#228be6',
                    '#15aabf',
                    '#12b886',
                    '#40c057',
                    '#82c91e',
                    '#fab005',
                    '#fd7e14',
                  ]}
                />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            {editor && (
              <BubbleMenu editor={editor}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Link />
                </RichTextEditor.ControlsGroup>
              </BubbleMenu>
            )}
            <RichTextEditor.Content />
          </RichTextEditor>
        </Tabs.Panel>
        <Tabs.Panel value='preview' pt='xs'>
          <Card>
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
          </Card>
        </Tabs.Panel>
      </Tabs>
      <Group
        position='right'
        onClick={() => {
          void (async () => {
            if (activeTemplate) {
              await updateMailTemplate(activeTemplate, editor?.getHTML() ?? '')
            }
          })()
        }}
      >
        <Button>Save</Button>
      </Group>
    </Stack>
  )
}
