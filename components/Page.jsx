import React, { Fragment } from 'react';
import Router from 'next/router'
import * as gtag from '../lib/gtag'

Router.events.on('routeChangeComplete', url => gtag.pageview(url))

export default ({ children }) => (
  <Fragment>
    {children}
  </Fragment>
)