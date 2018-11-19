import React, { Fragment } from 'react';
import Router from 'next/router'
import * as gtag from '../lib/gtag'

Router.events.on('routeChangeComplete', url => gtag.pageview(url))

const Page = ({ children }) => (
  <Fragment>
    {children}
  </Fragment>
)

export default Page
