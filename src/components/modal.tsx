import { useState, Fragment, ReactElement, useEffect, useRef, LegacyRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'

type ModalProps = {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  title: string | ReactElement;
  children: React.ReactElement;
}
export default function Modal({
  isOpen,
  onClose,
  title,
  children
}: ModalProps) {

  const panelRef = useRef<HTMLElement>(null);
  function onMouseleave(e) {
    console.log("left");

  }

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current?.addEventListener("mouseleave", onMouseleave)
    }
  }, [panelRef.current])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel ref={panelRef} className="transform overflow-hidden rounded-2xl bg-dark p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  {title}
                </Dialog.Title>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}