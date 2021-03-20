import React, { useContext, useState } from "react";
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Input, Button, Checkbox } from 'antd';
import { AuthContext } from '../../../context/auth';


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const Loader = () => (
    <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
    </div>
);

export const Signin = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');
    const context = useContext(AuthContext);
    const { addToast } = useToasts();
    const history = useHistory();
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    /** This handles the input changes
     * @param {object} e the onchange event object
     */
    const handleChange = e => {
        setLoginInfo({
            ...loginInfo, [e.target.name]: e.target.value,
        });
    };
    const { email, password } = loginInfo;
    
    const onFormLayoutChange = ({ layout }) => {
      setFormLayout(layout);
    };

    const signinUser = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({"email": email,"password":password});
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        try {
         let fetchRes = await fetch("https://product-manager-app.herokuapp.com/api/signin", requestOptions);
                if(fetchRes.ok){
                  console.log('here')
                    const data = await fetchRes.json();
                    context.login(data);
                    addToast(`Welcome ${email}`, {
                        appearance: 'success',
                        autoDismiss: true,
                    });
                    history.push('/dashboard');
                }else{
                throw fetchRes;
                }
        } catch (e){
            let msg = 'Login failed';
            console.log("error", e);
                setLoading(false);
                addToast(msg, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            };
        
        };
        const handleFormSubmit = e => {
            const { username, password } = loginInfo;
            if (username !== '' || password !== '') {
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
            <Form.Item label="password">
              <Input placeholder="password" name="password" value={password} onChange={handleChange}/>
            </Form.Item>
            <Form.Item {...buttonItemLayout}>
              <Button type="primary"  onClick={handleFormSubmit}>
                {
                    !loading ? 'Login' : <Loader />
                }
                </Button>
            </Form.Item>
          </Form>
        </div>
      );
};
