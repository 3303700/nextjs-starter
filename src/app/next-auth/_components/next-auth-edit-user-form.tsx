'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
import { utilSleep } from '@/lib/utils-vanilla'

import { nextAuthActionUpdateUser } from './next-auth.actions'
import { useNextAuthCacheUpdater } from './next-auth.queries'
import { nextAuthSchemaUpdateUserInput } from './next-auth.schemas'
import type { NextAuthSchemaUpdateUserInput } from './next-auth.types'

export default function NextAuthEditUserForm({
  data: { name },
}: {
  data: NextAuthSchemaUpdateUserInput
}) {
  const [pending, setPending] = useState(false)

  const form = useForm<NextAuthSchemaUpdateUserInput>({
    mode: 'onChange',

    resolver: zodResolver(nextAuthSchemaUpdateUserInput),

    defaultValues: {
      name,
    },
  })

  const { updateGetSessionUserOrNull } = useNextAuthCacheUpdater()

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: (data: NextAuthSchemaUpdateUserInput) =>
      nextAuthActionUpdateUser(data),

    onSettled: async res => {
      if (res?.errors) {
        form.setError('root', {
          message: res.errors.error?.message,
        })
      }

      if (res?.data?.updatedUser) {
        const updatedUser = res.data.updatedUser

        await Promise.all([updateGetSessionUserOrNull(updatedUser)])

        form.reset({ name: updatedUser.name || name })
      }
    },
  })

  const {
    formState: { errors, isValid, isDirty },
  } = form

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async data => {
          setPending(true)

          await Promise.all([updateUser(data), utilSleep(1500)])

          setPending(false)
        })}
        className='flex flex-col gap-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder='이름'
                />
              </FormControl>

              {errors.name ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  다른 사용자들에게 표시되는 이름입니다.
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        <FormRootErrorMessage message={errors.root?.message} />

        <FormButton
          className='w-1/2 self-end sm:w-1/3'
          pending={pending}
          isDirty={isDirty}
          isValid={isValid}
        >
          변경사항 저장
        </FormButton>
      </form>
    </Form>
  )
}
