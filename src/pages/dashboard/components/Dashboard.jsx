import React, { useContext, useState, useEffect } from "react";
import { Divider, Row, Col } from "antd";
import { useToasts } from 'react-toast-notifications';
import {  Button, Card, Modal  } from 'antd';
import { storage } from '../../../firebase';
import 'antd/dist/antd.css';
import './index.css';

const Loader = () => (
  <div className="spinner">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
  </div>
);

export const Dashboard = () => {
  const [productInfo, setProductInfo] = useState({ productName: '', location: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const [url, setUrl] = useState('');
  const [comment, setComment] = useState('');
  const [products, setProducts] = useState([]);
  const [isProducts, setIsProducts] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFileChange = e => {
    if(e.target.files[0]){
      setImage(e.target.files[0]);
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const handleUpload = async () => {
    //api call too 
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {},
      error => {
        console.log(error);
      },
      () => {
        storage
        .ref("images")
        .child(image.name)
        .getDownloadURL()
        .then(url => {
          setUrl(url);
          console.log('values', productName, location, url);
          if (productName !== '' || location !== '' || url == '') {
              setLoading(true);
              submit();
          }
        })
      }
    )
  }

  const submit = async () =>{
    try {
      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const { token } = parsedUser;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      let raw = JSON.stringify({"productName": productName,"imageLink": url, "location": location });
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
     const uploadOne = await fetch("https://product-manager-app.herokuapp.com/api/uploadProduct", requestOptions)
     if(uploadOne.ok){
        const data = await uploadOne.json();
        addToast(`${data.message}`, {
            appearance: 'success',
            autoDismiss: true,
        });
        setLoading(false);
    }else{
    throw uploadOne;
    }
} catch (e){
let msg = 'upload failed';
console.log("error", e);
setLoading(false);
    addToast(msg, {
        appearance: 'error',
        autoDismiss: true,
    });
};
  };

  const handleChange = e => {
    setProductInfo({
        ...productInfo, [e.target.name]: e.target.value,
    });
};
const {  productName, location } = productInfo;
const handleCommentChange = e => {
  setComment(e.target.value);
}


useEffect(async() => {
  try{
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const { token } = parsedUser;
    var myHeadersFetch2 = new Headers();
    myHeadersFetch2.append("Authorization", `Bearer ${token}`);
    var requestOptionsFetch2 = {
      method: 'GET',
      headers: myHeadersFetch2,
      redirect: 'follow'
    };
    const fetchTwo = await fetch('https://product-manager-app.herokuapp.com/api/userLocationProducts', requestOptionsFetch2)
    const productFetch = await fetchTwo.json();
    if(productFetch.data.length >= 1){
      setIsProducts(true)
      setProducts([...productFetch.data]);
    } else{
      setIsProducts(false);
    }
    
  } catch(e){
    console.log(e);
  }

},[]);

return (
  <div style={{ margin: 24 }}>
    <Row>
      <Col span={6}> 
      <h3>UPLOAD NEW PRODUCT</h3>
      <div>
        <label>Name</label>
          <input placeholder="Product name" name="productName" value={productName} onChange={handleChange}/><br />
        <label>location</label>
          <input placeholder="address or location" name="location" value={location} onChange={handleChange}/><br />
        {/* upload part */}
          <input type="file" onChange={handleFileChange} />
        <br />
        <Button type="primary"  onClick={handleUpload}>
                {
                    !loading ? 'Upload' : <Loader />
                }
        </Button>
        </div>
      </Col>
      <Col style={{ height: "200px" }}>
        <Divider type="vertical" style={{ height: "100%", width: "5px" }} />
      </Col>
      <Col span={11}>
        <h3>PRODUCTS AROUND YOU</h3>
        {/* MAP HERE */}
        {
          isProducts ? products.map(product => {
            return(
              <div className="site-card-border-less-wrapper">
              <Card title={product.productName.toUpperCase()} bordered={false} style={{ width: 300 }}>
                <p><b>location:</b> {product.location}</p>
                <p><a href={product.imageLink}>View Product</a></p>
                <div>
                  <textarea name="comment" placeholder="type your comments here!" value={comment} onChange={handleCommentChange}/>
                  <Button type="primary">
                    {
                        !loading ? 'Comment' : <Loader />
                    }
                  </Button>
                </div>
              </Card>
            </div>
            )
          }) : <i>No products available around you</i>
      
        }
      </Col>
    </Row>
  </div>
)
}
