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

const Companies = () => {
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [user, setUsers] = useState(null)
    const [companies, setCompanies] = useState(null)

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

    const getCompaniesM = gql`
      mutation getCompanies($name: String!) {
        getCompanies(name: $name) {
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
      }
    `

    const [getCompanies] = useMutation(getCompaniesM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getCompanies !== undefined) {
                console.log(result.data.getCompanies)
                setCompanies(result.data.getCompanies)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getCompanies({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    return (
        <div className="con">
            <h2>Companies</h2>
            {user !== null && companies !== null &&
                <>
                    <ReactMapGL {...view} mapboxApiAccessToken={token} onViewportChange={e => setView(e)}>
                        {companies.map(el => (
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <div className='con' onClick={() => setLoc(`/company/${dot.shortid}`)}>
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

export default Companies