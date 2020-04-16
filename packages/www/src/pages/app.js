import React, { useContext, useRef, useReducer } from 'react'
import { Container, Checkbox, Flex, Label, Input, Button } from 'theme-ui'
import { IdentityContext } from '../../identity-context'

const reduceTodos = (state, action) => {
  switch (action.type) {
    case 'addTodo':
      const newTodo = { done: false, value: action.payload }
      return [newTodo, ...state]
    default:
      throw new Error('Unknown action')
  }
}

const ToDoList = () => {
  const [todos, dispatch] = useReducer(reduceTodos, [])
  const inputRef = useRef()
  return (
    <Container>
      <Flex
        as="form"
        onSubmit={(e) => {
          e.preventDefault()
          dispatch({ type: 'addTodo', payload: inputRef.current.value })
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

export default () => {
  const { user } = useContext(IdentityContext)
  if (user) {
    return <ToDoList />
  }
  return <div>You need to log in.</div>
}
