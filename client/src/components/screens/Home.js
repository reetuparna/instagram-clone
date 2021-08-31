import React, { useState, useEffect, useContext } from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from '../../App';

const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch('/api/allPosts', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            },
        })
            .then((res) => res.json())
            .then(result => setData(result.posts))
    }, []);

    const likePost = (postId) => {
        fetch('/api/like', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({ postId })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id == item._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch(err => console.log(err));
    };

    const unlikePost = (postId) => {
        fetch('/api/unlike', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({ postId })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch(err => console.log(err));
    };

    const makeComment = (postId, text) => {
        fetch('/api/comment', {
            method: 'PUT',
            headers: {
                "Authorization": localStorage.getItem('jwt'),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId,
                text,
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if (item._id == result._id) {
                    return result
                } else {
                    return item;
                }
            });
            console.log(newData)
            setData(newData);
        })
        .catch(err => console.log(err));
    }

    const deletePost = (postId) => {
        fetch(`/api/delete/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('jwt'),
            },
        
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.filter(item => {
                if(item._id !== result._id){
                    return item;
                }
            })
            setData(newData);
        })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card">
                            <div className="post-header">
                            <div>
                                <img className="postedBy-image" src={item.postedBy.pic}></img>
                            </div>
                            <div className="postedBy-name">
                                <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>
                                    {item.postedBy.name}
                                </Link>
                                {item.postedBy._id===state._id?
                                    <i className="material-icons delete-post-icon" onClick={() => deletePost(item._id)}>delete</i> 
                                    :null
                                }
                        </div>
                            </div>
                            <div className="card card-image">
                                <img src={item.url} />
                            </div>
                            <div className="card-content">

                                {item.likes.includes(state._id) ? 
                                    <i className="material-icons" onClick={() => unlikePost(item._id)} style={{ color: "red" }}>favorite</i>
                                   :<i className="material-icons" onClick={() => likePost(item._id)}>favorite_border</i>
                                }
                                <h6>{item.likes ? item.likes.length : 0} likes</h6>
                                <h6>{item.title}</h6>
                                <h6>{item.body}</h6>
                                {
                                    item.comments.map(record => {
                                        console.log(record)
                                        return(
                                            <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(item._id, e.target[0].value);

                                }}>
                                    <input type="text" placeholder="Add comment..." className=""></input>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Home;
