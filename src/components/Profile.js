import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Checkbox, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'

const Profile = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        let item = JSON.parse(Cookies.get('user'))
  
        if (item !== null) {
            setUsers(item)
        } else {
            setUsers(null)
        } 
    }, [])

    const getUserInfoM = gql`
        mutation getUserInfo($name: String!) {
            getUserInfo(name: $name) {
                id
                name
                email
                password
                confirmPassword
                tel
                city
                country
                age
                hobbies {
                    title
                    category
                    time
                }
                chats {
                    shortid
                    creator
                    interlocutor
                    chat {
                        name
                        msg
                    }
                }
                containers {
                    shortid
                    creator
                    partner
                    title
                    tasks {
                        shortid
                        creator
                        title
                        description
                        todos
                        format
                        accepters {
                            name
                            link
                            accepted
                        }
                        deadline
                        points
                    }
                    chat {
                        name
                        msg
                    }
                    accepted
                }
                points
            }
        }
    `

    const [getUserInfo] = useMutation(getUserInfoM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getUserInfo !== undefined) {
                console.log(result.data.getUserInfo)
                setProfile(result.data.getUserInfo)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getUserInfo({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    return (
        <div className="con">
            <h2>Profile</h2>
            {profile !== null && 
            <>
                <Button onClick={() => setLoc(`/add-hobby`)}>Add Hobby</Button>
                <h3>Chats</h3>
                <div className="invs">
                    {profile.chats.map(el => (
                        <Card className="inv">
                            <CardContent>
                                <Typography>{el.interlocutor}</Typography>
                            </CardContent>
                            <CardActionArea>
                                <Button onClick={() => setLoc(`/chat/${el.shortid}`)}>Chat</Button>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>
            </>   
            }
        </div>
    )
}

export default Profile