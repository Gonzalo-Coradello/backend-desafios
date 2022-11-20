class ProductManager {

    constructor() {
        this.products = []
    }

    getProducts = () => this.products

    getProductById = (id) => {
        const productFound = this.products.find(product => product.id === id)
        return productFound || console.error('Product not found')
    }

    getNextID = () => {
        const length = this.products.length

        if(length > 0) {
            const lastProduct = this.products[length - 1]
            const id = lastProduct.id + 1

            return id
        } else return 1
    }


    // Función que valida que el código no se repita y que todos los campos estén completos
    checkFields = (product) => {

        const emptyFields = []

        const isCodeRepeated = this.products.some(prod => prod.code === product.code)


        if(isCodeRepeated) {
            console.error(`El código ${product.code} ya está en uso`)
            return false
        }

        // Valida que todos los valores sean truthy. Si no lo son, el nombre de la propiedad se guarda en el array
        const productFields = Object.entries(product)
        productFields.forEach(value => {
            if(!value[1]) emptyFields.push(value[0])
        })

        // Sólo agrega el producto si no existen campos vacíos o inválidos
        if(emptyFields.length !== 0) { 
            console.error("Debe completar todos los campos. Campos vacíos: ", emptyFields)
            return false
        } 
        return true
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {

        const id = this.getNextID()

        const product = {
            id,
            title: title.trim(),
            description: description.trim(),
            price,
            thumbnail: thumbnail.trim(),
            code: code.trim(),
            stock
        }

        if(this.checkFields(product)) {
            this.products.push(product)
        }
    }
}

// Testing

const productManager = new ProductManager()

console.log(productManager.getProducts())

productManager.addProduct("Producto prueba 1", "Este es un producto de prueba", 400, "Sin imagen", "abc123", 25)

console.log(productManager.getProducts())
console.log("--------------------------------------------------------")


productManager.addProduct("Producto prueba 2", "Este es un producto de prueba", 300, "Sin imagen", "abc123", 22)
productManager.addProduct("      ", "", 0, "", "", )

console.log(productManager.getProducts())
console.log("--------------------------------------------------------")

productManager.addProduct("Producto prueba 3", "Este es un producto de prueba", 200, "Sin imagen", "aaa111", 31)
productManager.addProduct("Producto prueba 4  ", "   Este es un producto de prueba", 500, "  Sin imagen", " aba112", 27)
productManager.addProduct("Producto prueba 5", "      ", 500, "Sin imagen", "aba135", 27)
productManager.addProduct("Producto prueba 6", "Este es un producto de prueba", 500, "Sin imagen", " aaa111  ", 27)

console.log(productManager.getProducts())

console.log("--------------------------------------------------------")

console.log(productManager.getProductById(2))
console.log(productManager.getProductById(20))