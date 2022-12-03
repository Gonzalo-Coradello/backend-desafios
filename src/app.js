const express = require('express')
const ProductManager = require('./ProductManager')

const productManager = new ProductManager('products.json')


const app = express()

const port = 8080

app.get('/products', async (req, res) => {
    const products = await productManager.getProducts()

    const limit = req.query.limit

    if(limit) products.splice(limit)
    
    res.json(products)
})

app.get('/products/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const product = await productManager.getProductById(id)

    if(product) res.send(product)
    else res.send({error: 'No se ha encontrado el producto'})
})

// app.get('/add', async (req, res) => {

//     const body = req.query
//     const obj = await productManager.addProduct(body)

//     res.json(obj)
// })

app.listen(port, () => console.log(`Escuchando en el puerto ${port}`))