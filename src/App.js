import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import {Link, Route} from 'wouter'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import moment from 'moment'
import Main from './components/Main'
import Welcommen from './components/Welcommen'
import Create from './components/Create'
import MyDot from './components/MyDot'
import CreateFamily from './components/CreateFamily'
import Families from './components/Families'
import Family from './components/Family'
import CreateTask from './components/CreateTask'
import Tasks from './components/Tasks'
import Task from './components/Task'
import CreateCompany from './components/CreateCompany'
import Companies from './components/Companies'
import Company from './components/Company'
import './App.css'

function App() {
  const [user, setUsers] = useState(null)

  useEffect(() => {
    let itemU = Cookies.get('user')       
   

    if (itemU !== undefined && JSON.parse(itemU) !== null) {
        setUsers(JSON.parse(itemU))
      
    } else {
      Cookies.set('user', null)
    }
  

  }, [])



  return (
    <div className="App">
      {user === null &&
        <nav>
          <Link href="/">Home</Link>
          <Link href="/reg">Register/Login</Link>
        </nav>
      }


      {user !== null && 
        <nav>
          <Link href="/">Main</Link>
          <Link href="/families">Families</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/companies">Companies</Link>
          <Link href="/my-dot">My Dot</Link>
        </nav>
      }

  
      
      <Route path="/" component={user !== null ? Main : Welcommen} /> 
      <Route path="/reg" component={Welcommen} /> 
      <Route path="/create-dot" component={Create} />
      <Route path="/my-dot" component={MyDot} />
      <Route path="/create-family/:id" component={CreateFamily} />
      <Route path="/families" component={Families} />     
      <Route path="/family/:id" component={Family} />    
      <Route path="/create-task/:id" component={CreateTask} />  
      <Route path="/tasks" component={Tasks} />  
      <Route path="/task/:id" component={Task} />  
      <Route path="/create-company/:id" component={CreateCompany} /> 
      <Route path="/companies" component={Companies} />   
      <Route path="/company/:id" component={Company} />  
    </div>
  );
}

export default App;