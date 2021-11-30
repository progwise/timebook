import { Dialog } from '@headlessui/react'
import { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  actions: JSX.Element
  children?: ReactNode
}

export const Modal = ({ open, onClose, title, actions, children }: ModalProps): JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-3xl p-7 shadow-lg">
          <Dialog.Title className="text-center text-lg">{title}</Dialog.Title>
          {children}
          <div className="flex gap-4 pt-5 flex-wrap flex-col sm:flex-row sm:justify-end">{actions}</div>
        </div>
      </div>
    </Dialog>
  )
}
