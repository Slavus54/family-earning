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

const CreateCompany = ({params}) => {
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
    const [f, setF] = useState(['Usual', 'Working'])
    const [cats, setCats] = useState(['Construction', 'Lawn', 'Art', 'IT', 'Medical'])
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
    const [its, setIts] = useState(['Product', 'Service'])
    const [med, setMed] = useState('')
    const [pl, setPl] = useState({
        id: '',
        place: '',
        format: '',
        dot: {}
    })
    const [it, setIt] = useState({
        item: '',
        itemType: '',
        price: ''
    })
    const [daten, setDaten] = useState({
        title: '',
        category: '',
        level: '',
        items: [],
        media: [],
        city: '',
        cords: {},
        places: [],
        images: []
    })
    
    const {title, category, level, items, media, city, cords, places, images} = daten
    const {variant, text} = con
    const {key, period, time} = cur
    const {item, itemType, price} = it
    const {id, place, format, dot} = pl

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

    const createCompanyM = gql`
        mutation createCompany($name: String!, $id: String!, $title: String!, $category: String!, $level: String!, $items: [Items]!, $media: [String]!, $city: String!, $cords: Cords!, $places: [Places]!, $images: [String]!) {
            createCompany(name: $name, id: $id, title: $title, category: $category, level: $level, items: $items, media: $media, city: $city, cords: $cords, places: $places, images: $images)
        }
    `
    
    const [createCompany] = useMutation(createCompanyM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.createCompany !== undefined) {
                console.log(result.data.createCompany)
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

            setDaten({...daten, deadline: moment().add('days', start).format('DD.MM.YYYY')})
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

            setDaten({...daten, deadline: moment().add('days', start).format('DD.MM.YYYY')})
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

            setDaten({...daten, deadline: moment().add('days', start).format('DD.MM.YYYY')})
        }
    }, [periods])

    const setCords = (e, key) => {    
        if (key === 'company') {
            setDaten({...daten, cords: {
                lat: e.lngLat[1],
                long: e.lngLat[0]
            }})
        } else {
            setPl({...pl, dot: {
                lat: e.lngLat[1],
                long: e.lngLat[0]
            }})
        }
       
    }

    useEffect(() => {
        if (category !== '') {
            let finden = cats.find(el => el.toLowerCase().includes(category.toLowerCase()) && el.length / 2 <= category.length)

            if (finden !== undefined) {
                setDaten({...daten, category: finden})
            }
        }
    }, [category])

    useEffect(() => {
        if (place !== '' && id === '') {
            setPl({...pl, id: shortid.generate().toString()})
        }
    }, [place])

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

    const onAddMed = () => {
        if (media.find(el => el === med) == undefined) {
            setDaten({...daten, media: [...media, med]})
        }

        setMed('')
    }

    const onAddIt = () => {
        if (items.find(el => el.item === item) === undefined) {
            setDaten({...daten, items: [...items, it]})
        }

        setIt({
            item: '',
            itemType: '',
            price: ''
        })
    }

    const onAddPl = () => {
        if (places.find(el => el.place === place) === undefined) {
            setDaten({...daten, places: [...places, pl]})
        }

        setPl({
            id: '',
            place: '',
            format: '',
            dot: {}
        })
    }

    const onSave = () => {
        if (user !== null) {
            console.log(daten)          
            createCompany({
                variables: {
                    name: user.name, id: params.id, title, category, level, items, media, city, cords, places, images
                }
            })
        }
    }
    
    return (
        <div className="con">
            <h2>Create Company</h2>
            <TextField value={title} onChange={e => setDaten({...daten, title: e.target.value})} placeholder="Enter title of company" />
            <TextField value={category} onChange={e => setDaten({...daten, category: e.target.value})} placeholder="Enter category of company" />
            <Select onChange={e => setDaten({...daten, level: e.target.value})}>
                {levs.map(el => <option value={el}>{el}</option>)}
            </Select>


            <h3>Add Media</h3>
            <TextField value={med} onChange={e => setMed(e.target.value)} placeholder="Enter media" />
            <Button onClick={onAddMed}>Add</Button>

            <h3>Add Items of Company</h3>
            <TextField value={item} onChange={e => setIt({...it, item: e.target.value})} placeholder="Enter title of item" />
            <Select onChange={e =>  setIt({...it, itemType: e.target.value})}>
                {its.map(el => <option value={el}>{el}</option>)}
            </Select>
            <TextField value={price} onChange={e => setIt({...it, price: parseInt(e.target.value)})} placeholder="Enter price of item" />
            <Button onClick={onAddIt}>Add</Button>

            <TextField value={city} onChange={e => setDaten({...daten, city: e.target.value})} placeholder="Enter city of company" />
            <ReactMapGL {...view} onDblClick={e => setCords(e, 'company')} mapboxApiAccessToken={token} onViewportChange={e => setView(e)} />

            <h3>Add Places</h3>
            <TextField value={place} onChange={e => setPl({...pl, place: e.target.value})} placeholder="Enter title of place" />
            <Select onChange={e => setPl({...pl, format: e.target.value})}>
                {f.map(el => <option value={el}>{el}</option>)}
            </Select>
            <ReactMapGL {...viewC} onDblClick={e => setCords(e, 'place')} mapboxApiAccessToken={token} onViewportChange={e => setViewC(e)} />
            <Button onClick={onAddPl}>Add</Button>

            <TextField type="file" onChange={onUpload} />
            
            <Button onClick={onSave}>Create</Button>
        </div>
    )
}

export default CreateCompany