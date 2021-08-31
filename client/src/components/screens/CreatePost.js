import React, {useState, useEffect} from 'react';

const CreatePost = () => {

    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if(url){
            fetch('/api/createPost', {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    caption,
                    url,
                }) 
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
            })
        }
    }, [url])
    
    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
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

    return (
        <div className="card input-filled">
            <input type="text" placeholder="Caption" onChange={(e)=>setCaption(e.target.value)}></input>
            <div className="file-field input-field">
                <div className="btn waves-effect wave blue-button">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
                <button className="btn waves-effect wave" onClick={()=>postDetails()}>
                    Post to feed
                </button>
            </div>
        </div>
    )
}

export default CreatePost;