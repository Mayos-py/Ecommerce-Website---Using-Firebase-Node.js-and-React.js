
const express = require('express');
const router = express.Router();
const {adminDB, db} = require('../firebaseConfig');

router.post('/signup', async(req, res) =>{
    const user = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        mobileNumber: req.body.mobileNumber
    }
    const userResponse = await adminDB.auth().createUser({
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false
    })

    const isSumazonEmail = user.email.includes('@sumazon.com');

    const role = isSumazonEmail ? 'admin' : 'user';

    await adminDB.database().ref(`users/${userResponse.uid}`).set({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,    
        address: user.address,
        mobileNumber: user.mobileNumber,
        role: role
      });

      res.json({ success: true, user: userResponse });
})

module.exports = router;
