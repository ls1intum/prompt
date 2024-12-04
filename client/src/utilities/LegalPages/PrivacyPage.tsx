import { Container, Title, Text, Stack, List, Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../LandingPage/components/Footer'
import * as styles from './LegalPages.module.scss'

export const PrivacyPage = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Container size='lg' py='xl'>
          <Button
            leftSection={<IconArrowLeft size={14} />}
            variant='subtle'
            onClick={() => navigate(-1)}
            mb='xl'
          >
            Back
          </Button>
          <Stack>
            <Title order={1}>Privacy</Title>

            <Text>
              The Research Group for Applied Education Technologies (referred to as AET in the
              following paragraphs) from the Technical University of Munich takes the protection of
              private data seriously. We process the automatically collected personal data obtained
              when you visit our website, in compliance with the applicable data protection
              regulations, in particular the Bavarian Data Protection (BayDSG), the Telemedia Act
              (TMG) and the General Data Protection Regulation (GDPR). Below, we inform you about
              the type, scope and purpose of the collection and use of personal data.
            </Text>

            <Stack>
              <Title order={2}>Logging</Title>
              <Text>
                The web servers of the AET are operated by the AET itself, based in Boltzmannstr. 3,
                85748 Garching b. Munich. Every time our website is accessed, the web server
                temporarily processes the following information in log files:
              </Text>
              <List>
                <List.Item>IP address of the requesting computer</List.Item>
                <List.Item>Date and time of access</List.Item>
                <List.Item>Name, URL and transferred data volume of the accessed file</List.Item>
                <List.Item>Access status (requested file transferred, not found etc.)</List.Item>
                <List.Item>
                  Identification data of the browser and operating system used (if transmitted by
                  the requesting web browser)
                </List.Item>
                <List.Item>
                  Website from which access was made (if transmitted by the requesting web browser)
                </List.Item>
              </List>
              <Text>The processing of the data in this log file takes place as follows:</Text>
              <List>
                <List.Item>
                  The log entries are continuously updated automatically evaluated in order to be
                  able to detect attacks on the web server and react accordingly.
                </List.Item>
                <List.Item>
                  In individual cases, i.e. in the case of reported disruptions, errors and security
                  incidents, a manual analysis is carried out.
                </List.Item>
                <List.Item>
                  The IP addresses contained in the log entries are not merged with other databases
                  by AET, so that no conclusions can be drawn about individual persons.
                </List.Item>
              </List>
            </Stack>

            <Stack>
              <Title order={2}>Use and transfer of personal data</Title>
              <Text>
                Our website can be used without providing personal data. All services that might
                require any form of personal data (e.g. registration for events, contact forms) are
                offered on external sites, linked here. The use of contact data published as part of
                the imprint obligation by third parties to send unsolicited advertising and
                information material is hereby prohibited. The operators of the pages reserve the
                right to take legal action in the event of the unsolicited sending of advertising
                information, such as spam mails.
              </Text>
            </Stack>

            <Stack>
              <Title order={2}>Revocation of your consent to data processing</Title>
              <Text>
                Some data processing operations require your express consent possible. You can
                revoke your consent that you have already given at any time. A message by e-mail is
                sufficient for the revocation. The lawfulness of the data processing that took place
                up until the revocation remains unaffected by the revocation.
              </Text>
            </Stack>

            <Stack>
              <Title order={2}>
                Right to file a complaint with the responsible supervisory authority
              </Title>
              <Text>
                You have the right to lodge a complaint with the responsible supervisory authority
                in the event of a breach of data protection law. The responsible supervisory
                authority with regard to data protection issues is the Federal Commissioner for Data
                Protection and Freedom of Information of the state where our company is based. The
                following link provides a list of data protection authorities and their contact
                details: <br />
                <a
                  href='https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html
                </a>
              </Text>
            </Stack>

            <Stack>
              <Title order={2}>Right to data portability</Title>
              <Text>
                You have the right to request the data that we process automatically on the basis of
                your consent or in fulfillment of a contract to be handed over to you or a third
                party. The data is provided in a machine-readable format. If you request the direct
                transfer of the data to another person responsible, this will only be done if it is
                technically feasible.
              </Text>
            </Stack>

            <Stack>
              <Title order={2}>Right to information, correction, blocking, and deletion</Title>
              <Text>
                You have at any time within the framework of the applicable legal provisions the
                right to request information about your stored personal data, the origin of the
                data, its recipient and the purpose of the data processing, and if necessary, a
                right to correction, blocking or deletion of this data. You can contact us at any
                time via ls1.admin@in.tum.de regarding this and other questions on the subject of
                personal data.
              </Text>
            </Stack>

            <Stack>
              <Title order={2}>SSL/TLS encryption</Title>
              <Text>
                For security reasons and to protect the transmission of confidential content that
                you send to us send as a site operator, our website uses an SSL/TLS encryption. This
                means that data that you transmit via this website cannot be read by third parties.
                You can recognize an encrypted connection by the "https://" address line in your
                browser and by the lock symbol in the browser line.
              </Text>
            </Stack>

            <Stack>
              <Title order={2}>E-mail security</Title>
              <Text>
                If you e-mail us, your e-mail address will only be used for correspondence with you.
                Please note that data transmission on the Internet can have security gaps. Complete
                protection of data from access by third parties is not possible.
              </Text>
            </Stack>
          </Stack>
        </Container>
      </div>
      <Footer />
    </div>
  )
}
