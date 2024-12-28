import { Center, Heading, Image, VStack } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Posts from '../components/Posts'
import UserCard from '../components/UserCard'
import AuthContext from '../context/AuthContext'
import PostService from '../services/PostService'
import svg from '../svgs/undraw_no_data_re_kwbl.svg'
import UserService from '../services/UserService'

function Profile() {
    const { userId } = useParams()
    const { user } = useContext(AuthContext)
    const [posts, setPosts] = useState([])
    const [viewedUser, setViewedUser] = useState({})
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [isOwner, setIsOwner] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    
    // Memoize service instances
    const postService = useMemo(() => new PostService(), [])
    const userService = useMemo(() => new UserService(), [])
   
    const getData = useCallback(async () => {
        try {
            const result = await postService.getAllByUserId(userId, localStorage.getItem("token"))
            setPosts(result.data)
        } catch (error) {
            console.log(error.message)
        }
    }, [userId, postService])

    const getUser = useCallback(async () => {
        try {
            const result = await userService.getById(userId, localStorage.getItem("token"))
            setViewedUser(result.data)
            setFollowing(result.data.following)
            setFollowers(result.data.followers)
        } catch (error) {
            console.log(error.message)
        }
    }, [userId, userService]) // Removed isFollowing dependency as it's not needed

    const checkIsFollowing = useCallback(async () => {
        try {
            const result = await userService.isFollowing(user.id, userId, localStorage.getItem("token"))
            setIsFollowing(result.data)
        } catch (error) {
            console.log(error.message)
        }
    }, [userId, user.id, userService])

    const checkIsOwner = useCallback(() => {
        if (userId === user.id) { // Changed == to ===
            setIsOwner(true)
        } else {
            setIsOwner(false)
        }
    }, [userId, user.id])

    useEffect(() => {
        getData()
        getUser()
        checkIsFollowing()
        checkIsOwner()
    }, [getData, getUser, checkIsFollowing, checkIsOwner])

    return (
        <>
            <Nav />
            <UserCard
                fullName={`${viewedUser.name} ${viewedUser.lastName}`}
                following={following.length}
                followers={followers.length}
                isFollowing={isFollowing}
                isOwner={isOwner}
                userId={userId}
                checkIsFollowing={checkIsFollowing}
            />
            {posts.length === 0 ? (
                <Center>
                    <VStack h={'100vh'} alignItems={'center'} justifyContent={'center'}>
                        <Heading>No posts to show</Heading>
                        <Image src={svg} h={'50vh'} />
                    </VStack>
                </Center>
            ) : (
                <Posts posts={posts} />
            )}
        </>
    )
}

export default Profile