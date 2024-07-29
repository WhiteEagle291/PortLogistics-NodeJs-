// public/js/socket.js
const socket = io();

function sendUserInfo(username) {
    const userInfo = {
        username: username,
    };
    socket.emit('sendUserInfo', userInfo);
}



socket.on('broadcastUserInfo', (userInfo) => {
    console.log('User info received:', userInfo);
  
    const userSquare = document.createElement('div');
    userSquare.className = 'div-square user-square';
    userSquare.innerHTML = `
        <i class="fa-solid fa-user"></i>
        <h4>${userInfo.username}</h4>
    `;
    userSquare.dataset.username = userInfo.username;
    userSquare.dataset.otherInfo = userInfo.otherInfo;
    
    userSquare.addEventListener('click', () => {
        showUserPopup(userInfo.username, userInfo.otherInfo);
    });


    const userDisplay = document.getElementById('userDisplay');
    userDisplay.appendChild(userSquare);
});

socket.on('loginUser', async (credentials) => {
    console.log('User login attempt:', credentials);

   
    if (!credentials || !credentials.username || !credentials.password) {
        console.log('Invalid credentials format');
        socket.emit('loginFailure', 'Invalid username or password');
        return;
    }


    try {
        
        const user = await UserRepository.getUserByUsername(credentials.username.trim());

        console.log('User retrieved from database:', user); 

        if (user) {
            
            console.log('Stored password:', user.password);
            console.log('Provided password:', credentials.password);

           
            if (user.password === credentials.password.trim()) {
                socket.emit('loginSuccess', user);
            } else {
                console.log('Invalid password');
                socket.emit('loginFailure', 'Invalid username or password');
            }
        } else {
            console.log('User not found'); 
            socket.emit('loginFailure', 'Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        socket.emit('loginFailure', 'An error occurred during login');
    }
});

