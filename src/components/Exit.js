import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const Exit = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)

    useEffect(() => {
        let item = Cookies.get('user')     
    
        if (item !== undefined) {
          if (JSON.parse(item) !== null) {
            setUsers(JSON.parse(item))
          }
        } else {
            setUsers(null)
        }
      }, [])

    const onLogout = () => {
        Cookies.set('user', null)
        setLoc('/')
        window.location.reload()
    }

    return (
        <div className="con">
            <Button onClick={onLogout}>Logout</Button>
            <Button onClick={() => setLoc('/')}>Back</Button>
        </div>
    )
}

export default Exit