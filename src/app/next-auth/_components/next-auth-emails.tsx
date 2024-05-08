import { Body, Button, Container, Html, Text } from '@react-email/components'

export default function NextAuthSigninLinkEmail({ url }: { url: string }) {
  return (
    <Html lang='ko'>
      <Body>
        <Container
          style={{
            width: '50%',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Button href={url}>클릭하여 로그인</Button>
          <Text>위 링크는 일회성이며 24시간 동안 유효합니다</Text>
        </Container>
      </Body>
    </Html>
  )
}
