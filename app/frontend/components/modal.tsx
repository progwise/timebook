import { Dialog } from '@headlessui/react'
import { ReactNode } from 'react'

interface ModalProps {
  open?: boolean
  onClose?: () => void
  title: string
  actions: JSX.Element
  children?: ReactNode
}

export const Modal = ({
  open = true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  title,
  actions,
  children,
}: ModalProps): JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed  inset-0 overflow-y-auto">
      <div className="flex min-h-screen items-center  justify-center">
        <Dialog.Overlay className="fixed inset-0  bg-black opacity-30" />
        <div className="relative rounded-3xl bg-white p-7 shadow-lg  dark:bg-slate-800">
          <Dialog.Title className="text-center text-lg">{title}</Dialog.Title>
          {children}
          <div className="flex flex-col flex-wrap gap-4 pt-5 sm:flex-row sm:justify-end">{actions}</div>
        </div>
      </div>
    </Dialog>
  )
}
