import React, { useState,useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        if(url){
            uploadSignupDetails();
        }
    }, [url]);

    const postData = () => {
        if(profilePic) {
            uploadPic();
        } else {
            uploadSignupDetails();
        }
    }

    const uploadPic = () => {
        const data = new FormData();
        data.append("file", profilePic);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "reetu-cloudinary");

        fetch("https://api.cloudinary.com/v1_1/reetu-cloudinary/image/upload", {
            method: "POST",
            body: data,
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.secure_url);
            setUrl(data.secure_url);
        })
        .catch(err => {
            console.log(err);
        });
        console.log(url)
    }

    const uploadSignupDetails = () => {
        if(profilePic){
            uploadPic();
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url,
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error });
                } else {
                    M.toast({ html: data.message });
                    history.push('/login')
                }
            }).catch(err => {
                console.log(err);
            });
    }
    return (
        <div className="default-card">
            <div className="card auth-card">
                <h2 className="logo">Instagram</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                >
                </input>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                >
                </input>
                <input
                    type="text"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                >
                </input>

                <div className="file-field input-field">
                    <div className="btn waves-effect wave blue-button">
                        <span>Upload profile picture</span>
                        <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>

                </div>
                <button className="btn waves-effect wave" onClick={() => postData()}>
                    Signup
                </button>
            </div>
        </div>
    );
}


export default Signup;