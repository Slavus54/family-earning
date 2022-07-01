import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import moment from 'moment'
import axios from 'axios'
import Exit from './Exit'
import ReactMapGL, {Marker} from 'react-map-gl'

const Main = () => {
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState({
      latitude: 55.25,
      longitude: 82.7,
      width: '300px',
      height: '300px',
      zoom: 7
    })
    const [user, setUsers] = useState(null)
    const [dots, setDots] = useState(null)


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
    
    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'
   
    window.SpeechRecognition = window.SpeechRecognition ||  window.webkitSpeechRecognition

    const recognation = new window.SpeechRecognition()
   

    recognation.lang = 'eng-US'

    const getDotsM = gql`
      mutation getDots($name: String!) {
        getDots(name: $name) {
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
        tasks {
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
        companies {
            shortid
            creator
            dotId
            title
            category
            level
            items {
                item
                itemType
                price
            }
            media
            city
            cords {
                lat
                long
            }
            places {
                id
                place
                format
                dot {
                    lat
                    long
                }
            }
            images
            raters
            rating
            comments {
                name
                comment
            }
            replicas {
                placeId
                replic
            }
        }
        points
          subs {
              name
              email
          }
        }
      }
    `

    const changeDotCordsM = gql`
      mutation changeDotCords($name: String!, $id: String!, $cords: Cords!) {
        changeDotCords(name: $name, id: $id, cords: $cords) 
      }
    `

    const subscribeDotM = gql`
    mutation subscribeDot($name: String!, $id: String!) {
      subscribeDot(name: $name, id: $id) {
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

    const [getDots] = useMutation(getDotsM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getDots !== undefined) {
                console.log(result.data.getDots)
                setDots(result.data.getDots)
            }
        }
    })

    const [changeDotCords] = useMutation(changeDotCordsM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.changeDotCords !== undefined) {
                console.log(result.data.changeDotCords)
            }
        }
    })

    const [subscribeDot] = useMutation(subscribeDotM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.subscribeDot !== undefined) {
                console.log(result.data.subscribeDot)
                document.cookie = `user=${JSON.stringify(result.data.subscribeDot)}`
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getDots({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    const setCords = e => {
      if (user !== null && user.dotId !== '') { 
        changeDotCords({
          variables: {
            name: user.name, id: user.dotId, cords: {
              lat: e.lngLat[1],
              long: e.lngLat[0]
            }
          }
        })
      }
    }

    const onSubscribe = dot => {
      if (user !== null) {
        subscribeDot({
          variables: {
            name: user.name, id: dot.shortid
          }
        })
      }
    }

    return (
      <div className="con">
        <h3>Main</h3> 
          {user !== null && dots !== null && 
            <>
                <Typography>DoubleClick to change Cords</Typography>
                <ReactMapGL {...view} onDblClick={setCords} mapboxApiAccessToken={token} onViewportChange={e => setView(e)}>
                  {dots.map(el => (
                    <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                      <div className="con">
                        <b>{el.title}</b>
                        {el.creator !== user.name && el.subs.find(e => e.name == user.name) === undefined &&
                          <Button onClick={() => onSubscribe(el)}>Subscribe</Button>
                        }
                      </div>
                    </Marker>
                  ))}
                </ReactMapGL>
                {user.dotId == '' &&
                  <Button onClick={() => setLoc(`/create-dot`)}>Create Dot</Button>        
                }
                
            </>
          }
        <Exit />
      </div>
    )
}

export default Main


