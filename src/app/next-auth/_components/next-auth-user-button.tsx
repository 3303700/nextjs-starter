'use client'

import { ExitIcon, GearIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import ActionButton from '@/components/my-shadcn-ui/action-button'
import { Button } from '@/components/my-shadcn-ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/my-shadcn-ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/my-shadcn-ui/dropdown-menu'
import { Input } from '@/components/my-shadcn-ui/input'
import { TooltipWrapper } from '@/components/my-shadcn-ui/tooltip-wrapper'
import { UserAvatar } from '@/components/my-shadcn-ui/user-avatar'
import useMyProgressBarRouter from '@/hooks/use-progress-router'
import { cn, fontPoppins } from '@/lib/utils'
import { utilSleep } from '@/lib/utils-vanilla'

import NextAuthEditUserForm from './next-auth-edit-user-form'
import NextAuthSigninLink from './next-auth-signin-link'
import {
  nextAuthActionDeleteUser,
  nextAuthActionSignout,
} from './next-auth.actions'
import {
  useNextAuthCacheUpdater,
  useNextAuthGetSessionUserOrNull,
} from './next-auth.queries'

const DELETE_CONFIRM = '이 계정을 삭제합니다'

export default function NextAuthUserButton() {
  const [open, setOpen] = useState(false)

  const [enabled, setEnabled] = useState(true)

  const [deleteConfirm, setDeleteConfirm] = useState('')

  const { data: sessionUser } = useNextAuthGetSessionUserOrNull()

  const { removeGetSessionUserOrNull } = useNextAuthCacheUpdater()

  const { router } = useMyProgressBarRouter()

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: () => nextAuthActionDeleteUser(),

    onSettled: async res => {
      if (res?.errors) {
        setEnabled(true)
      } else {
        await utilSleep(750)

        removeGetSessionUserOrNull()

        router.refresh()
      }
    },
  })

  if (sessionUser) {
    const { image, name, email } = sessionUser

    return (
      <Dialog>
        <DropdownMenu
          open={open}
          onOpenChange={setOpen}
        >
          <DropdownMenuTrigger className='focus-visible:outline-none'>
            <UserAvatar
              className={cn(
                'h-7 w-7 select-none transition-all hover:animate-pulse hover:ring-2',
                open && 'ring-2',
              )}
              image={image}
              name={name}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align='end'
            className='w-[150px]'
          >
            <div className='flex flex-col p-2 text-sm'>
              <TooltipWrapper tooltipContent={name}>
                <p className='truncate'>{name}</p>
              </TooltipWrapper>

              <TooltipWrapper tooltipContent={email}>
                <p className='truncate text-muted-foreground'>{email}</p>
              </TooltipWrapper>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <DialogTrigger className='group w-full'>
                <div className='flex items-center'>
                  <GearIcon className='mr-2 group-hover:animate-bounce' />
                  설정
                </div>
              </DialogTrigger>
            </DropdownMenuItem>

            <DropdownMenuItem
              className='group'
              onClick={() => nextAuthActionSignout()}
            >
              <ExitIcon className='mr-2 group-hover:animate-bounce' />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className='max-w-xl'>
          <DialogHeader>
            <span className='group flex items-center'>
              <GearIcon className='mr-2 group-hover:animate-spin' />
              설정
            </span>
          </DialogHeader>

          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <span className={cn(fontPoppins.className)}>계정 정보 변경</span>

              {name && (
                <NextAuthEditUserForm
                  data={{
                    name,
                  }}
                />
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <span className={cn('text-destructive', fontPoppins.className)}>
                Danger Zone
              </span>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'destructive'}
                    className='w-1/2 self-end sm:w-1/3'
                  >
                    계정 삭제
                  </Button>
                </DialogTrigger>

                <DialogContent className='flex flex-col text-balance'>
                  <span
                    className={cn('text-destructive', fontPoppins.className)}
                  >
                    {email} 계정이 삭제됩니다. 이 작업은 즉시 실행되며 되돌릴 수
                    없습니다. 이 계정의 모든 리소스는 삭제되거나 비활성화
                    됩니다.
                  </span>

                  <div className='space-y-1'>
                    <span className='text-sm text-muted-foreground'>
                      {`아래 입력창에 '${DELETE_CONFIRM}'를 입력한 뒤 확인을 클릭하면 계정이 완전히 삭제 됩니다`}
                    </span>

                    <Input
                      value={deleteConfirm}
                      onChange={e => setDeleteConfirm(e.target.value)}
                      placeholder={DELETE_CONFIRM}
                      disabled={!enabled}
                    />
                  </div>

                  <div className='flex justify-end gap-2'>
                    <DialogClose asChild>
                      <Button disabled={!enabled}>취소</Button>
                    </DialogClose>

                    <ActionButton
                      action={async () => {
                        setEnabled(false)

                        await Promise.all([deleteUser(), utilSleep(1500)])
                      }}
                      disabled={deleteConfirm !== DELETE_CONFIRM}
                      enabled={enabled}
                      variant={'destructive'}
                    >
                      확인
                    </ActionButton>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  } else {
    return <NextAuthSigninLink />
  }
}
