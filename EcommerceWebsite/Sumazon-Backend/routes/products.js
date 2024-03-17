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

router.post('/product', async (req, res) =>{
    try {
        const product = {
            description: req.body.description,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
        };

        const docRef = await db.collection('product').add({
            description: product.description,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
        });

        const docId = docRef.id;

        res.json({ success: true, docId: docId });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
  });


router.delete('/product/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        const productRef = db.collection('product').doc(productId);
        await productRef.delete();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

router.patch('/product/:productId', async (req, res) => {
  try {
    
    const productId = req.params.productId;

    const productRef = db.collection('product').doc(productId);

    const updatedProductData = {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    };

    await productRef.update(updatedProductData);

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});



module.exports = router;

