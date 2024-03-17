
const express = require('express');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const router = express.Router();

const {adminDB, db} = require('../firebaseConfig');

const bucket = adminDB.storage().bucket();

router.get('/home', async(req, res) =>{

    const productSnapshot = await db.collection('product').get();
    const productData = [];

    for (const doc of productSnapshot.docs) {
      const product = doc.data();
      const fileId = doc.id;
      const fileIdWithExtension = `${fileId}.jpg`;

      const file = bucket.file(fileIdWithExtension);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 1000,
      });

      productData.push({
        id: doc.id,
        imageUrl: url,
        ...product,
      });
    }
      
    res.json({ success: true, user:  productData});
})

module.exports = router;
