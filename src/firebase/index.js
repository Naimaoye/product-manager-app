import firebase from 'firebase/app';

import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCXhBjZWmBbL3Ksn9iiIXvoX61d9_V7K3o",
    authDomain: "product-manatgemen.firebaseapp.com",
    projectId: "product-manatgemen",
    storageBucket: "product-manatgemen.appspot.com",
    messagingSenderId: "240222130743",
    appId: "1:240222130743:web:07b43f386e42fb9e1d65b2",
    measurementId: "G-1CP3YSXE51"
  };

  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  export { storage, firebase as default };