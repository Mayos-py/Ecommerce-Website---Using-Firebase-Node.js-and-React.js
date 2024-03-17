const admin = require('firebase-admin');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const credentials = require('./key.json')

const adminDB = admin.initializeApp({
    credential: admin.credential.cert(credentials),
    databaseURL: 'https://sumazon-630eb-default-rtdb.firebaseio.com/',
    storageBucket: 'gs://sumazon-630eb.appspot.com'
})


const db = getFirestore();


module.exports = {adminDB, db};