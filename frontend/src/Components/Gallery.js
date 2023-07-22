import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";
import SearchInput from "./SearchInput";
import { getToken } from "../utils/helper";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [mainImages, setMainImages] = useState([]);
  const [liked, setLiked] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  const handleAlbumCreate = async (e) => {
    e.preventDefault();
    if (albumName.length > 10) {
      alert("Album name must be less than or equal to 10 characters.");
      return;
    }
    const authToken = getToken();
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
       await axios.post(
        "http://localhost:4000/albums",
        {
          name: albumName,
        },
        {
          headers,
        }
      );
      console.log("Album created successfully");
      setAlbumName("");
      fetchData(); 
    } catch (error) {
      alert("Album is already created")
      setSelectedAlbum("")
      console.error("Error creating album:", error.message);
    }
  };

  const fetchAlbums = async () => {
    const authToken = getToken();
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      const response = await axios.get("http://localhost:4000/albums", {
        headers,
      });
      
      const data = response.data;
      console.log("Albums fetch successfully");
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error.message);
    }
  };

  const handleAlbumSelect = (e) => {
    setSelectedAlbum(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const maxSize = 3 * 1024 * 1024; // 3 MB (in bytes)
      if (file.size <= maxSize) {
        setSelectedFile(file);
      } 
      
    } else {
      
      setSelectedFile(null);
      alert("Please select an image file.");
    }
    
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !selectedAlbum) {
      alert("please select specific folder");
      return;
    }

    const formData = new FormData();
    formData.append("album", selectedAlbum);
    formData.append("image", selectedFile);
    const authToken = getToken();
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      await axios.post("http://localhost:4000/image", formData, { headers });
      console.log("Upload image successfully on specific album");
      setSelectedFile(null);
      fetchAlbums();
      fetchData();
    } catch (error) {
      alert("Image is already upload")
      setSelectedFile(null);
      console.error("Error uploading image on specific album:", error.message);
    }
  };

  const handleShareIconClick = async (image) => {
     setSelectedImage(image);
  
  };
  

  const handleLike = async (imageId) => {
    const authToken = getToken();
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
    
      const response = await axios.post(
        `http://localhost:4000/${imageId}/like`,
        { liked: !liked },{headers}
      );
      console.log("Like successfully on image");
      setLiked(response.data);
      fetchData();
    } catch (error) {
        console.error("Error of liking image:", error.message);
    }
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleDownloadImage = (imageName) => {
    const imageDownloadUrl = `http://localhost:4000/${imageName}`;
    window.open(imageDownloadUrl, "_blank");
  };

  const handleShareOnFacebook = (imageName) => {
    const imageUrl = `http://localhost:4000/${imageName}`;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      imageUrl
    )}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleShareOnWhatsApp = (imageName) => {
    const imageUrl = `http://localhost:4000/${imageName}`;
    const shareText = `Check out this awesome image: ${imageUrl}`;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareOnInstagram = (imageName) => {
    const imageUrl = `http://localhost:4000/${imageName}`;
    const caption = "Check out this awesome image!";
    const shareUrl = `https://www.instagram.com/share?url=${encodeURIComponent(
      imageUrl
    )}&caption=${encodeURIComponent(caption)}`;
    window.open(shareUrl, "_blank");
  };

  const handleShareOnTwitter = (imageName) => {
    const imageUrl = `http://localhost:4000/${imageName}`;
    const tweetText = "Check out this awesome image!";
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      imageUrl
    )}&text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const fetchData = async () => {
    const authToken = getToken();
    const headers = { Authorization: `Bearer ${authToken}` };

    try {
     
      let url = "http://localhost:4000/images/";
      if (selectedAlbum) {
        url += `?albumId=${selectedAlbum}`;
      }

      const response = await axios.get(url, {
        headers,
      });
      const data = response.data;
      setImages(data);
      setMainImages(data);
    } catch (error) {
      console.error("Error fetching images:", error.message);
    }
  };

  useEffect(() => {
    if (searchInput === "") {
      setImages(mainImages);
      return;
    }

    const filteredName = mainImages.filter((image) => {
      const isNameMatch = image.imageName
        .toLowerCase()
        .includes(searchInput.toLowerCase());
      const isDateMatch = image.date
        .toLowerCase()
        .includes(searchInput.toLowerCase()); 
      return isNameMatch || isDateMatch;
    });

    setImages(filteredName);
  }, [searchInput, mainImages]);

  useEffect(() => {
    fetchData();
  }, [selectedAlbum]);

  useEffect(() => {
    fetchAlbums();
  }, [albumName]);

  useEffect(() => {
    fetchData();
    fetchAlbums();
  }, []);

  return (
    <div>
      <SearchInput handleSearchInput={handleSearchInput}></SearchInput>
      <form onSubmit={handleAlbumCreate}>
        <input
          type="text"
          placeholder="Album Name"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
        <button type="submit">Create Album</button>
      </form>
      <select value={selectedAlbum} onChange={handleAlbumSelect}>
        <option value="">Select Album</option>
        {albums.map((album) => (
          <option key={album._id} value={album._id}>
            {album.name}
          </option>
        ))}
      </select>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleImageUpload}>Upload Image</button>
      {images?.map((image) => (
        <React.Fragment key={image._id}>
          <p>comment : {image.comment}</p>
          <button onClick={() => handleLike(image._id)}>
            {image.like === true ? (
              <i className="fa-solid fa-heart"></i>
            ) : (
              <i className="fa-regular fa-heart"></i>
            )}
          </button>
          <img
            key={image._id}
            src={`http://localhost:4000/${image.imageName}`}
            alt={image.imageName}
            width={100}
            height={100}
          />
          <p>{image.imageName}</p>
          <button onClick={() => handleDownloadImage(image.imageName)}>
            Download Image
          </button>
          <div>
            <button onClick={() => handleShareIconClick(image)}>Share</button>
            {selectedImage && selectedImage._id === image._id && (
              <div>
                <button onClick={() => handleShareOnFacebook(image.imageName)}>
                  Share on Facebook
                </button>
                <button onClick={() => handleShareOnInstagram(image.imageName)}>
                  Share on Instagram
                </button>
                <button onClick={() => handleShareOnWhatsApp(image.imageName)}>
                  Share on WhatsApp
                </button>
                <button onClick={() => handleShareOnTwitter(image.imageName)}>
                  Share on Twitter
                </button>
              </div>
            )}
          </div>
          <CommentForm
            imageId={image._id}
            onCommentSubmit={fetchData}
          ></CommentForm>
        </React.Fragment>
      ))}
    </div>
  );
}
