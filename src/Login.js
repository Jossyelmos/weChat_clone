import React, {useState} from 'react';
import './Login.css';
import { Button, Link, InputLabel, Input } from '@mui/material';
import Modal from '@mui/material/Modal';
import { auth, storage } from './firebase';
import { useDispatch } from 'react-redux';
import { login } from './features/counter/userSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Login() {
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const signin = async event => {
    event.preventDefault();

    try {
      const authUser = await auth.signInWithEmailAndPassword(email, password);
      dispatch(login({
        email: authUser.user.email,
        uid: authUser.user.uid,
        displayName: authUser.user.displayName,
        photoURL: authUser.user.photoURL
      }));
      setOpenSignIn(false);
    } catch (error) {
      alert(error.message);
    }


  }

  const signup = async event => {
    event.preventDefault();

    try {
      if (!username) {
        throw new Error('Please enter a username');
      }

      const result = await auth.createUserWithEmailAndPassword(email, password);
      let imageURL = null;

      if (image) {
        const uploadedImageSnapshot = await storage.ref(`users/${result.user.uid}${image.name}/`).put(image);
        imageURL = await uploadedImageSnapshot.ref.getDownloadURL();
        console.log(uploadedImageSnapshot);
      }

      console.log(result);
      console.log(imageURL);
      await result.user.updateProfile({
        displayName: username,
        photoURL: imageURL
      });

      dispatch(login({
        email: result.user.email,
        uid: result.user.uid,
        displayName: username,
        photoURL: imageURL
      })
      );
      setOpenSignUp(false);
        
          
    } catch (error) {
      alert(error.message); 
    }
  };

  const handleImageChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }
    
    return (
      <div className="login">
        <div className="login_container">
          <img src='https://logodownload.org/wp-content/uploads/2019/08/wechat-logo.png' alt="" />
          <div className="login_text">
            <h1>
              Sign in to WeChat clone made by Jossyelmos
            </h1>
          </div>
          <div>
            <Button onClick={() => setOpenSignIn(true)}>
              Sign In
            </Button>
          </div>
          <div>
            <Link onClick={() => setOpenSignUp(true)} href='#'>
              Don't have an account? Sign Up
            </Link>
          </div>
          <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
          >
            <div style={style}>
              <form className="login_signup">
                <img src="https://logodownload.org/wp-content/uploads/2019/08/wechat-logo.png" alt="" className="login_headerImage" />

                <Input
                  type="text"
                  placeholder='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type='submit' onClick={signin}> Sign In</Button>
              </form>
            </div>
          </Modal>
          <Modal
            open={openSignUp}
            onClose={() => setOpenSignUp(false)}
          >
            <div style={style}>
              <form className="login_signup">
                <img src="https://logodownload.org/wp-content/uploads/2019/08/wechat-logo.png" alt="" className="login_headerImage" />

                <Input
                  type="text"
                  placeholder='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  type="text"
                  placeholder='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <InputLabel htmlFor="image" variant='filled' shrink={true} >Profile Picture (optional)</InputLabel>
                <Input
                  id='image'
                  placeholder='upload an image'
                  type='file'
                  onChange={handleImageChange}
                />

                <Button type='submit' onClick={signup}> Sign Up</Button>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    )
  }


export default Login