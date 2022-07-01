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

const Task = ({params}) => {
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [user, setUsers] = useState(null)
    const [task, setTask] = useState(null)
    const [dot, setDot] = useState(null)
    const [family, setFamily] = useState(null)
    const [child, setChild] = useState(null)
    const [daten, setDaten] = useState({
        msg: ''
    })

    const {msg} = daten

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

    const getTaskM = gql`
      mutation getTask($name: String!, $shortid: String!) {
        getTask(name: $name, shortid: $shortid) {
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

    const getDotM = gql`
      mutation getDot($name: String!, $shortid: String!) {
        getDot(name: $name, shortid: $shortid) {
          shortid
          creator
          title
          city
          cords {
              lat
              long
          }
          notifyFormat
          families {
            shortid
            creator
            dotId
            title
            category
            pays
            ages
            city
            cords {
                lat
                long
            }
            childs {
                FIO
                age
                skills
                media
                work
                globalRate
            }
            images
            comments {
                name
                comment
            }
            facts {
                FIO
                fact
                isTrue
                energy
            }
            reviews {
                FIO
                review
                rate
                dateUp
            }
         }
        
        }
      }
    `

    const becomeTaskCandidateM = gql`
      mutation becomeTaskCandidate($name: String!, $id: String!, $dotId: String!, $familyId: String!, $FIO: String!, $msg: String!, $dateUp: String!)  {
        becomeTaskCandidate(name: $name, id: $id, dotId: $dotId, familyId: $familyId, FIO: $FIO, msg: $msg, dateUp: $dateUp) 
      }
    `

    const acceptTaskCandidateM = gql`
        mutation acceptTaskCandidate($name: String!, $id: String!, $familyId: String!, $FIO: String!)  {
            acceptTaskCandidate(name: $name, id: $id, familyId: $familyId, FIO: $FIO) 
        }
    `

    const [getDot] = useMutation(getDotM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getDot !== undefined) {
                console.log(result.data.getDot)
                setDot(result.data.getDot)
            }
        }
    })

    const [getTask] = useMutation(getTaskM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getTask !== undefined) {
                console.log(result.data.getTask)
                setTask(result.data.getTask)
            }
        }
    })

    const [becomeTaskCandidate] = useMutation(becomeTaskCandidateM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.becomeTaskCandidate !== undefined) {
                console.log(result.data.becomeTaskCandidate)
            }
        }
    })

    const [acceptTaskCandidate] = useMutation(acceptTaskCandidateM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.acceptTaskCandidate !== undefined) {
                console.log(result.data.acceptTaskCandidate)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getTask({
                variables: {
                    name: user.name, shortid: params.id
                }
            })
        }
    }, [user])

    useEffect(() => {
        if (user !== null && task !== null && task.creator !== user.name && user.dotId !== '') {
            getDot({
                variables: {
                    namee: user.name, shortid: user.dotId
                }
            })
        }
    }, [task])

    const onBec = () => {
        if (user !== null) {
            becomeTaskCandidate({
                variables: {
                    name: user.name, id: params.id, dotId: user.dotId, familyId: family.shortid, FIO: child.FIO, msg, dateUp: moment().format('DD.MM.YYYY')
                }
            })
        }
    }

    const onAccept = el => {
        if (user !== null) {
            becomeTaskCandidate({
                variables: {
                    name: user.name, id: params.id, familyId: el.familyId, FIO: el.FIO
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Task</h2>
            {user !== null && task !== null &&
                <>
                    <h3>{task.title}</h3>

                    {task.creator === user.name &&
                        <>
                            <h4>Candidates</h4>
                            <div className='invs'>
                                {task.candidates.map(el => (
                                     <Card className='inv'>
                                        <CardContent>
                                            <Typography>{el.FIO}</Typography>
                                        </CardContent>
                                        <CardActionArea>
                                            {el.accepted === false && <Button onClick={() => onAccept(el)}>Accept</Button>}
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </div>
                        </>
                    }

                    {dot !== null &&
                        <>
                            <h4>Become Candidate</h4>
                            <div className='invs'> 
                                {dot.families.map(el => (
                                     <Card className='inv' onClick={() => setFamily(el)}>
                                        <CardContent>
                                            <Typography>{el.title}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {family !== null &&
                                <div className='invs'> 
                                    {family.childs.map(el => (
                                        <Card className='inv' onClick={() => setChild(el)}>
                                            <CardContent>
                                                <Typography>{el.FIO}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            }
                            <TextareaAutosize value={msg} onChange={e => setDaten({...daten, msg: e.target.value})} placeholder="Enter msg" minRows={3} />
                            {family !== null && child !== null && <Button onClick={onBec}>Become</Button>}
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Task