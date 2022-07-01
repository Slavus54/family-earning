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

const Company = ({params}) => {
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [user, setUsers] = useState(null)
    const [company, setCompany] = useState(null)
    const [daten, setDaten] = useState({
        rate: '',
        comment: '',
        placeId: '',
        replic: ''
    })

    const {rate, comment, placeId, replic} = daten

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

    const getCompanyM = gql`
      mutation getCompany($name: String!, $shortid: String!) {
        getCompany(name: $name, shortid: $shortid) {
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

    const rateCompanyM = gql`
      mutation rateCompany($name: String!, $id: String!, $rate: Float!)  {
        rateCompany(name: $name, id: $id, rate: $rate) 
      }
    `

    const commentCompanyM = gql`
        mutation commentCompany($name: String!, $id: String!, $comment: String!)  {
            commentCompany(name: $name, id: $id, comment: $comment) 
        }
    `

    const addCompanyReplicM = gql`
        mutation addCompanyReplic($name: String!, $id: String!, $placeId: String!, $replic: String!)  {
            addCompanyReplic(name: $name, id: $id, placeId: $placeId, replic: $replic) 
        }
    `

    const [getCompany] = useMutation(getCompanyM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getCompany !== undefined) {
                console.log(result.data.getCompany)
                setCompany(result.data.getCompany)
            }
        }
    })

    const [rateCompany] = useMutation(rateCompanyM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.rateCompany !== undefined) {
                console.log(result.data.rateCompany)
            }
        }
    })

    const [commentCompany] = useMutation(commentCompanyM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.commentCompany !== undefined) {
                console.log(result.data.commentCompany)
            }
        }
    })

    const [addCompanyReplic] = useMutation(addCompanyReplicM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.addCompanyReplic !== undefined) {
                console.log(result.data.addCompanyReplic)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getCompany({
                variables: {
                    name: user.name, shortid: params.id
                }
            })
        }
    }, [user])

    const onRate = () => {
        if (user !== null) {
            rateCompany({
                variables: {
                    name: user.name, id: params.id, rate
                }
            })
        }
    }

    const onComment = () => {
        if (user !== null) {
            commentCompany({
                variables: {
                    name: user.name, id: params.id, comment
                }
            })
        }
    }

    const onAddRep = () => {
        if (user !== null) {
            addCompanyReplic({
                variables: {
                    name: user.name, id: params.id, placeId, replic
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Company</h2>
            {user !== null && company !== null &&
                <>
                    <h3>{company.title}</h3>
                    {company.creator !== user.name && company.raters.find(el => el === user.name) === undefined &&
                        <>
                            <h4>Rate</h4>
                            <TextField value={rate} onChange={e => setDaten({...daten, rate: parseInt(e.target.value)})} placeholder="Enter rate" />
                            <Button onClick={onRate}>Rate</Button>
                        </>
                    }
                    <TextareaAutosize value={comment} onChange={e => setDaten({...daten, comment: e.target.value})} placeholder="Enter comment" minRows={3} />
                    <Button onClick={onComment}>Comment</Button>
                    <h4>Add Place's Replic</h4>
                    {company.places.filter(el => el.format === 'Working').map(el => (
                        <ReactMapGL {...view} mapboxApiAccessToken={token} onViewportChange={e => setView(e)}>
                            {company.places.map(el => (
                                <Marker latitude={el.dot.lat} longitude={el.dot.long}>
                                    <div className='con' onClick={() => setDaten({...daten, placeId: el.id})}>
                                        <b>{el.place}</b>
                                    </div>
                                </Marker>
                            ))}
                        </ReactMapGL>
                    ))}
                    <TextareaAutosize value={replic} onChange={e => setDaten({...daten, replic: e.target.value})} placeholder="Enter replic" minRows={3} />
                    <Button onClick={onAddRep}>Add</Button>
                </>
            }
        </div>
    )
}

export default Company