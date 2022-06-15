import { Dialog } from '@headlessui/react'
import { ReactNode } from 'react'

interface ModalProps {
  open?: boolean
  onClose?: () => void
  title: string
  actions: JSX.Element
  variant?: 'oneColumn' | 'twoColumns'
  children?: ReactNode
}

export const Modal = ({
  open = true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  title,
  actions,
  children,
  variant = 'oneColumn',
}: ModalProps): JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative rounded-3xl bg-white p-7 shadow-lg  dark:bg-slate-800">
          <div className={`grid grid-cols-1 gap-8 ${variant === 'twoColumns' ? 'sm:grid-cols-2' : ''}`}>
            <div>
              <Dialog.Title className="text-xl">{title}</Dialog.Title>
            </div>
            {children && <div className="row-span-2">{children}</div>}
            <div className="flex flex-col flex-wrap gap-4 self-end sm:flex-row sm:justify-end">{actions}</div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
