import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'
import ReactMapGL, {Marker} from 'react-map-gl'

const Tasks = () => {
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [user, setUsers] = useState(null)
    const [tasks, setTasks] = useState(null)

    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'

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

    const getTasksM = gql`
      mutation getTasks($name: String!) {
        getTasks(name: $name) {
            shortid
            creator
            dotId
            title
            category
            level
            professions
            media
            ages
            sex
            todos {
                todo
                duration
            }
            allDuration
            city
            cords {
                lat
                long
            }
            deadline
            price
            images
            candidates {
                familyId
                name
                msg
                skills
                media
                dateUp
                accepted
            }
        }
      }
    `

    const [getTasks] = useMutation(getTasksM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getTasks !== undefined) {
                console.log(result.data.getTasks)
                setTasks(result.data.getTasks)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getTasks({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    return (
        <div className="con">
            <h2>Tasks</h2>
            {user !== null && tasks !== null &&
                <>
                    <ReactMapGL {...view} mapboxApiAccessToken={token} onViewportChange={e => setView(e)}>
                        {tasks.map(el => (
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <div className='con' onClick={() => setLoc(`/task/${dot.shortid}`)}>
                                    <b>{el.title}</b>
                                </div>
                            </Marker>
                        ))}
                    </ReactMapGL>
                </>
            }
        </div>
    )
}

export default Tasks