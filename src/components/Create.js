import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select,} from '@material-ui/core'
import {Button, Checkbox} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'
import shortid from 'shortid'
import ReactMapGL, {Marker} from 'react-map-gl'

const Create = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [viewC, setViewC] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [nf, setNF] = useState(['Email'])
    const [w, setW] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    const [vars, setVars] = useState(['Text', 'URL', 'Image'])
    const [f, setF] = useState(['Counter', 'Image', 'Custom'])
    const [cats, setCats] = useState(['House', 'Flat', 'Townhouse', 'Property'])
    const [levs, setLevs] = useState(['Low', 'Medium', 'Hard'])
    const [c, setC] = useState([8, 9, 10, 11])
    const [p, setP] = useState(['days', 'weeks', 'months'])
    const [pr, setPr] = useState(['Therapist', 'Surgeon', 'Dermatologist'])
    const [periods, setPeriods] = useState([])
    const [size, setSize] = useState(3)
    const [cur, setCur] = useState({
        key: '',
        period: '',
        time: ''
    })
    const [yearsB, setYearsB] = useState([2000, 2001, 2002, 2003, 2004, 2005])
    const [years, setYears] = useState([moment().format('YYYY'), moment().add('years', 1).format('YYYY')])
    const [con, setCon] = useState({
        variant: '',
        text: ''
    })
    const [n, setN] = useState([9, 10, 11])
    const [g, setG] = useState(['Female', 'Male'])
    const [daten, setDaten] = useState({
        title: '',
        city: '',
        cords: {},
        notifyFormat: ''
    })
    
    const {title, city, cords, notifyFormat} = daten
    const {variant, text} = con
    const {key, period, time} = cur

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

    const createDotM = gql`
        mutation createDot($name: String!, $title: String!, $city: String!, $cords: Cords!, $notifyFormat: String!)  {
            createDot(name: $name, title: $title, city: $city, cords: $cords, notifyFormat: $notifyFormat) {
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
    
    const [createDot] = useMutation(createDotM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.createDot !== undefined) {
                console.log(result.data.createDot)
                document.cookie = `user=${JSON.stringify(result.data.createDot)}`
            }
        }
    })
    
    // useEffect(() => {
    //     if (iter < 20) {
    //         setDates([...dates, moment().add('days', iter).format('DD.MM.YYYY')])
    //         setIter(iter + 1)
    //     }
       
    // }, [iter])

    // const onUpload = e => {
    //     const reader = new FileReader()

    //     reader.onload = ev => {
    //         setDaten({...daten, photos: [...photos, ev.target.result]})
    //     }

    //     reader.readAsDataURL(e.target.files[0])
    // }

    useEffect(() => {
        if (periods.length > 0) {
            let start = 0

            periods.map(el => {
                if (el.key === 'add') {
                    if (el.period == 'days') {
                        start += el.time
                    } else if (el.period == 'weeks') {
                        start += el.time * 7
                    } else if (el.period == 'months') {
                        start += el.time * 30
                    } 
                }  else {
                    if (el.period == 'days') {
                        start -= el.time
                    } else if (el.period == 'weeks') {
                        start -= el.time * 7
                    } else if (el.period == 'months') {
                        start -= el.time * 30
                    }
                }
            })

            setDaten({...daten, passportDate: moment().add('days', start).format('DD.MM.YYYY')})
        }
    }, [period])
    
    useEffect(() => {
        if (periods.length > 0) {
            let start = 0

            periods.map(el => {
                if (el.key === 'add') {
                    if (el.period == 'days') {
                        start += el.time
                    } else if (el.period == 'weeks') {
                        start += el.time * 7
                    } else if (el.period == 'months') {
                        start += el.time * 30
                    } 
                }  else {
                    if (el.period == 'days') {
                        start -= el.time
                    } else if (el.period == 'weeks') {
                        start -= el.time * 7
                    } else if (el.period == 'months') {
                        start -= el.time * 30
                    }
                }
            })

            setDaten({...daten, passportDate: moment().add('days', start).format('DD.MM.YYYY')})
        }
    }, [time])

    useEffect(() => {
        if (periods.length > 0) {
            let start = 0

            periods.map(el => {
                if (el.key === 'add') {
                    if (el.period == 'days') {
                        start += el.time
                    } else if (el.period == 'weeks') {
                        start += el.time * 7
                    } else if (el.period == 'months') {
                        start += el.time * 30
                    } 
                }  else {
                    if (el.period == 'days') {
                        start -= el.time
                    } else if (el.period == 'weeks') {
                        start -= el.time * 7
                    } else if (el.period == 'months') {
                        start -= el.time * 30
                    }
                }
            })

            setDaten({...daten, passportDate: moment().add('days', start).format('DD.MM.YYYY')})
        }
    }, [periods])

    const setCords = e => {    
        setDaten({...daten, cords: {
            lat: e.lngLat[1],
            long: e.lngLat[0]
        }})
    }

    // const onAddDate = () => {
    //     setPeriods([...periods, {
    //         period,
    //         times
    //     }])
    //     setDaten({...daten, 
    //         period: '',
    //         times: ''
    //     })
    // }

    const onGen = key => {
        setPeriods([...periods, {
            key,
            period,
            time
        }])
        setCur({...cur, 
            key: '',
            period: '',
            time: ''
        })
    }
  
    // const onAdd = () => {
    //     setDaten({...daten, content: [...content, con]})
    //     setCon({
    //         variant: '',
    //         text: ''
    //     })
    // }

    
    const onSave = () => {
        if (user !== null) {
            console.log(daten)          
            createDot({
                variables: {
                    name: user.name, title, city, cords, notifyFormat
                }
            })
        }
    }
    
    return (
        <div className="con">
            <h2>Create Dot</h2>
            <TextField value={title} onChange={e => setDaten({...daten, title: e.target.value})} placeholder="Enter title of dot" />
          
            <TextField value={city} onChange={e => setDaten({...daten, city: e.target.value})} placeholder="Enter city of dot" />
            <ReactMapGL {...view} onDblClick={setCords} mapboxApiAccessToken={token} onViewportChange={e => setView(e)} />
         
            <Select onChange={e => setDaten({...daten, notifyFormat: e.target.value})}>
                {nf.map(el => <option value={el}>{el}</option>)}
            </Select>
            {/*           
            {variant === 'Text' &&
                <TextareaAutosize value={text} onChange={e => setCon({...con, text: e.target.value})} placeholder="Enter text" minRows={size} />
            }
            {variant === 'URL' &&
                <TextField value={text} onChange={e => setCon({...con, text: e.target.value})} placeholder="Enter URL" />
            }
            {variant === 'Image' &&
                <TextField value={text} onChange={e => setCon({...con, text: e.target.value})} placeholder="Enter URL" />
            } */}
            
            <Button onClick={onSave}>Create</Button>
        </div>
    )
}

export default Create


