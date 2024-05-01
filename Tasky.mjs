import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNT9OdEHjCTL_WSG8JsAnRXLAJdEMx9n4",
  authDomain: "taskmanager-app-a6cfa.firebaseapp.com",
  projectId: "taskmanager-app-a6cfa",
  storageBucket: "taskmanager-app-a6cfa.appspot.com",
  messagingSenderId: "381047061616",
  appId: "1:381047061616:web:ee02ec943d4760278848b5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginContainer = document.getElementById('loginContainer');
const tasksContainer = document.getElementById('tasksContainer');
const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');

// Firebase authentication
const auth = firebase.auth();

// Firebase Firestore
const firestore = firebase.firestore();
const tasksRef = firestore.collection('tasks');

// Add task to Firestore
const addTask = (task) => {
  tasksRef.add({
    task: task,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
};

// Remove task from Firestore
const removeTask = (taskId) => {
  tasksRef.doc(taskId).delete();
};

// Listen for authentication state changes
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    loginContainer.style.display = 'none';
    tasksContainer.style.display = 'block';
    logoutBtn.style.display = 'block';

    // Load tasks from Firestore
    tasksRef.orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      taskList.innerHTML = '';
      snapshot.forEach(doc => {
        const taskItem = document.createElement('li');
        taskItem.textContent = doc.data().task;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
          removeTask(doc.id);
        });

        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
      });
    });
  } else {
    // User is signed out
    loginContainer.style.display = 'block';
    tasksContainer.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});

// Login event
loginBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(error => console.error(error));
});

// Signup event
signupBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.createUserWithEmailAndPassword(email, password)
    .catch(error => console.error(error));
});

// Logout event
logoutBtn.addEventListener('click', () => {
  auth.signOut().catch(error => console.error(error));
});

// Add task form submit event
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  if (task !== '') {
    addTask(task);
    taskInput.value = '';
  }
});
