import React, { useContext } from 'react'
import { Router } from '@reach/router'
import { IdentityContext } from '../../identity-context'

const Dash = () => {
  const { user } = useContext(IdentityContext)
  return <div>Dash hasUser: {user && user.user_metadata.full_name}</div>
}

export default (props) => {
  return (
    <Router>
      <Dash path="/app" />
    </Router>
  )
}
