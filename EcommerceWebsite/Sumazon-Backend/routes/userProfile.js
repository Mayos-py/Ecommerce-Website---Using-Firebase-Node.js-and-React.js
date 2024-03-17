const express = require('express');
const router = express.Router();
const {adminDB, db} = require('../firebaseConfig');

router.get('/userProfile/:userEmail', async (req, res) => {
    const userDataArray = [];

    const userEmail = req.params.userEmail;
    adminDB.database().ref('users').orderByChild('email').equalTo(userEmail).once('value')
    .then((snapshot) => {
        if (snapshot.exists()) {
        const userSnapshot = snapshot.val();
        const userData = Object.values(userSnapshot)[0];
        
        userDataArray.push({
            ...userData
        })

        res.json({ success: true, user:  userDataArray});    
        } else {
        console.log('User not found.');
        }
    })
    .catch((error) => {
        console.error('Error retrieving data:', error.message);
    });

})

router.put('/userProfile/:userEmail', async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
      const { firstName, lastName, address, mobileNumber } = req.body;
  
      await adminDB
        .database()
        .ref('users')
        .orderByChild('email')
        .equalTo(userEmail)
        .once('value', (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const key = childSnapshot.key;
              adminDB
                .database()
                .ref('users')
                .child(key)
                .update({
                  firstName,
                  lastName,
                  address,
                  mobileNumber,
                });
            });
            res.json({ success: true });
          } else {
            console.log('User not found.');
            res.json({ success: false, error: 'User not found' });
          }
        });
    } catch (error) {
      console.error('Error updating data:', error.message);
      res.json({ success: false, error: error.message });
    }
  });

module.exports = router;

