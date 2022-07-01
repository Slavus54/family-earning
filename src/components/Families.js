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

const Families = () => {
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [user, setUsers] = useState(null)
    const [families, setFamilies] = useState(null)

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

    const getFamiliesM = gql`
      mutation getFamilies($name: String!) {
        getFamilies(name: $name) {
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
    `

    const [getFamilies] = useMutation(getFamiliesM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getFamilies !== undefined) {
                console.log(result.data.getFamilies)
                setFamilies(result.data.getFamilies)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getFamilies({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    return (
        <div className="con">
            <h2>Families</h2>
            {user !== null && families !== null &&
                <>
                    <ReactMapGL {...view} mapboxApiAccessToken={token} onViewportChange={e => setView(e)}>
                        {families.map(el => (
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <div className='con' onClick={() => setLoc(`/family/${dot.shortid}`)}>
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

export default Families