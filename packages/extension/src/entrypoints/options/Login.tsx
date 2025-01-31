import { Tabs, Tab } from "@heroui/react"
import { SignUp, SignIn } from '@clerk/chrome-extension'

export const Login: React.FC = () => {
  return (
    <Tabs
      classNames={{
        wrapper: 'mx-auto flex size-fit flex-col gap-3 py-20',
        tabList: 'bg-content1 shadow-small',
        panel: 'p-0',
      }}
      radius="full"
      color="primary"
      placement="top"
      fullWidth
    >
      <Tab key="sign-up" title="アカウント作成">
        <SignUp />
      </Tab>

      <Tab key="sign-in" title="ログイン">
        <SignIn />
      </Tab>
    </Tabs>
  )
}
