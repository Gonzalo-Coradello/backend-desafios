const fs = require('fs')

class ProductManager {

    constructor(path) {
        this.path = path
        this.format = 'utf-8'
    }

    getProducts = async () => {
        return fs.promises.readFile(this.path, this.format)
            .then(res => {
                if(res) {
                    const products = JSON.parse(res)
                    return products
                } else return []
            })
            .catch(err => {
                console.log('El archivo aún no ha sido creado. Intente añadir un producto')
                return []
            })
    }

    getProductById = async (id) => {

        const products = await this.getProducts()

        const productFound = products.find(product => product.id === id)
        return productFound || console.error('Product not found')
    }

    getNextID = async () => {

        const products = await this.getProducts()

        const length = products.length

        if(length > 0) {
            const lastProduct = products[length - 1]
            const id = lastProduct.id + 1

            return id
        } else return 1
    }


    // Función que valida que el código no se repita y que todos los campos estén completos
    checkFields = async (product) => {

        const emptyFields = []
        const products = await this.getProducts()

        const isCodeRepeated = products.some(prod => prod.code === product.code)


        if(isCodeRepeated) {
            console.error(`El código ${product.code} ya está en uso`)
            return false
        }

        const productFields = Object.entries(product)
        productFields.forEach(value => {
            if(!value[1]) emptyFields.push(value[0])
        })

        if(emptyFields.length !== 0) { 
            console.error("Debe completar todos los campos. Campos vacíos: ", emptyFields)
            return false
        } 
        return true
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {

        const id = await this.getNextID()

        const product = {
            id,
            title: title.trim(),
            description: description.trim(),
            price,
            thumbnail: thumbnail.trim(),
            code: code.trim(),
            stock
        }

        if(await this.checkFields(product)) {

            const products = await this.getProducts()

            products.push(product)

            const productsStr = JSON.stringify(products)

            fs.promises.writeFile(this.path, productsStr, error => {
                console.log(error)
            })
        }
    }

    updateProduct = async (id, obj) => {
        const products = await this.getProducts()

        const checkID = () => products.some(prod => prod.id === id)
        if(!checkID()) return console.log("El producto no se encontró")

        const productToUpdate = products.find(prod => prod.id === id)

        const updatedProduct = {
            ... productToUpdate,
            ... obj,
            id: id
        }

        const updatedProducts = products.filter(prod => prod.id !== id)
        updatedProducts.push(updatedProduct)

        const productsStr = JSON.stringify(updatedProducts)

        fs.promises.writeFile(this.path, productsStr, error => console.log(error))
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()

        const checkID = () => products.some(prod => prod.id === id)
        if(!checkID()) return console.log("El producto no se encontró")

        const updatedProducts = products.filter(prod => prod.id !== id)

        const productsStr = JSON.stringify(updatedProducts)

        fs.promises.writeFile(this.path, productsStr, error => console.log(error))
    }
}

// Testing

async function run () {
    const productManager = new ProductManager('./products.json')
    console.log(await productManager.getProducts(), '--------------- Primer console.log ---------------')

    await productManager.addProduct("Producto prueba 1", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25)
    console.log(await productManager.getProducts(), '--------------- Segundo console.log ---------------')

    await productManager.addProduct("Producto prueba 2", "Este es un producto de prueba", 400, "Sin imagen", "aaa111", 25)
    await productManager.addProduct("Producto prueba 3  ", "   Este es un producto de prueba", 500, "  Sin imagen", " aba112", 27)
    console.log(await productManager.getProducts(), '--------------- Tercer console.log ---------------')

    console.log(await productManager.getProductById(3), '--------------- Cuarto console.log ---------------')

    await productManager.updateProduct(2, {title: "Nombre modificado", price: 10000, description: "Este es un producto modificado"})
    console.log(await productManager.getProducts(), '--------------- Quinto console.log ---------------')

    await productManager.deleteProduct(2)
    console.log(await productManager.getProducts(), '--------------- Sexto console.log ---------------')
}

run()