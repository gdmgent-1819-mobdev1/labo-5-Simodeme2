// Firebase
var config = {
    apiKey: "AIzaSyCXbdAHOECBL9JW7rGgxZKAKy5UIq7xzgs",
    authDomain: "fir-auth-147d8.firebaseapp.com",
    databaseURL: "https://fir-auth-147d8.firebaseio.com",
    projectId: "fir-auth-147d8",
    storageBucket: "fir-auth-147d8.appspot.com",
    messagingSenderId: "1037978220970"
};
firebase.initializeApp(config);

let createPostBtn = document.getElementById('createPostBtn');
let signup = document.getElementById('signup');
let login = document.getElementById('login');
let signOut = document.getElementById('signout');
let recoverPassword = document.getElementById('recover_password');
let recoverPasswordBtn = document.getElementById('recover_password_btn');
let error = document.querySelector('.error__text');


function onSignUp() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
        console.log("Success");
        // createNotification(`Rocket League`, `fdlksfgkldfg`);
    })
    .catch(err => {
        error.innerHTML = err.message; 
    });
}

function onLogIn() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        console.log("Success");
        // createNotification(`Logged in`, `fdlksfgkldfg`);
        window.location.replace('../index.html');
    })
    .catch(err => {
        error.innerHTML = err.message; 
    });
}

function passwordReset() {
    firebase.auth().sendPasswordResetEmail(recoverPassword.value).then(() => {
        console.log("Password Reset email send"); 
    }).catch(function(err) {
        console.log(err.message);
        error.innerHTML = err.message; 
    })
}

function onSignOut() {
    firebase.auth().signOut().then(() => {
        console.log("Logged out");
        window.location.reload();
    }).catch((err) => {
        console.log(err.message);
    }) 
}

function checkUser() {
    let loginNav = document.getElementById('loginNav');
    let signUpNav = document.getElementById('signUpNav');
    let signOutNav = document.getElementById('signOutNav');
    let userName = document.querySelector('.username');

    firebase.auth().onAuthStateChanged((user) => {
        if(user) {
            console.log('Currently logged in user: ', user);
            user.displayName ? userName.innerHTML = `Welkom ${user.displayName}` : userName.innerHTML = `Welkom ${user.email}`;
            userName.style.display   = "block";
            signOutNav.style.display = "block";
            loginNav.style.display   = "none";
            signUpNav.style.display  = "none";
        } else {
            userName.style.display   = "none";
            signOutNav.style.display = "none";
            loginNav.style.display   = "block";
            signUpNav.style.display  = "block";
        }
    });
}

function createPost() {
    let title = document.getElementById('title').value;
    let body = CKEDITOR.instances.editor.getData();
    let author = firebase.auth().currentUser.email;
    let time = new Date().getTime();
    let id = new Date().getTime() + Math.round(Math.random()*new Date().getTime());

    const post = {
        id: id,
        title: title,
        body: body,
        author: author,
        time: time,
    }

    firebase.database().ref('posts').push(post);
    window.location.reload();
}

function loadPosts() {
    const posts = document.querySelector('.posts');

    firebase.database().ref('posts').on('value', (snap) => {
        const data = snap.val();
        console.log(data);

        snap.forEach((data) => {
            const post = data.val();
            posts.innerHTML += 
            `
            <div class="posts__card">
                <h2 class="posts__title">${ post.title }</h2>
                <div class="posts__body">${ post.body }</div>
                <div class="posts__meta">
                    <p class="posts__author">${ post.author }</p>
                    <p class="posts__time">${ post.time }</p>
                </div>
            </div> 
            `;
        });
    });
}

window.addEventListener('load', () => {
    CKEDITOR.replace('editor');
    checkUser();
    loadPosts();
});

if(createPostBtn) {
    createPostBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createPost();   
    });
}

if(signup) {
    signup.addEventListener('click', (e) => {
        e.preventDefault();
        onSignUp();
    });
}

if(login) {
    login.addEventListener('click', (e) => {
        e.preventDefault();
        onLogIn();
    });
}

if(signOut) {
    signOut.addEventListener('click', (e) => {
        e.preventDefault();
        onSignOut();
    });
}

if(recoverPassword) {
    recoverPasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        passwordReset();
    });
}















// function isSupported() {
//     return ('Notification' in window) ? true : false;
// }

// function reqPerms() {
//     if(Notification && Notification.permission === 'default') {
//         Notification.requestPermission((permission) => {
//             if(!('permission' in Notification)) {
//                 Notification.permission = permission;
//             }
//         })
//     }    
// }

// function createNotification(title, text) {
//     if(Notification.permission === 'granted') {
//         const notification = new Notification(title, {
//             body: text
//         });

//         setTimeout(notification.close.bind(notification), 5000);
//     }
// }

// if(isSupported) {
//     reqPerms();
// }