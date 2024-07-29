

const connectionString = 'mongodb://localhost:27017';
var userID = "";
var userName = "";
let current_user;
let current_ship;


let loged_user;


let host = document.body;

let possible_warship_names = ["Valor","Thunderbolt","Vengeance","Renegade",
"Dominator","Conqueror","Gladiator","Sentinel"
];
let possible_cargo_names = ["Freightmaster","Cargo Voyager","Merchant Mariner",
"Cargo Cruiser","Logistics Leader","Freighter Express","Container Carrier","Trade Titan"
];
let possible_civilian_names = ["Ocean Odyssey","Island Explorer","Wave Wanderer","Tranquil Tide"];

// let glavniDiv = document.createElement("div");
// glavniDiv.className="glavniDiv";
// glavniDiv.id = "glavniDiv";
// host.appendChild(glavniDiv);

// var form = document.getElementById("login_form");
// function handleForm(event) { event.preventDefault(); } 
// form.addEventListener('submit', handleForm);


document.addEventListener('DOMContentLoaded', async () => {
    const socket = io();



    



    socket.emit('getAllUsers'); 

    socket.on('allUsers', (allUsers) => {
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.innerHTML = ''; 
            allUsers.forEach((userInfo) => {
                const userSquare = createUserSquare(userInfo);
                userDisplay.appendChild(userSquare);
            });
        } else {
            console.error('Element with ID "userDisplay" not found.');
        }
    });

    socket.on('broadcastUserInfo', (userInfo) => {
        const userDisplay = document.getElementById('userDisplay');
        const userSquare = createUserSquare(userInfo);
        userDisplay.appendChild(userSquare);
    });

    function createUserSquare(userInfo) {
        const userSquare = document.createElement('div');
        userSquare.className = 'div-square user-square';
        userSquare.innerHTML = `
            <i class="fa fa-user fa-5x"></i>
            <h4>${userInfo.username}</h4>
        `;
        userSquare.dataset.username = userInfo.username;
        userSquare.dataset.otherInfo = userInfo.otherInfo;

        userSquare.addEventListener('click', () => {
            showUserPopup(userInfo.username, userInfo.otherInfo);
        });
        return userSquare;
    }

    function showUserPopup(username, otherInfo) {
        const popup = document.getElementById('userPopup');
        const overlay = document.getElementById('userPopupOverlay');
        const userInfoText = document.getElementById('userPopupInfo');

        userInfoText.innerHTML = `${username}`;

        popup.style.display = 'block';
        overlay.style.display = 'block';

        document.getElementById('deleteUser').onclick = () => deleteUser(username);
        document.getElementById('updateUser').onclick = () => updateUser(username);

 
        document.getElementById('userPopupClose').addEventListener('click', closeUserPopup);
        document.getElementById('userPopupOverlay').addEventListener('click', closeUserPopup);
    }

    function closeUserPopup() {
        const popup = document.getElementById('userPopup');
        const overlay = document.getElementById('userPopupOverlay');
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }

    function deleteUser(username) {
        if (confirm(`Are you sure you want to delete user: ${username}?`)) {
            socket.emit('deleteUser', { username });
            closeUserPopup();
        }
    }

    function updateUser(username) {
        console.log(`Updating user: ${username}`);

        closeUserPopup();
    }



});

