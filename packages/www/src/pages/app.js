import React, { useContext, useRef } from 'react'
import { Container, Checkbox, Flex, Label, Input, Button } from 'theme-ui'
import { IdentityContext } from '../../identity-context'
import { gql, useMutation, useQuery } from '@apollo/client'

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
    }
  }
`
const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodoDone(id: $id) {
      text
      done
    }
  }
`
const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      done
    }
  }
`

const ToDoList = () => {
  const [addTodo] = useMutation(ADD_TODO)
  const [toggleTodo] = useMutation(TOGGLE_TODO)
  const { loading, error, data } = useQuery(GET_TODOS)
  const inputRef = useRef()

  return (
    <Container>
      <Flex
        as="form"
        onSubmit={(e) => {
          e.preventDefault()
          addTodo({ variables: { text: inputRef.current.value } })
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
          {loading && <div>loading ...</div>}
          {error && <div>{error.message}</div>}
          {!loading &&
            !error &&
            data.todos.map((todo) => (
              <Flex
                as="li"
                key={todo.id}
                onClick={(e) => toggleTodo({ variables: { id: todo.id } })}
              >
                <Checkbox checked={todo.done} readOnly></Checkbox>
                <span>{todo.text}</span>
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
