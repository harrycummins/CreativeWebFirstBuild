
// async function createRoom() {// Createroom 
//     try {
//         const response = await fetch(`${baseUrl}/create-room`, { method: 'POST' });
//         const data = await response.json();
//         document.getElementById('roomKey').textContent = `Room Key: ${data.roomKey}`;
//     } catch (error) {
//         console.error('Error creating room:', error);
//     }
// }

// // POST request with room key and username
// async function joinRoom() {
//     const username = document.getElementById('username').value;
//     const roomKey = document.getElementById('joinKey').value;

//     if (!username || !roomKey) {
//         alert("Please enter both your name and room key.");
//         return;
//     }

//     try {
//         const response = await fetch(`${baseUrl}/join-room`, {
//             method: 'POST',
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username, roomKey })
//         });

//         if (response.ok) {
//             const data = await response.json();
//             document.getElementById('roomDetails').textContent = `Users in room: ${data.users.join(', ')}`;
//         } else {
//             const errorData = await response.json();
//             alert(errorData.message);
//         }
//     } catch (error) {
//         console.error("Error joining the room:", error);
//     }
// }