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

const CreateFamily = ({params}) => {
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
    const [cats, setCats] = useState(['Binary', 'Huge', 'LGBT'])
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
    const [pay, setPay] = useState('')
    const [skill, setSkill] = useState('')
    const [med, setMed] = useState('')
    const [ch, setCh] = useState({
        FIO: '',
        age: '',
        skills: [],
        media: [],
        work: '',
        globalRate: 0
    })
    const [daten, setDaten] = useState({
        title: '',
        category: '',
        pays: [],
        ages: [0, 0],
        city: '',
        cords: {},
        childs: [],
        images: []
    })
    
    const {title, category, pays, ages, city, cords, childs, images} = daten
    const {variant, text} = con
    const {key, period, time} = cur
    const {FIO, age, skills, media, work, globalRate} = ch

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

    const createFamilyM = gql`
        mutation createFamily($name: String!, $id: String!, $title: String!, $category: String!, $pays: [Float]!, $ages: [Float]!, $city: String!, $cords: Cords!, $childs: [Childs]!, $images: [String]!)  {
            createFamily(name: $name, id: $id, title: $title, category: $category, pays: $pays, ages: $ages, city: $city, cords: $cords, childs: $childs, images: $images)
        }
    `
    
    const [createFamily] = useMutation(createFamilyM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.createFamily !== undefined) {
                console.log(result.data.createFamily)
            }
        }
    })
    
    // useEffect(() => {
    //     if (iter < 20) {
    //         setDates([...dates, moment().add('days', iter).format('DD.MM.YYYY')])
    //         setIter(iter + 1)
    //     }
       
    // }, [iter])

    const onUpload = e => {
        const reader = new FileReader()

        reader.onload = ev => {
            setDaten({...daten, images: [...images, ev.target.result]})
        }

        reader.readAsDataURL(e.target.files[0])
    }

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

    useEffect(() => {
        if (category !== '') {
            let finden = cats.find(el => el.toLowerCase().includes(category.toLowerCase()) && el.length / 2 <= category.length)

            if (finden !== undefined) {
                setDaten({...daten, category: finden})
            }
        }
    }, [category])

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

    const onAddChColl = key => {
        if (key === 'skill') {
            if (skills.find(el => el === skill) === undefined) {
                setDaten({...daten, skills: [...skills, skill]})
            }

            setSkill('')
        } else if (key === 'media') {
            if (media.find(el => el === med) === undefined) {
                setDaten({...daten, media: [...media, med]})
            }

            setMed('')
        }
    }
  
    const onSetP = () => {
        if (pays.find(el => el === pay) === undefined) {
            setDaten({...daten, pays: [...pays, pay]})
        }

        setPay('')
    }

    const onAddCh = () => {
        if (childs.find(el => el.FIO === FIO) === undefined) {
            if (ages[0] > age) {
                setDaten({...daten, childs: [...childs, ch], ages: [age, ages[1]]})
            }

            if (ages[1] < age) {
                setDaten({...daten, childs: [...childs, ch], ages: [ages[0], age]})
            }
        }

        setCh({
            FIO: '',
            age: '',
            skills: [],
            media: [],
            work: '',
            globalRate: 0
        })
    }
    
    const onSave = () => {
        if (user !== null) {
            console.log(daten)          
            createFamily({
                variables: {
                    name: user.name, id: params.id, title, category, pays, ages, city, cords, childs, images
                }
            })
        }
    }
    
    return (
        <div className="con">
            <h2>Create Family</h2>
            <TextField value={title} onChange={e => setDaten({...daten, title: e.target.value})} placeholder="Enter title of family" />
            <TextField value={category} onChange={e => setDaten({...daten, category: e.target.value})} placeholder="Enter category of family" />

            {pays.length < 2 &&
                <>
                    <Typography>Set {pays.length === 0 ? 'Start' : 'End'} Price Border</Typography>
                    <TextField value={pay} onChange={e => setPay(parseInt(e.target.value))} placeholder="Enter pay" />
                    <Button onClick={onSetP}>Set</Button>
                </>
            }

            <h3>Add Childs</h3>
            <TextField value={FIO} onChange={e => setCh({...ch, FIO: e.target.value})} placeholder="Enter FIO of child" />
            <TextField value={age} onChange={e => setCh({...ch, age: parseInt(e.target.value)})} placeholder="Enter age of child" />
            <TextField value={work} onChange={e => setCh({...ch, work: parseInt(e.target.value)})} placeholder="Enter work coof of child" />
            <Typography>Add Skills</Typography>
            <TextField value={skill} onChange={e => setSkill(e.target.value)} placeholder="Enter skill" />
            <Button onClick={() => onAddChColl('skill')}>Add</Button>
            <Typography>Add Media</Typography>
            <TextField value={med} onChange={e => setMed(e.target.value)} placeholder="Enter media" />
            <Button onClick={() => onAddChColl('media')}>Add</Button>
            <Button onClick={onAddCh}>Add Child</Button>

            <TextField value={city} onChange={e => setDaten({...daten, city: e.target.value})} placeholder="Enter city of family" />
            <ReactMapGL {...view} onDblClick={setCords} mapboxApiAccessToken={token} onViewportChange={e => setView(e)} />
  
            <TextField type="file" onChange={onUpload} />
            
            <Button onClick={onSave}>Create</Button>
        </div>
    )
}

export default CreateFamily