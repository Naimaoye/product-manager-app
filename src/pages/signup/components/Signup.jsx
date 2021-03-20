import React, { useState, useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useHistory, Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Input, Button } from 'antd';

const Loader = () => (
  <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
  </div>
);

export const Signup = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');
  const { addToast } = useToasts();
  const history = useHistory();
  const [signupInfo, setSignupInfo] = useState({ email: '', phoneNumber: '', address: '',password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setSignupInfo({
        ...signupInfo, [e.target.name]: e.target.value,
    });
};
const { email, password, phoneNumber, address } = signupInfo;

  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };

  const signinUser = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({"email": email,"password":password, "phoneNumber": phoneNumber, "address": address });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
     let fetchRes = await fetch("https://product-manager-app.herokuapp.com/api/signup", requestOptions);
            if(fetchRes.ok){
                await fetchRes.json();
                addToast(`Registration successful`, {
                    appearance: 'success',
                    autoDismiss: true,
                });
                history.push('/login');
            }else{
            throw fetchRes;
            }
    } catch (e){
        let msg = 'Signup failed';
            setLoading(false);
            addToast(msg, {
                appearance: 'error',
                autoDismiss: true,
            });
        };
    
    };
    const handleFormSubmit = e => {
      console.log('here')
        const { email, password, phoneNumber, address } = signupInfo;
        if (email !== '' || password !== '' || phoneNumber !== '' || address !== '') {
            e.preventDefault();
            setLoading(true);
            signinUser();
        }
    };

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;
  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: {
            span: 14,
            offset: 4,
          },
        }
      : null;
  return (
    <div className="styledSection">
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{
          layout: formLayout,
        }}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="email">
          <Input placeholder="email" name="email" value={email} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="phone">
          <Input placeholder="phone number" name="phoneNumber" value={phoneNumber} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="address">
          <Input placeholder="address" name="address" value={address} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="password">
          <Input placeholder="password" name="password" value={password} onChange={handleChange}/>
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button type="primary"  onClick={handleFormSubmit}>
            {
                !loading ? 'Submit' : <Loader />
            }
            </Button>
        </Form.Item>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </Form>
    </div>
  );
};
