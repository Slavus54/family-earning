import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'

const Login = () => {
    const [flag, setFlag] = useState(null)
    const [user, setUsers] = useState(null)
    const [loc, setLoc] = useLocation()
    const [daten, setDaten] = useState({
        email: '',
        password: '',
    })

    const {email, password} = daten

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

    const loginM = gql`
        mutation login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                id
                name
                email
                password
                confirmPassword
                tel
                city
                country
                age
                dotId
                subs {
                    id
                    title
                }
            }
        }
    `
    const [login] = useMutation(loginM, {
        variables: {email, password},
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.login !== undefined) {
                document.cookie = `user=${JSON.stringify(result.data.login)}`
                setLoc('/')
                window.location.reload()
            }
        }
    })

    const onLog = () => {
        login()
        
        console.log(daten)
        setDaten({email: '', password: ''})
    }

    return (
        <div className="con">
                <div className="formen">
                <h3>Login</h3>
                <TextField value={email} onChange={(e) => setDaten({...daten, email: e.target.value})} placeholder="Enter your email" />
                <TextField value={password} onChange={(e) => setDaten({...daten, password: e.target.value})} placeholder="Enter your password" />
                <Button onClick={onLog}>Login</Button>
                </div>
               
        </div>
    )
}

export default Login