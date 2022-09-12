const firebaseConfig = {
  apiKey: "AIzaSyDwGNH3RxILSlbrtL145NAdUZUNKBIbvFI",
  authDomain: "library-store-cb5fb.firebaseapp.com",
  databaseURL: "https://library-store-cb5fb-default-rtdb.firebaseio.com",
  projectId: "library-store-cb5fb",
  storageBucket: "library-store-cb5fb.appspot.com",
  messagingSenderId: "209356641156",
  appId: "1:209356641156:web:6bdc60c65318799d84c3d1",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let myDatabase = firebase.database();
