import React, {useState, useEffect, useRef} from 'react'
import {TextField, Checkbox, FormLabel} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import ReCAPTCHA from 'react-google-recaptcha'
import Cookies from 'js-cookie'
import axios from 'axios'

const Register = () => {
    const reffen = useRef()
    const [loc, setLoc] = useLocation()
    const [daten, setDaten] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        tel: '',
        city: '',
        country: '',
        age: '',
        card: ''
    })

    const {name, email, password, confirmPassword, tel, city, country, age, card} = daten

    const registerM = gql`
        mutation register($name: String!, $email: String!, $password: String!, $confirmPassword: String!, $tel: String!, $city: String!, $country: String!, $age: Int!) {
            register(name: $name, email: $email, password: $password, confirmPassword: $confirmPassword, tel: $tel, city: $city, country: $country, age: $age) {
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

    const [register] = useMutation(registerM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.register !== undefined) {
                console.log(result.data.register)
                document.cookie = `user=${JSON.stringify(result.data.register)}`
                localStorage.setItem(`busket`, JSON.stringify({}))
                setLoc('/')
                window.location.reload()
            }
        }
    })

    const onCaptcha = (e) => {
        console.log(reffen.current.getValue())
    }


    const onReg = async () => {
        let item = Cookies.get('user')

        if (JSON.parse(item) === null || item === undefined) {
            register({
                variables: {name, email, password, confirmPassword, tel, city, country, age}
            })
            console.log(daten)
            setDaten({name: '', email: '', password: '', confirmPassword: '', tel: '', city: '', country: '', age: '', card: ''})
        } 
    }

    return (
        <div className="con">
            <div className="formen">
            <h3>Register</h3>
            <TextField value={name} onChange={(e) => setDaten({...daten, name: e.target.value})} placeholder="Enter your name" />
            <TextField value={email} onChange={(e) => setDaten({...daten, email: e.target.value})} placeholder="Enter your email" />
            <TextField value={password} onChange={(e) => setDaten({...daten, password: e.target.value})} placeholder="Enter your password" />
            <TextField value={confirmPassword} onChange={(e) => setDaten({...daten, confirmPassword: e.target.value})} placeholder="Confirm your password" />
            <TextField value={tel} onChange={(e) => setDaten({...daten, tel: e.target.value})} placeholder="Enter your tel" />
            <TextField value={city} onChange={(e) => setDaten({...daten, city: e.target.value})} placeholder="Enter your city" />
            <TextField value={country} onChange={(e) => setDaten({...daten, country: e.target.value})} placeholder="Enter your country" />
            <TextField value={age} onChange={(e) => setDaten({...daten, age: parseInt(e.target.value)})} placeholder="Enter your age" />
            <ReCAPTCHA
                ref={reffen}
                sitekey="6LddGhMaAAAAAEAgqpTUAeloK3sjQgTXGJd5uh1j"
                onChange={onCaptcha}
            />
            <Button onClick={onReg} style={{backgroundColor: 'white', color: 'black'}}>Register</Button>
            </div>            
        </div>
    )
}

export default Register