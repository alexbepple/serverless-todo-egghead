import React, { useEffect } from 'react'
import { Router } from '@reach/router'
import netlifyIdentity from 'netlify-identity-widget'

const Dash = () => {
  useEffect(() => netlifyIdentity.init({}))
  const user = netlifyIdentity.currentUser()
  return <div>Dash hasUser: {user && user.user_metadata.full_name}</div>
}

export default (props) => {
  return (
    <Router>
      <Dash path="/app" />
    </Router>
  )
}