async function registerLoginForm(event) {
    event.preventDefault(); 

    let username_vrednost = document.getElementById("username_id").value;
    let password_vrednost = document.getElementById("password_id").value;

    console.log(username_vrednost);
    console.log(password_vrednost);

    console.log('Emitting loginUser event with:', { username_vrednost, password_vrednost }); 
    socket.emit('loginUser', { username_vrednost, password_vrednost });

    socket.on('loginSuccess', (user) => {
        current_user = user; 
        alert(`Welcome ${user.username}!`);

        window.location.href = 'admin.html';
    });

    socket.on('loginFailure', (message) => {
        alert(message);
    });
    if (username_vrednost && password_vrednost) {
        try {
            let response = await fetch(`/getUserByUsername?username=${username_vrednost}`);
            let data = await response.json();

            if (data && data.username === username_vrednost) {

                console.log("User exists, logging in...");
                console.log(data);
                console.log(data.isAdmin);

                current_user = data; 

                sendUserInfo(username_vrednost, 'Logged in successfully');




                switch(data.isAdmin){
                    case true:
                        window.location.href = 'admin.html'; 
                        break;
                    case false:
                        switch (data.ship) {
                            case 'war':
                                window.location.href = 'dashboard.html'; 
                                break;
                            case 'civilian':
                                window.location.href = 'civilian.html'; 
                                break;
                            case 'cargo':
                                window.location.href = 'dashboard.html'; 
                                break;
                            default:
                                window.location.href = 'civilian.html';
                        }
                        break;
                    default:
                        alert("Nevalidan odabir adminata.");
                }
            } else {
                alert("User does not exist. Please create an account first.");
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    } else {
        alert("Please enter both username and password.");
    }
}

async function registerOnly(event) {
    event.preventDefault();
    let username_register = document.getElementById("login_username").value;
    let password_register = document.getElementById("login_password").value;
    let tip_broda = document.querySelector('input[name="shipType"]:checked').value;
    let is_admin = document.querySelector('input[name="adminBool"]:checked').value;
    
    console.log("Username:", username_register);
    console.log("Password:", password_register);
    console.log("Ship Type:", tip_broda);
    console.log("Is Admin:", is_admin);

    if (username_register !== "") {

        try {
            let userResponse = await fetch(`/getUserByUsername?username=${username_register}`);
            let userData = await userResponse.json();

            if (userData && userData.username === username_register) {
                alert("User already exists");
            } else {
                function getRandomName(namesList) {
                    const randomIndex = Math.floor(Math.random() * namesList.length);
                    const randomName = namesList[randomIndex];
                    return randomName;
                }

                switch (tip_broda) {
                    case 'war':
                        chosen_name = getRandomName(possible_warship_names);
                        chosen_capacity = 30;
    
                    case 'civilian':
                        chosen_name = getRandomName(possible_civilian_names);
                        chosen_capacity = 100;
                        break;
                    case 'cargo':
                        chosen_name = getRandomName(possible_cargo_names);
                        chosen_capacity = 15;
                        break;
                    default:
                        alert('Invalid selection');
                }

                var registeredUser = {
                    username: username_register,
                    password: password_register,
                    ship:chosen_name,
                    ship_type: tip_broda,
                    isAdmin: is_admin
                };

                current_user = registeredUser;

                let createUserResponse = await fetch("/createUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(registeredUser),
                });

                let createUserData = await createUserResponse.json();

                console.log("Chosen Ship Name:", chosen_name);
                console.log("Chosen Ship Capacity:", chosen_capacity);


                let existingShipResponse = await fetch(`/getShipByName?ship_name=${chosen_name}`);
                let existingShipData = await existingShipResponse.json();

                let shipId;
                if (existingShipData && existingShipData._id) {
                    shipId = existingShipData._id;
                } else {
                    var newShip = {
                        ship_name: chosen_name,
                        capacity: chosen_capacity
                    };

                    console.log("Creating New Ship:", newShip);

                    let createShipResponse = await fetch("/createShip", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newShip),
                    });

                    let createShipData = await createShipResponse.json();
                    shipId = createShipData._id;
                    console.log("Created Ship Data:", createShipData);
                }

                var newCrew = {
                    username: username_register,
                    password: password_register,
                    ship: chosen_name,
                    id: shipId  
                };
                console.log("New Crew Data:", newCrew);

                let addCrewResponse = await fetch("/addCrew", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCrew),
                });

                let addCrewData = await addCrewResponse.json();
                console.log("Add Crew Response Data:", addCrewData);

                console.log(`Account ${registeredUser.username} registered successfully`);

                window.location.href = 'login-form.html';
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }
}
function createUserElement(user) {
    return `
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 user" data-username="${user.username}">
            <div class="div-square">
                <i class="fa fa-user fa-5x"></i>
                <h4>${user.username}</h4>
                <button class="btn btn-danger delete-user" data-username="${user.username}">Delete</button>
            </div>
        </div>
    `;
}



function attachUserEventListeners() {
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', (event) => {
            const username = event.target.getAttribute('data-username');
            deleteUser(username);
        });
    });
}

function deleteUser(username) {
    if (confirm(`Are you sure you want to delete user: ${username}?`)) {
        socket.emit('deleteUser', { username });
    }
}




// document.getElementById('updateUser').addEventListener('click', function() {
//     const username = document.getElementById('userPopupInfo').innerText;
//     showUpdateUserPopup(username);
//   });
  
//   document.getElementById('updateUserPopupClose').addEventListener('click', closeUpdateUserPopup);
//   document.getElementById('updateUserPopupOverlay').addEventListener('click', closeUpdateUserPopup);
  
//   function showUpdateUserPopup(username) {
//     document.getElementById('updateUsername').value = username;
//     document.getElementById('updateUserPopup').style.display = 'block';
//     document.getElementById('updateUserPopupOverlay').style.display = 'block';
//   }
  
//   function closeUpdateUserPopup() {
//     document.getElementById('updateUserPopup').style.display = 'none';
//     document.getElementById('updateUserPopupOverlay').style.display = 'none';
//   }
  
//   document.getElementById('updateUserForm').addEventListener('submit', async function(event) {
//     event.preventDefault();
  
//     const username = document.getElementById('updateUsername').value;
//     const password = document.getElementById('updatePassword').value;
//     const ship = document.getElementById('updateShip').value;
//     const isAdmin = document.getElementById('updateIsAdmin').checked;
  
//     const updateData = {
//       password,
//       ship,
//       isAdmin
//     };
  
//     try {
//       const response = await fetch(`/users/${username}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updateData)
//       });
  
//       if (response.ok) {
//         const updatedUser = await response.json();
//         console.log('User updated:', updatedUser);
//         closeUpdateUserPopup();
//       } else {
//         console.error('Error updating user');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   });
 

  const ticketList = document.getElementById('ticketList');

  async function fetchTickets() {
      try {
        console.log("test fetch");
        let response = await fetch('/getTickets');
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        let tickets = await response.json();
        displayTickets(tickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    }
  
    function displayTickets(tickets) {
      ticketList.innerHTML = '';
      tickets.forEach(ticket => {
        let listItem = document.createElement('li');
        listItem.textContent = `User: ${ticket.user.name}, Ship: ${ticket.ship}, Date: ${new Date(ticket.date).toLocaleDateString()}, Time: ${ticket.time}`;
        ticketList.appendChild(listItem);
      });
    }
  
    fetchTickets();
