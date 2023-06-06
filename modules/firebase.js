 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 // Your web app's Firebase configuration
 console.log(process.env.RENDER_ENV);
 const firebaseConfig = {
   apiKey: "AIzaSyBm1j6wFnkSl9zMr8L3V7n3dFTDv-vvF-A",
   authDomain: "nuxtestapp.firebaseapp.com",
   databaseURL: "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "nuxtestapp",
   storageBucket: "nuxtestapp.appspot.com",
   messagingSenderId: "596860799561",
   appId: "1:596860799561:web:768d3edf83c14ea0550d98"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 export default app;