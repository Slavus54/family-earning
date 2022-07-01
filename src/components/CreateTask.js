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

const CreateTask = ({params}) => {
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
    const [cats, setCats] = useState(['Construction', 'Lawn', 'Art', 'IT'])
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
    const [age, setAge] = useState('')
    const [prof, setProf] = useState('')
    const [med, setMed] = useState('')
    const [times, setTimes] = useState(['Hours', 'Minutes'])
    const [h, setH] = useState(0)
    const [m, setM] = useState(0)
    const [tod, setTod] = useState({
        todo: '',
        duration: ''
    })
    const [daten, setDaten] = useState({
        title: '',
        category: '',
        level: '',
        professions: [],
        media: [],
        ages: [],
        sex: '',
        todos: [],
        allDuration: 0,
        city: '',
        cords: {},
        deadline: moment().format('DD.MM.YYYY'),
        price: '',
        images: [],
        chooseTime: ''
    })
    
    const {title, category, level, professions, media, ages, sex, todos, allDuration, city, cords, deadline, price, images, chooseTime} = daten
    const {variant, text} = con
    const {key, period, time} = cur
    const {todo, duration} = tod

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

    const createTaskM = gql`
        mutation createTask($name: String!, $id: String!, $title: String!, $category: String!, $level: String!, $professions: [String]!, $media: [String]!, $ages: [Float]!, $sex: String!, $todos: [Todos]!, $allDuration: String!, $city: String!, $cords: Cords!, $deadline: String!, $price: Float!, $images: [String]!)  {
            createTask(name: $name, id: $id, title: $title, category: $category, level: $level, professions: $professions, media: $media, ages: $ages, sex: $sex, todos: $todos, allDuration: $allDuration, city: $city, cords: $cords, deadline: $deadline, price: $price, images: $images) 
        }
    `
    
    const [createTask] = useMutation(createTaskM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.createTask !== undefined) {
                console.log(result.data.createTask)
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

    const onAddColl = key => {
        if (key === 'media') {
            if (media.find(el => el === med) === undefined) {
                setDaten({...daten, media: [...media, med]})
            }

            setMed('')
        } else if (key === 'profession') {
            if (professions.find(el => el === prof) === undefined) {
                setDaten({...daten, professions: [...professions, prof]})
            }

            setProf('')
        }
    }

    const onSetAge = () => {
        if (ages.find(el => el === age) === undefined) {
            setDaten({...daten, ages: [...ages, age]})
        }

        setAge('')
    }

    const onSetTime = znak => {
        if (chooseTime === 'Hours') {
            if (znak === '-' && h > 1) {
                setH(h - 1)
            } else if (znak === '+' && h < 23) {
                setH(h + 1)
            }
        } else {
            if (znak === '-' && m >= 10) {
                setH(h - 10)
            } else if (znak === '+' && m < 60) {
                setH(h + 10)
            }
        }
    }
    
    const onAddTodo = () => {
        if (todos.find(el => el.todo === todo) === undefined) {
            setDaten({...daten, todos: [...todos, tod], allDuration: allDuration + (h * 60) + m})
        }

        setTod({
            todo: '',
            duration: ''
        })
        setH(0)
        setM(0)
    }

    const onSave = () => {
        if (user !== null) {
            console.log(daten)          
            createTask({
                variables: {
                    name: user.name, id: params.id, title, category, level, professions, media, ages, sex, todos, allDuration: `${parseInt(allDuration / 60)}:${parseInt(allDuration % 60)}`, city, cords, deadline, price, images
                }
            })
        }
    }
    
    return (
        <div className="con">
            <h2>Create Task</h2>
            <TextField value={title} onChange={e => setDaten({...daten, title: e.target.value})} placeholder="Enter title of task" />
            <TextField value={category} onChange={e => setDaten({...daten, category: e.target.value})} placeholder="Enter category of task" />
            <Select onChange={e => setDaten({...daten, level: e.target.value})}>
                {levs.map(el => <option value={el}>{el}</option>)}
            </Select>
            <Select onChange={e => setDaten({...daten, sex: e.target.value})}>
                {g.map(el => <option value={el}>{el}</option>)}
            </Select>

            {ages.length < 2 &&
                <>
                    <Typography>Set {ages.length === 0 ? 'Start' : 'End'} Age Border</Typography>
                    <TextField value={age} onChange={e => setAge(parseInt(e.target.value))} placeholder="Enter age" />
                    <Button onClick={onSetAge}>Set</Button>
                </>
            }

            <h3>Add Professions</h3>
            <TextField value={prof} onChange={e => setProf(e.target.value)} placeholder="Enter profession" />
            <Button onClick={() => onAddColl('profession')}>Add</Button>

            <h3>Add Media</h3>
            <TextField value={med} onChange={e => setMed(e.target.value)} placeholder="Enter media" />
            <Button onClick={() => onAddColl('media')}>Add</Button>

            <h3>Add Todos</h3>
            <TextField value={todo} onChang={e => setTod({...tod, todo: e.target.value})} placeholder="Enter title of todo" />
            <Typography>Generate Duration</Typography>
            <Select onChange={e => setDaten({...daten, chooseTime: e.target.value})}>
                {times.map(el => <option value={el}>{el}</option>)}
            </Select>

            <Button onClick={() => onSetTime('-')}>-</Button>
            <Typography>{h}:{m}</Typography>
            <Button onClick={() => onSetTime('+')}>-</Button>
            <Button onClick={onAddTodo}>Add</Button>

            <TextField value={city} onChange={e => setDaten({...daten, city: e.target.value})} placeholder="Enter city of task" />
            <ReactMapGL {...view} onDblClick={setCords} mapboxApiAccessToken={token} onViewportChange={e => setView(e)} />

            <Typography>Generate Deadline</Typography>
            <Select onChange={e => setCur({...cur, period: e.target.value})}>
                {p.map(el => <option value={el}>{el}</option>)}
            </Select>
            <TextField value={time} onChange={e => setCur({...cur, time: parseInt(e.target.value)})} placeholder="Enter times of period" />
            <Typography>{deadline}</Typography>
            <Button onClick={() => onGen('add')}>Add</Button>
            <Button onClick={() => onGen('sub')}>Sub</Button>

            <TextField value={price} onChange={e => setDaten({...daten, price: parseInt(e.target.value)})} placeholder="Enter price of task" />
            
            <TextField type="file" onChange={onUpload} />
            
            <Button onClick={onSave}>Create</Button>
        </div>
    )
}

export default CreateTask