import { Container, Title, Text, Stack, List, Button, Paper } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../LandingPage/components/Footer'
import * as styles from './LegalPages.module.scss'

export const ImprintPage = (): JSX.Element => {
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
            <Title order={1}>Imprint</Title>

            <Paper shadow='xs' p='md'>
              <Stack>
                <Title order={2}>Publisher</Title>
                <Text>
                  Technical University of Munich
                  <br />
                  Postal address: Arcisstrasse 21, 80333 Munich
                  <br />
                  Telephone: +49-(0)89-289-01
                  <br />
                  Fax: +49-(0)89-289-22000
                  <br />
                  Email: poststelle(at)tum.de
                </Text>
              </Stack>
            </Paper>

            <Paper shadow='xs' p='md'>
              <Stack>
                <Title order={2}>Authorized to represent</Title>
                <Text>
                  The Technical University of Munich is legally represented by the President Prof.
                  Dr. Thomas F. Hofmann.
                </Text>
              </Stack>
            </Paper>

            <Paper shadow='xs' p='md'>
              <Stack>
                <Title order={2}>VAT identification number</Title>
                <Text>DE811193231 (in accordance with § 27a of the German VAT tax act - UStG)</Text>
              </Stack>
            </Paper>

            <Paper shadow='xs' p='md'>
              <Stack>
                <Title order={2}>Responsible for content</Title>
                <Text>
                  Prof. Dr. Stephan Krusche
                  <br />
                  Boltzmannstrasse 3<br />
                  85748 Garching
                </Text>
              </Stack>
            </Paper>

            <Paper shadow='xs' p='md'>
              <Stack>
                <Title order={2}>Terms of use</Title>
                <Text>
                  Texts, images, graphics as well as the design of these Internet pages may be
                  subject to copyright. The following are not protected by copyright according to §5
                  of copyright law (Urheberrechtsgesetz (UrhG)).
                </Text>
                <Text>
                  Laws, ordinances, official decrees and announcements as well as decisions and
                  officially written guidelines for decisions and other official works that have
                  been published in the official interest for general knowledge, with the
                  restriction that the provisions on prohibition of modification and indication of
                  source in Section 62 (1) to (3) and Section 63 (1) and (2) UrhG apply accordingly.
                </Text>
                <Text>
                  As a private individual, you may use copyrighted material for private and other
                  personal use within the scope of Section 53 UrhG. Any duplication or use of
                  objects such as images, diagrams, sounds or texts in other electronic or printed
                  publications is not permitted without our agreement. This consent will be granted
                  upon request by the person responsible for the content. The reprinting and
                  evaluation of press releases and speeches are generally permitted with reference
                  to the source. Furthermore, texts, images, graphics and other files may be subject
                  in whole or in part to the copyright of third parties. The persons responsible for
                  the content will also provide more detailed information on the existence of
                  possible third-party rights.
                </Text>
              </Stack>
            </Paper>

            <Paper shadow='xs' p='md'>
              <Stack>
                <Title order={2}>Liability disclaimer</Title>
                <Text>
                  The information provided on this website has been collected and verified to the
                  best of our knowledge and belief. However, there will be no warranty that the
                  information provided is up-to-date, correct, complete, and available. There is no
                  contractual relationship with users of this website.
                </Text>
                <Text>
                  We accept no liability for any loss or damage caused by using this website. The
                  exclusion of liability does not apply where the provisions of the German Civil
                  Code (BGB) on liability in case of breach of official duty are applicable (§ 839
                  of the BGB). We accept no liability for any loss or damage caused by malware when
                  accessing or downloading data or the installation or use of software from this
                  website.
                </Text>
                <Text>
                  Where necessary in individual cases: the exclusion of liability does not apply to
                  information governed by the Directive 2006/123/EC of the European Parliament and
                  of the Council. This information is guaranteed to be accurate and up to date.
                </Text>
              </Stack>
            </Paper>

            <Paper shadow='xs' p='md'>
              <Stack>
                <Title order={2}>Links</Title>
                <Text>
                  Our own content is to be distinguished from cross-references ("links") to websites
                  of other providers. These links only provide access for using third-party content
                  in accordance with § 8 of the German telemedia act (TMG). Prior to providing links
                  to other websites, we review third-party content for potential civil or criminal
                  liability. However, a continuous review of third-party content for changes is not
                  possible, and therefore we cannot accept any responsibility. For illegal,
                  incorrect, or incomplete content, including any damage arising from the use or
                  non-use of third-party information, liability rests solely with the provider of
                  the website.
                </Text>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </div>
      <Footer />
    </div>
  )
}
