'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { EnvelopeClosedIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaGoogle } from 'react-icons/fa6'

import ActionButton from '@/components/my-shadcn-ui/action-button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/my-shadcn-ui/form'
import FormButton from '@/components/my-shadcn-ui/form-button'
import { Input } from '@/components/my-shadcn-ui/input'
import FormRootErrorMessage from '@/components/shared/form-root-error-message'
import { useMySearchParams } from '@/hooks/use-next'
import { PAGE_HOME, SEARCH_PARAM_CALLBACK_URL } from '@/lib/constants'
import { cn, fontPoppins } from '@/lib/utils'
import { utilSleep } from '@/lib/utils-vanilla'

import {
  nextAuthActionSigninWithMagicLink,
  nextAuthActionSigninWithOauth,
} from '../_components/next-auth.actions'
import { nextAuthSchemaSigninWithMaglicLinkInput } from '../_components/next-auth.schemas'
import { NextAuthSchemaSigninWithMagicLinkInput } from '../_components/next-auth.types'

export default function NextAuthSigninForm({
  useMagicLinkSignin = false,
}: {
  useMagicLinkSignin?: boolean
}) {
  const [enabled, setEnabled] = useState(true)

  const [pending, setPending] = useState(false)

  const [emailSended, setEmailSended] = useState('')

  const { searchParams } = useMySearchParams()

  const redirectTo = searchParams.get(SEARCH_PARAM_CALLBACK_URL) || PAGE_HOME

  const form = useForm<NextAuthSchemaSigninWithMagicLinkInput>({
    mode: 'onBlur',

    resolver: zodResolver(nextAuthSchemaSigninWithMaglicLinkInput),

    defaultValues: {
      email: '',
    },
  })

  const { mutateAsync: signinWithMagicLink } = useMutation({
    mutationFn: (data: NextAuthSchemaSigninWithMagicLinkInput) =>
      nextAuthActionSigninWithMagicLink(data),

    onSettled: async res => {
      if (res?.errors) {
        setPending(false)

        setEnabled(true)

        form.setError('root', {
          message: res.errors.error?.message,
        })
      }

      if (res?.data?.email) {
        setEmailSended(res.data.email)
      }
    },
  })

  async function onSubmit(data: NextAuthSchemaSigninWithMagicLinkInput) {
    setPending(true)

    setEnabled(false)

    await Promise.all([signinWithMagicLink(data)])
  }

  const {
    formState: { errors, isDirty, isValid },
  } = form

  if (emailSended) {
    return (
      <div className='container flex h-full w-full flex-col items-center justify-center gap-2'>
        <div className='flex items-center'>
          <EnvelopeClosedIcon className='mr-2 h-4 w-4 animate-bounce' />
          <span>{emailSended}에 로그인 링크를 보냈습니다.</span>
        </div>
        <Link
          href={PAGE_HOME}
          className='text-muted-foreground underline underline-offset-4'
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className='container flex h-full w-full flex-col items-center justify-center gap-4 sm:w-[350px]'>
      <h1 className={cn('text-2xl font-semibold', fontPoppins.className)}>
        🔏AUTH
      </h1>

      <div className='flex w-full gap-4 sm:flex-col'>
        <ActionButton
          action={async () => {
            setEnabled(false)

            await Promise.all([
              nextAuthActionSigninWithOauth({
                provider: 'github',
                redirectTo,
              }),
              utilSleep(1500),
            ])
          }}
          enabled={enabled}
          size={'lg'}
          className='w-full'
        >
          <GitHubLogoIcon className='h-4 w-4 sm:mr-2' />
          <span className='hidden text-xs sm:block'>
            Github 계정으로 계속하기
          </span>
        </ActionButton>

        <ActionButton
          action={async () => {
            setEnabled(false)

            await Promise.all([
              nextAuthActionSigninWithOauth({
                provider: 'google',
                redirectTo,
              }),
              utilSleep(1500),
            ])
          }}
          enabled={enabled}
          size={'lg'}
          className='w-full'
        >
          <FaGoogle className='h-4 w-4 sm:mr-2' />
          <span className='hidden text-xs sm:block'>
            Google 계정으로 계속하기
          </span>
        </ActionButton>
      </div>

      <span className='text-muted-foreground sm:hidden'>로 계속하기</span>

      {useMagicLinkSignin && (
        <>
          <div>또는</div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full flex-col gap-4'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='이메일 주소'
                          type='email'
                          autoComplete='email'
                          {...field}
                        />
                      </FormControl>

                      {errors.email ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          로그인 링크를 받을 이메일 주소입니다.
                        </FormDescription>
                      )}
                    </FormItem>
                  )
                }}
              />

              <FormRootErrorMessage message={errors.root?.message} />

              <FormButton
                pending={pending}
                isValid={isValid}
                isDirty={isDirty}
                isDisabled={!enabled}
                size={'lg'}
              >
                <EnvelopeClosedIcon className='mr-2 h-4 w-4' />
                이메일 주소로 계속하기
              </FormButton>
            </form>
          </Form>
        </>
      )}
    </div>
  )
}
