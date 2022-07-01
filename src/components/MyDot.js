import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const MyDot = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [dot, setDot] = useState(null)

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

    const [getDot] = useMutation(getDotM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getDot !== undefined) {
                console.log(result.data.getDot)
                setDot(result.data.getDot)
            }
        }
    })

    useEffect(() => {
        if (user !== null && user.dotId !== '') {
            getDot({
                variables: {
                    namee: user.name, shortid: user.dotId
                }
            })
        }
    }, [user])

    return (
        <div className="con">
            <h2>MyDot</h2>
            {user !== null && dot !== null &&
                <>
                    <h3>{dot.title}</h3>
                    <Typography>{dot.points} points</Typography>
                    <Button onClick={() => setLoc(`/create-family/${dot.shortid}`)}>Create Family</Button>
                    <Button onClick={() => setLoc(`/create-task/${dot.shortid}`)}>Create Task</Button>
                    <Button onClick={() => setLoc(`/create-company/${dot.shortid}`)}>Create Company</Button>
                </>
            }
        </div>
    )
}

export default MyDot