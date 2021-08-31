import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams()

    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)

    useEffect(() => {
        fetch(`/api/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result)
            })
    }, [])

    const followUser = () => {
        fetch('/api/user/follow', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                followeeId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        followers: data.followers,
                        following: data.following,
                    },
                });
                localStorage.setItem('user', JSON.stringify(data));
                setProfile(prevState => {

                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        },
                    }
                })
                setShowFollow(false)
            })
    }

    const unfollowUser = () => {
        fetch('/api/user/unfollow', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                followeeId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        followers: data.followers,
                        following: data.following,
                    },
                });
                localStorage.setItem('user', JSON.stringify(data));
                setProfile(prevState => {
                    const newFollowers = prevState.user.followers.filter(item => item != data._id);
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollowers,
                        },
                    }
                })
                setShowFollow(true)
            })
    }

    return (
        <>
            {userProfile ?
                <div>
                    <div className="profile-header">
             
                        <img className="profile-pic" src={userProfile.user.pic} />
               
                        <div>
                            <div className="user-name">{userProfile.user.name}</div>
                            <div className="user-email">{userProfile.user.email}</div>

                            <div className="user-activity-details">
                                <div>{userProfile.posts ? userProfile.posts.length : 0} posts</div>
                                <div>{userProfile.user.followers ? userProfile.user.followers.length : 0} followers</div>
                                <div>{userProfile.user.following ? userProfile.user.following.length : 0} following</div>
                            </div>

                            {showfollow ?
                                    <button className="follow-btn" className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                        onClick={() => followUser()}
                                    >
                                        Follow
                                    </button>
                                    :
                                    <button className="unfollow-btn"
                                        
                                        className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                        onClick={() => unfollowUser()}
                                    >
                                        UnFollow
                                    </button>

                                }
           
                        </div>

                    </div>

                    <div className="gallery">
                        {userProfile.posts.map(item =>
                            <img key={item._id} className="item" src={item.url} />
                        )}
                    </div>
                </div>
                : <h5>Loading...</h5>
            }
        </>

    );
}


export default UserProfile;