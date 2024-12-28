import { Flex, Card, CardHeader, CardBody, CardFooter, Button, Avatar, Box, Heading, Text, Image } from '@chakra-ui/react'
import { useCallback, useContext, useEffect, useState, useMemo } from 'react'
import { BiLike, BiShare } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import LikeService from '../services/LikeService'
import CommentModal from './CommentModal'

function PostCard({ userName, userImage, description, postImage, postId, userId }) {
    // Memoize the likeService instance to prevent recreation on each render
    const likeService = useMemo(() => new LikeService(), []);
    const { user } = useContext(AuthContext)
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState([])

    const handleLike = useCallback(async () => {
        try {
            await likeService.add(user.id, postId, localStorage.getItem("token"))
            getLikes()
        } catch (error) {
            console.log(error)
        }
    }, [likeService, user.id, postId, getLikes]); // Added dependencies

    const handleUnlike = useCallback(async () => {
        try {
            await likeService.delete(user.id, postId, localStorage.getItem("token"))
            getLikes()
        } catch (error) {
            console.log(error)
        }
    }, [likeService, user.id, postId, getLikes]); // Added dependencies

    const getLikes = useCallback(async () => {
        try {
            const result = await likeService.getLikesByPost(postId, localStorage.getItem("token"))
            setLikes(result.data)
        } catch (error) {
            console.log(error)
        }
    }, [likeService, postId])

    const checkIsLiked = useCallback(async () => {
        try {
            const result = await likeService.isLiked(user.id, postId, localStorage.getItem("token"))
            setIsLiked(result.data)
        } catch (error) {
            console.log(error)
        }
    }, [likeService, user.id, postId]) // Removed likes.length as it's not needed

    useEffect(() => {
        checkIsLiked()
        getLikes()
    }, [checkIsLiked, getLikes])

    return (
        <Card maxW='lg'>
            <CardHeader as={Link} to={`/profile/${userId}`}>
                <Flex spacing='4'>
                    <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                        <Avatar name={userName} src={userImage} />
                        <Box>
                            <Heading size='sm'>{userName}</Heading>
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
            <CardBody>
                <Text>
                    {description}
                </Text>
            </CardBody>
            {
                <Image
                    maxW={'md'}
                    maxH={'sm'}
                    objectFit='contain'
                    src={postImage}
                    fallback={null}
                />
            }

            <CardFooter
                justify='space-between'
                flexWrap='wrap'
                sx={{
                    '& > button': {
                        minW: '136px',
                    },
                }}
            >
                {
                    isLiked ?
                        <Button onClick={handleUnlike} flex='1' colorScheme={'pink'} leftIcon={<BiLike />}>
                            Like {likes.length}
                        </Button>
                        : <Button onClick={handleLike} flex='1' variant='ghost' leftIcon={<BiLike />}>
                            Like {likes.length}
                        </Button>
                }

                <CommentModal postId={postId} />
                <Button flex='1' variant='ghost' leftIcon={<BiShare />}>
                    Share
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PostCard