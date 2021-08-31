import React,{useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App';

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const {state, dispatch} = useContext(UserContext);

    console.log(state)
    useEffect(() => {
        fetch('/api/myPosts', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            }
        })
        .then(res=>res.json())
        .then(result => {
            setPics(result.myPosts)
        })
    },[]);
    return (
        <div>
            <div className="profile-header">

                    <img className="profile-pic" src={state?state.pic:""} />
 
                <div className="details">
                    <div className="user-name">{state?state.name:'Loading'}</div>
                    <div className="user-email">{state?state.email:'Loading'}</div>
                    <div className="user-activity-details">
                        <div>{mypics.length} posts</div>
                        <div>{state?state.followers.length:'0'} followers</div>
                        <div>{state?state.following.length:'0'} following</div>
                    </div>
                </div>

            </div>
            
            <div className="gallery">
            {mypics.map(item => 
                <img key={item._id} className="item" src={item.url} />
            )}
            </div>
        </div>

    );
}


export default Profile;