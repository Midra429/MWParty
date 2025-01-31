import type { ModalProps as HeroUiModalProps } from '@heroui/react'

import {
  Modal as HeroUiModal,
  ModalContent as HeroUiModalContent,
  ModalHeader as HeroUiModalHeader,
  ModalBody as HeroUiModalBody,
  ModalFooter as HeroUiModalFooter,
} from '@heroui/react'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/Button'

export type ModalProps = {
  fullWidth?: boolean

  isOpen: HeroUiModalProps['isOpen']
  onOpenChange: HeroUiModalProps['onOpenChange']
  onClose?: HeroUiModalProps['onClose']

  okText?: string
  okIcon?: React.ReactNode
  isOkDisabled?: boolean
  onOk?: () => void | Promise<void>

  cancelText?: string
  cancelIcon?: React.ReactNode

  header?: React.ReactNode
  headerEndContent?: React.ReactNode

  footer?: React.ReactNode
  footerStartContent?: React.ReactNode

  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = (props) => {
  return (
    <HeroUiModal
      classNames={{
        wrapper: 'justify-end',
        base: !props.fullWidth && 'max-w-[370px]',
        header: 'border-b-1 border-foreground-200 p-2 text-medium',
        body: 'p-0',
        footer: 'border-t-1 border-foreground-200 p-2',
      }}
      size="full"
      hideCloseButton
      isKeyboardDismissDisabled={true}
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      onClose={props.onClose}
    >
      <HeroUiModalContent>
        {(onClose) => (
          <>
            {props.header && (
              <HeroUiModalHeader className="flex flex-row justify-between">
                <div className="flex min-h-8 flex-row items-center">
                  {props.header}
                </div>

                <div className="flex h-full shrink-0 flex-row gap-2 font-normal">
                  {props.headerEndContent}
                </div>
              </HeroUiModalHeader>
            )}

            <HeroUiModalBody className="max-h-full gap-0 overflow-auto bg-background">
              {props.children}
            </HeroUiModalBody>

            {props.footer !== false && (
              <HeroUiModalFooter className="justify-between">
                <div className="flex flex-row gap-2">
                  {props.footerStartContent}
                </div>

                <div className="flex flex-row gap-2">
                  {props.footer ?? (
                    <>
                      <Button
                        size="sm"
                        variant="flat"
                        color="default"
                        startContent={props.cancelIcon || <XIcon />}
                        onPress={onClose}
                      >
                        {props.cancelText || 'キャンセル'}
                      </Button>

                      {props.onOk && (
                        <Button
                          size="sm"
                          color="primary"
                          isDisabled={props.isOkDisabled}
                          startContent={props.okIcon}
                          onPress={async () => {
                            await props.onOk?.()

                            onClose()
                          }}
                        >
                          {props.okText || 'OK'}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </HeroUiModalFooter>
            )}
          </>
        )}
      </HeroUiModalContent>
    </HeroUiModal>
  )
}
