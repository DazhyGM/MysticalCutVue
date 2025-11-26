// models/shoppingCart.js

const db = require('../config/db');
const util = require('util'); 

// Promisifica los métodos de la conexión
db.query = util.promisify(db.query);
db.execute = util.promisify(db.execute); 

class ShoppingCart {
    // Agregar producto al carrito (Este método ahora establecerá la cantidad a la nueva si el producto ya existe)
    static async addToCart(cartData) {
        const { user_id, id_product, amount } = cartData;
        
        // --- ¡¡¡LOG CLAVE #3: QUÉ CANTIDAD LLEGA AL MODELO (addToCart)!!! ---
        console.log('--- ENTRADA MODELO (addToCart) ---');
        console.log(`Paso 3: Cantidad 'amount' recibida en el MODELO (addToCart): ${amount}`);
        console.log(`Datos: user_id=${user_id}, id_product=${id_product}`);
        // --- FIN LOG #3 ---

        try {
            if (amount <= 0) {
                console.log('Validación fallida en addToCart: Cantidad seleccionada es <= 0.');
                return { success: false, message: 'La cantidad debe ser mayor a 0 para agregar o actualizar un producto.' };
            }

            const selectSql = 'SELECT id_cart, amount FROM shopping_cart WHERE user_id = ? AND id_product = ? AND status = "active"';
            const existingRows = await db.execute( 
                selectSql,
                [user_id, id_product]
            );

            console.log('Resultado de la búsqueda de producto existente:', existingRows);

            if (existingRows.length > 0) {
                const id_cart_to_update = existingRows[0].id_cart;
                const currentAmount = existingRows[0].amount;

                console.log(`Producto existente encontrado (id_cart: ${id_cart_to_update}). Cantidad actual EN DB: ${currentAmount}.`);
                // --- ¡¡¡LOG CLAVE #4: QUÉ CANTIDAD SE VA A ENVIAR AL UPDATE!!! ---
                console.log(`Paso 4: Cantidad que se va a SETEAR en la DB para id_cart ${id_cart_to_update}: ${amount}`); 
                
                const updateSql = 'UPDATE shopping_cart SET amount = ?, date_updated = CURRENT_TIMESTAMP WHERE id_cart = ?';
                const result = await db.execute( 
                    updateSql,
                    [amount, id_cart_to_update] // Aquí, `amount` es la cantidad FINAL deseada
                );
                
                console.log('Consulta SQL UPDATE ejecutada en addToCart:', updateSql);
                console.log('Parámetros de UPDATE:', [amount, id_cart_to_update]);
                console.log('Resultado del UPDATE en addToCart:', result);

                return { success: true, message: 'Cantidad del producto actualizada en el carrito' }; 
            } else {
                console.log('Producto no existente. Insertando nuevo registro con cantidad:', amount);
                const insertSql = 'INSERT INTO shopping_cart (user_id, id_product, amount) VALUES (?, ?, ?)';
                const result = await db.execute( 
                    insertSql,
                    [user_id, id_product, amount]
                );

                console.log('Resultado INSERT en addToCart:', result);
                return { success: true, message: 'Producto agregado al carrito', id: result.insertId };
            }
        } catch (error) {
            console.error('ERROR en ShoppingCart.addToCart:', error);
            throw error; 
        } finally {
            console.log('--- SALIDA MODELO (addToCart) ---');
        }
    }

    // Obtener carrito por usuario
    static async getCartByUser(user_id) {
        // --- LOG PARA DEPURACIÓN ---
        console.log('--- ENTRADA MODELO (getCartByUser) ---');
        console.log(`Buscando carrito para user_id: ${user_id}`);
        // --- FIN LOG ---
        try {
            const rows = await db.execute(`
                SELECT 
                    sc.id_cart, sc.user_id, sc.id_product, sc.amount, sc.date_added,
                    p.name, p.description, p.price, p.image,
                    (sc.amount * p.price) as subtotal
                FROM shopping_cart sc
                INNER JOIN product p ON sc.id_product = p.id_product
                WHERE sc.user_id = ? AND sc.status = "active"
                ORDER BY sc.date_added DESC
            `, [user_id]);
            
            // --- LOG PARA DEPURACIÓN ---
            console.log('Filas obtenidas en getCartByUser:', rows);
            // --- FIN LOG ---
            return rows;
        } catch (error) {
            console.error('ERROR en ShoppingCart.getCartByUser:', error);
            throw error;
        } finally {
            console.log('--- SALIDA MODELO (getCartByUser) ---');
        }
    }

