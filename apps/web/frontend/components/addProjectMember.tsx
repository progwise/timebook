import { Button, InputField } from '@progwise/timebook-ui'
import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

export const AddProjectMember = () => {
  const [email, setEmail] = useState('')

  return (
    <div className="w-[66%]">
      <form className="flex items-center gap-2 p-2" onSubmit={console.log}>
        <Button type="submit" disabled={!email} variant="primary" className=" flex h-[64px] w-[64px] rounded-full">
          <AiOutlinePlus className="fill-white" size="2.5em" />
        </Button>
        <InputField
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          variant="primary"
          placeholder="Enter your email address to join the project"
          className=" dark:bg-slate-800 dark:text-white"
        />
      </form>
    </div>
  )
}
