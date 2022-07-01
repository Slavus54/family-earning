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

const Earning = ({params}) => {
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [panel, setPanel] = useState([
        {
            label: 'North',
            lat: '+',
            long: ''
        },
        {
            label: 'South',
            lat: '-',
            long: ''
        },
        {
            label: 'West',
            lat: '',
            long: '-'
        },
        {
            label: 'East',
            lat: '',
            long: '+'
        }
    ])
    const [places, setPlaces] = useState([])
    const [place, setPlace] = useState(null)
    const [cords, setCords] = useState(null)
    const [user, setUsers] = useState(null)
    const [family, setFamily] = useState(null)
    const [child, setChild] = useState(null)
    const [fact, setFact] = useState(null)
    const [isTrue, setIsTrue] = useState(false)
    const [tasks, setTasks] = useState(null)
    const [task, setTask] = useState(null)
    const [todo, setTodo] = useState(null)
    const [hp, setHp] = useState(0)
    const [companies, setCompanies] = useState(null)
    const [company, setCompany] = useState(null)
    const [item, setItem] = useState(null)
    const [replic, setReplic] = useState('')
    const [speed, setSpeed] = useState(10)
    const [energy, setEnergy] = useState(10)    
    const [price, setPrice] = useState(0)  

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

    const getTasksM = gql`
      mutation getTasks($name: String!) {
        getTasks(name: $name) {
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
      }
    `

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

    const [getTasks] = useMutation(getTasksM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getTasks !== undefined) {
                console.log(result.data.getTasks)
                setTasks(result.data.getTasks)
            }
        }
    })

    const [getFamily] = useMutation(getFamilyM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getFamily !== undefined) {
                console.log(result.data.getFamily)
                setFamily(result.data.getFamily)
            }
        }
    })

    const haversine = (lat1, long1, lat2, long2) => {
        let r = 6371

        let latDiff = Math.PI * (lat2 - lat1) / 180
        let longDiff = Math.PI * (long2 - long1) / 180
    
        let sin = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(Math.PI * lat1 / 180) * Math.cos(Math.PI * lat2 / 180) * Math.sin(longDiff / 2) * Math.sin(longDiff / 2)
        let a = 2 * Math.atan2(Math.sqrt(sin), Math.sqrt(1 - sin))

        return a * r
    }

    useEffect(() => {
        if (tasks !== null && company !== null && place !== null && place.format === 'Working') {
            let rand = tasks[parseInt(Math.random() * tasks.length)]

            if (rand !== undefined) {
                setTask(rand)
            }
        }
    }, [place])

    useEffect(() => {
        if (place !== null && tasks !== null && company !== null && child !== null && task !== null && todo !== null) {
            if (hp > 0) {
                let filtered = company.replicas.filter(el => el.placeId === place.id) 

                let rand = filtered[parseInt(Math.random() * filtered.length)]

                if (rand !== undefined) {
                    setReplic(rand.replic)
                }
            } else {

                if (todo !== null && task !== null) {
                    let allDur = (parseInt(task.allDuration.split(':')[0]) * 60) + parseInt(task.allDuration.split(':')[1])
                    let todoDur = (parseInt(todo.duration.split(':')[0]) * 60) + parseInt(todo.duration.split(':')[1])

                    setPrice(price + ((todoDur / allDur) * task.price))
                }
              
                setTodo(null)
                
            }
        }
    }, [hp])

    useEffect(() => {
        if (tasks !== null && company !== null && child !== null && task !== null && todo !== null) {
            let todoDur = (parseInt(todo.duration.split(':')[0]) * 60) + parseInt(todo.duration.split(':')[1])

            setHp(todo.todo.length * todoDur)
        }
    }, [todo])
    
    useEffect(() => {
        if (company !== null && cords !== null && places.length > 0 && place !== null) {
            let raz = [[cords.lat - 0.0005, cords.lat + 0.0005], [cords.long - 0.0005, cords.long + 0.0005]]

            if (place.dot.lat <= raz[0][1] && place.dot.lat >= raz[0][0] && place.dot.long <= raz[1][1] && place.dot.long >= raz[1][0]) {

            } else {
                setPlace(null)
            }
        }
    }, [cords])

    useEffect(() => {
        if (company !== null && cords !== null && places.length > 0 && place === null) {
            let filtered = places

            let raz = [[cords.lat - 0.0005, cords.lat + 0.0005], [cords.long - 0.0005, cords.long + 0.0005]]

            filtered = filtered.filter(el => el.dot.lat <= raz[0][1] && el.dot.lat >= raz[0][0] && el.dot.long <= raz[1][1] && el.dot.long >= raz[1][0])

            let rand = filtered[parseInt(Math.random() * filtered.length)]

            if (rand !== undefined) {
                setPlace(rand)
            }
        }
    }, [cords])


    useEffect(() => {
        if (company !== null && cords !== null) {
            let filtered = company.places.filter(el => places.find(e => e.id === el.id) === undefined)

            let raz = [[cords.lat - 0.0005, cords.lat + 0.0005], [cords.long - 0.0005, cords.long + 0.0005]]

            filtered = filtered.filter(el => el.dot.lat <= raz[0][1] && el.dot.lat >= raz[0][0] && el.dot.long <= raz[1][1] && el.dot.long >= raz[1][0])

            let rand = filtered[parseInt(Math.random() * filtered.length)]

            if (rand !== undefined) {
                setPlaces([...places, rand])
            }
        }
    }, [cords])

    useEffect(() => {
        if (user !== null) {
            getFamily({
                variables: {
                    name: user.name, shortid: params.id
                }
            })

            getTasks({
                variables: {
                    name: user.name
                }
            })

            getCompanies({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    const onManage = el => {
        
        let newCords = {
            lat: el.lat === '' ? cords.lat : eval(`${cords.lat}${el.lat}${speed/10000}`),
            long: el.long === '' ? cords.long : eval(`${cords.long}${el.long}${speed/10000}`)
        }

        let dist = haversine(cords.lat, cords.long, newCords.lat, newCords.long)

        if (parseInt(dist * 10) <= energy) {
            setEnergy(energy - parseInt(dist * 10))
            setCords(newCords)
        }
    }

    const onGetF = () => {
        let filtered = family.facts.filter(el => el.FIO === child.FIO)
        let rand = filtered[parseInt(Math.random() * filtered.length)]

        if (rand !== undefined) {
            setFact(rand)
        }
    }

    const onFactAns = () => {
        if (fact.isTrue === isTrue) {
            setEnergy(energy + fact.energy)
        }

        setFact(null)
    }

    const onGenComp = () => {
        let rand = companies[parseInt(Math.random() * companies.length)]

        if (rand !== undefined) {
            setCompany(rand)
            setCords(rand.cords)
            setPlaces([])
        }
    }

    const onBuy = el => {
        setPrice(price - el.price)
    }

    return (
        <div className="con">
            <h2>Earning</h2>
            {user !== null && family !== null && companies !== null && tasks !== null &&
                <>
                    <h3>Choose Child and Generate Company</h3>
                    <div className='invs'>
                        {family.childs.map(el => (
                            <Card className='inv' onClick={() => setChild(el)}>
                                <CardContent>
                                    <Typography>{el.FIO}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Button onClick={onGenComp}>Generate</Button>
                    {company !== null && cords !== null && child !== null &&
                        <>
                            <Typography>{company.title}</Typography>
                            <Typography>{places.length}/{company.places.length} places</Typography>
                            <Typography>{energy} energe points</Typography>
                            <Typography>{price} $</Typography>
                            <ReactMapGL {...view} mapboxApiAccessToken={token} onViewportChange={e => setView(e)}>
                                {company.places.filter(el => places.find(e => e.id === el.id) === undefined).map(el => (
                                    <Marker latitude={el.dot.lat} longitude={el.dot.long}>
                                        <div className='con'>
                                            <b>{el.place}</b>
                                        </div>
                                    </Marker>
                                ))}
                                <Marker latitude={cords.lat} longitude={cords.long}>
                                    <div className='con'>
                                        <b>{child.FIO}</b>
                                    </div>
                                </Marker>
                            </ReactMapGL>
                            <Typography>{speed} km/h</Typography>
                            <input value={speed} onChange={e => setSpeed(parseInt(e.target.value))} placeholder="Enter speed" type="range" step={2} />
                            <div className='invs'>
                                {panel.map(el => (
                                    <Card className='inv' onClick={() => onManage(el)}>
                                        <CardContent>
                                            <Typography>{el.label}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {fact === null && <Button onClick={onGetF}>Get act</Button>}
                            {fact !== null &&
                                <>
                                    <Typography>Is {fact.fact} True?</Typography>
                                    <Checkbox value={isTrue} onChange={e => setIsTrue(e.target.checked)}></Checkbox>
                                    <Button onClick={onFactAns}>Answer</Button>
                                </>
                            }
                            {place !== null &&
                                <>
                                    <Typography>{place.place}</Typography>
                                    {place.format === 'Working' && task !== null &&
                                        <>
                                            <Typography>Choose Todo</Typography>
                                            <div className='invs'>
                                                {task.todos.map(el => (
                                                    <Card className='inv' onClick={() => setTodo(el)}>
                                                        <CardContent>
                                                            <Typography>{el.todo}</Typography>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                            {todo !== null &&
                                                <>
                                                    <Typography>{todo.todo}</Typography>
                                                    <Typography>{hp} hp</Typography>
                                                    <Typography>{replic}</Typography>
                                                    <Button onClick={() => setHp(hp - parseInt(Math.random() * child.work))}>Work</Button>
                                                </>
                                            }
                                        </>
                                    }
                                </>
                            }
                            <h4>Items</h4>
                            <div className='invs'>
                                {company.items.filter(el => el.price <= price).map(el => (
                                    <Card className='inv' onClick={() => onBuy(el)}>
                                        <CardContent>
                                            <Typography>{el.item}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Earning