    // Actualizar cantidad de producto en carrito
   // static async updateCartItem(id_cart, amount)
    // Esta función **ya funciona como quieres (establece la cantidad)**.
    // Solo asegúrate de que le envías la cantidad deseada (Ej: 1 si quieres 1, no si quieres sumar 1).
    static async updateCartItem(id_cart, amount) {
        // --- ¡¡¡LOG CLAVE #5: QUÉ CANTIDAD LLEGA AL MODELO (updateCartItem)!!! ---
        console.log('--- ENTRADA MODELO (updateCartItem) ---');
        console.log(`Paso 5: Cantidad 'amount' recibida en el MODELO (updateCartItem) para id_cart ${id_cart}: ${amount}`);
        // --- FIN LOG #5 ---
        try {
            if (amount <= 0) {
                console.log('Validación fallida: cantidad <= 0 en updateCartItem');
                throw new Error('La cantidad a actualizar debe ser mayor que 0.');
            }
            const updateSql = 'UPDATE shopping_cart SET amount = ?, date_updated = CURRENT_TIMESTAMP WHERE id_cart = ?';
            const result = await db.execute(
                updateSql,
                [amount, id_cart]
            );
            console.log('Consulta SQL UPDATE ejecutada en updateCartItem:', updateSql);
            console.log('Parámetros de UPDATE:', [amount, id_cart]);
            console.log('Resultado UPDATE en updateCartItem:', result);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('ERROR en ShoppingCart.updateCartItem:', error);
            throw error;
        } finally {
            console.log('--- SALIDA MODELO (updateCartItem) ---');
        }
    }

    // Eliminar producto del carrito (ELIMINACIÓN FÍSICA)
    static async removeFromCart(id_cart) {
        console.log('--- ENTRADA MODELO (removeFromCart) ---');
        console.log(`Eliminando FÍSICAMENTE id_cart: ${id_cart}`);
        try {
            const result = await db.execute(
                'DELETE FROM shopping_cart WHERE id_cart = ?', // CAMBIO CLAVE: de UPDATE a DELETE
                [id_cart]
            );
            console.log('Resultado DELETE en removeFromCart:', result);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('ERROR en ShoppingCart.removeFromCart:', error);
            throw error;
        } finally {
            console.log('--- SALIDA MODELO (removeFromCart) ---');
        }
    }


    // Limpiar carrito (marcar como comprado)
    static async clearCart(user_id) {
        // --- LOG PARA DEPURACIÓN ---
        console.log('--- ENTRADA MODELO (clearCart) ---');
        console.log(`Limpiando carrito para user_id: ${user_id}`);
        // --- FIN LOG ---
        try {
            const result = await db.execute(
                'UPDATE shopping_cart SET status = "purchased" WHERE user_id = ? AND status = "active"',
                [user_id]
            );
            console.log('Resultado UPDATE en clearCart:', result);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('ERROR en ShoppingCart.clearCart:', error);
            throw error;
        } finally {
            console.log('--- SALIDA MODELO (clearCart) ---');
        }
    }

    // Obtener total del carrito
    static async getCartTotal(user_id) {
        // --- LOG PARA DEPURACIÓN ---
        console.log('--- ENTRADA MODELO (getCartTotal) ---');
        console.log(`Calculando total para user_id: ${user_id}`);
        // --- FIN LOG ---
        try {
            const rows = await db.execute(`
                SELECT 
                    COUNT(*) as total_items,
                    SUM(sc.amount * p.price) as total_amount
                FROM shopping_cart sc
                INNER JOIN product p ON sc.id_product = p.id_product
                WHERE sc.user_id = ? AND sc.status = "active"
            `, [user_id]);
            
            // --- LOG PARA DEPURACIÓN ---
            console.log('Resultado obtenido en getCartTotal:', rows[0]);
            // --- FIN LOG ---
            return rows[0];
        } catch (error) {
            console.error('ERROR en ShoppingCart.getCartTotal:', error);
            throw error;
        } finally {
            console.log('--- SALIDA MODELO (getCartTotal) ---');
        }
    }
}

module.exports = ShoppingCart;