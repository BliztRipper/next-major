import React, { Component } from 'react';
import Layout from '../components/Layout'
import BottomNavBar from '../components/BottomNavBar'
import '../styles/style.scss'

export default class extends Component {
  render() {
    return(
      <Layout>
        <BottomNavBar/>
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
