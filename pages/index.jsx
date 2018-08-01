import React, { PureComponent } from 'react';
import Layout from '../components/Layout'
import MainNavBar from '../components/MainNavBar'
import '../styles/style.scss'

export default class extends PureComponent {
  render() {
    return(
      <Layout>
        <MainNavBar/>
        <style jsx global>{`
          body{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow-y: hidden;
          }
        `} 
        </style>
      </Layout>
    )
   }
 }
