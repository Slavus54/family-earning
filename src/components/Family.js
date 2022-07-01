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

const Family = ({params}) => {
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [user, setUsers] = useState(null)
    const [family, setFamily] = useState(null)
    const [dirs, setDirs] = useState(['add', 'delete'])
    const [daten, setDaten] = useState({
        comment: '',
        fact: '',
        isTrue: false,
        energy: '',
        FIO: '',
        review: '',
        rate: '',
        direction: ''
    })

    const {comment, fact, isTrue, energy, FIO, review, rate, direction} = daten

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

    const getFamilyM = gql`
      mutation getFamily($name: String!, $shortid: String!) {
        getFamily(name: $name, shortid: $shortid) {
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

    const commentFamilyM = gql`
      mutation commentFamily($name: String!, $id: String!, $comment: String!) {
        commentFamily(name: $name, id: $id, comment: $comment)
      }
    `

    const addFamilyFactM = gql`
        mutation addFamilyFact($name: String!, $id: String!, $fact: String!, $isTrue: Boolean!, $energy: Float!) {
            addFamilyFact(name: $name, id: $id, fact: $fact, isTrue: $isTrue, energy: $energy)
        }
    `

    const manageFamilyReviewM = gql`
        mutation manageFamilyReview($name: String!, $id: String!, $direction: String!, $review: String!, $rate: Float!, $dateUp: String!, $index: Float!) {
            manageFamilyReview(name: $name, id: $id, direction: $direction, review: $review, rate: $rate, dateUp: $dateUp, index: $index)
        }
    `

    const [getFamily] = useMutation(getFamilyM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getFamily !== undefined) {
                console.log(result.data.getFamily)
                setFamily(result.data.getFamily)
            }
        }
    })

    const [commentFamily] = useMutation(commentFamilyM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.commentFamily !== undefined) {
                console.log(result.data.commentFamily)
            }
        }
    })

    const [addFamilyFact] = useMutation(addFamilyFactM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.addFamilyFact !== undefined) {
                console.log(result.data.addFamilyFact)
            }
        }
    })

    const [manageFamilyReview] = useMutation(manageFamilyReviewM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.manageFamilyReview !== undefined) {
                console.log(result.data.manageFamilyReview)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getFamily({
                variables: {
                    name: user.name, shortid: params.id
                }
            })
        }
    }, [user])

    const onComment = () => {
        if (user !== null) {
            commentFamily({
                variables: {
                    name: user.name, id: params.id, comment
                }
            })
        }
    }

    const onAddF = () => {
        if (user !== null) {
            addFamilyFact({
                variables: {
                    name: user.name, id: params.id, fact, isTrue, energy
                }
            })
        }
    }

    const onAddRev = () => {
        if (user !== null) {
            addFamilyFact({
                variables: {
                    name: user.name, id: params.id, direction: 'add', review, rate, dateUp: moment().format('DD.MM.YYYY'), index: 0
                }
            })
        }
    }

    const onDel = index => {
        if (user !== null) {
            addFamilyFact({
                variables: {
                    name: user.name, id: params.id, direction: 'delete', review, rate: 0, dateUp: moment().format('DD.MM.YYYY'), index
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Family</h2>
            {user !== null && family !== null &&
                <>
                    <h3>{family.title}</h3>
                    <Button onClick={() => setLoc(`/earning/${family.shortid}`)}>Earning</Button>
                    <h4>Comment</h4>
                    <TextareaAutosize value={comment} onChange={e => setDaten({...daten, comment: e.target.value})} placeholder="Enter comment" minRows={3} />
                    <Button onClick={onComment}>Comment</Button>
                    <h4>Choose Child</h4>
                    <div className='invs'>
                        {family.childs.map(el => (
                            <Card className='inv' onClick={() => setDaten({...daten, FIO: el.FIO})}>
                                <CardContent>
                                    <Typography>{el.FIO}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {family.creator === user.name && FIO !== '' &&
                        <>
                            <h4>Add Fact</h4>
                            <TextareaAutosize value={fact} onChange={e => setDaten({...daten, fact: e.target.value})} placeholder="Enter fact" minRows={3} />
                            <Typography>Is True?</Typography>
                            <Checkbox value={isTrue} onChange={e => setDaten({...daten, isTrue: e.target.checked})}></Checkbox>
                            <TextField value={energy} onChange={e => setDaten({...daten, energy: parseInt(e.target.value)})} placeholder="Enter energy points" />
                            <Button onClick={onAddF}>Add</Button>
                            <h4>Reviews</h4>
                            <div className='invs'>
                                {family.reviews.filter(el => el.FIO === FIO).map((el, i) => (
                                    <Card className='inv' onClick={() => onDel(i)}>
                                        <CardContent>
                                            <Typography>{el.rate}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    }
                    {family.creator !== user.name && FIO !== '' &&
                        <>
                            <h4>Add Review</h4>
                            <TextareaAutosize value={review} onChange={e => setDaten({...daten, review: e.target.value})} placeholder="Enter review" minRows={3} />
                            <TextField value={rate} onChange={e => setDaten({...daten, rate: parseInt(e.target.value)})} placeholder="Enter rate" />
                            <Button onClick={onAddRev}>Add</Button>
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Family