const express = require('express');
const router = express.Router();
const {adminDB, db} = require('../firebaseConfig');


router.get('/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const productRef = await db.collection('product').doc(productId).get();
        
        if (productRef.exists) {
          const productData = productRef.data();
          const quantity = productData.quantity;
    
          res.json({ success: true, quantity: quantity });
        }

    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

router.patch('/product/:productId/:quantity', async (req, res) => {
    try {
        console.log("Hello World")
        const productId = req.params.productId;
        const quantity = parseInt(req.params.quantity);
        console.log(quantity, productId)
        await db.collection('product').doc(productId).update({quantity: quantity});
        res.json({ success: true, quantity: quantity });
        console.log("Worked")

    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

router.get('/cart/:userEmail', async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
      const cartRef = db.collection('cart')
      const cartData = [];

      const data = await cartRef.where('userId', '==', userEmail).get();
      
      for (const doc of data.docs) {
        const product = doc.data();

        cartData.push({
            ...product
        })
      }

      res.json({ success: true, cartData:  cartData});

    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

router.post('/cart/:userEmail', async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
      const { productId, name, price} = req.body;
  
    const response = await db.collection('cart').doc().set({
        productId: productId,
        name: name,
        price: price,
        userId: userEmail
      })
  
      res.json({ success : true, response: response})
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });


  router.delete('/cart/:userEmail/:productId', async (req, res) => {
    try {
        const userEmail = req.params.userEmail;
        const productId = req.params.productId;

        const cartRef = db.collection('cart');
        const query = await cartRef.where('userId', '==', userEmail).where('productId', '==', productId).get();

        query.forEach(async (doc) => {
            await doc.ref.delete();
        });

        res.json({ success: true });

    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});


  module.exports = router;

