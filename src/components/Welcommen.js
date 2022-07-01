import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import Login from './Login'
import Register from './Register'
import Modal from 'react-awesome-modal'

const Welcommen = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [openL, setOpenL] = useState(false)
    const [openR, setOpenR] = useState(false)

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

    return (
        <div className="con">
            <Button onClick={() => setOpenR(true)} className="butten">Register</Button>
            <Modal visible={openR} width="400" height="500" effect="fadeInUp" onClickAway={() => setOpenR(false)}>
                    <div className="con">
                    <div className="formen">
                        <Button onClick={() => setOpenR(false)}>&times;</Button>
                        <Register />
                    </div>
                    </div>
            </Modal>
            <Button onClick={() => setOpenL(true)} className="butten">Login</Button>
            <Modal visible={openL} width="400" height="350" effect="fadeInUp" onClickAway={() => setOpenL(false)}>
                    <div className="con">
                    <div className="formen">
                        <Button onClick={() => setOpenL(false)}>&times;</Button>
                        <Login />
                    </div>
                    </div>
            </Modal>
        </div>
    )
}

export default Welcommen