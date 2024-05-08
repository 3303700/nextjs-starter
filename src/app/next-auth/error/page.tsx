import CustomErrorPage from '@/components/shared/custom-error-page'
import { type PropsWithSearchParams } from '@/lib/utils-vanilla'

export default function Page({ searchParams }: PropsWithSearchParams) {
  const error =
    searchParams['error'] === 'Verification'
      ? '유효하지 않은 토큰입니다 🚫'
      : '유효하지 않은 요청입니다 🚫'

  return <CustomErrorPage>{error}</CustomErrorPage>
}
