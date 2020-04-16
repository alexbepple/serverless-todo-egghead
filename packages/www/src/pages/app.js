import React, { useContext, useRef, useState } from 'react'
import { Container, Checkbox, Flex, Label, Input, Button } from 'theme-ui'
import { IdentityContext } from '../../identity-context'

const ToDoList = () => {
  const [todos, setTodos] = useState([])
  const inputRef = useRef()
  return (
    <Container>
      <Flex
        as="form"
        onSubmit={(e) => {
          e.preventDefault()
          const newTodo = { done: false, value: inputRef.current.value }
          setTodos([newTodo, ...todos])
          inputRef.current.value = ''
        }}
      >
        <Label sx={{ display: 'flex' }}>
          <span>Add todo</span>
          <Input ref={inputRef} sx={{ marginLeft: 1 }}></Input>
        </Label>
        <Button sx={{ marginLeft: 1 }}>Add</Button>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <ul sx={{ listStyleType: 'none' }}>
          {todos.map((todo) => (
            <Flex as="li">
              <Checkbox checked={todo.done}></Checkbox>
              <span>{todo.value}</span>
            </Flex>
          ))}
        </ul>
      </Flex>
    </Container>
  )
}

export default (props) => {
  const { user } = useContext(IdentityContext)
  if (user) {
    return <ToDoList />
  }
  return <div>You need to log in.</div>
}
