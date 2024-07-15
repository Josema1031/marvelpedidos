document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    function updateCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        cartItemsContainer.innerHTML = '';
        let total = 0;

        for (const productId in cart) {
            if (cart.hasOwnProperty(productId)) {
                const item = cart[productId];
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${item.name} - Cantidad: 
                    <input type="number" class="quantity-input" data-product-id="${productId}" value="${item.quantity}" min="1">
                    - Precio: $${item.price * item.quantity}
                    <button class="remove-from-cart" data-product-id="${productId}">Eliminar</button>
                `;
                cartItemsContainer.appendChild(listItem);
                total += item.price * item.quantity;
            }
        }

        cartTotalElement.textContent = `Total: $${total}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const productId = button.getAttribute('data-product-id');
            const productName = card.querySelector('h3').textContent;
            const productPriceText = card.querySelector('p:nth-of-type(3)').textContent;
            const productPrice = parseFloat(productPriceText.replace('Precio: $', ''));
            const quantity = parseInt(card.querySelector('input[type="number"]').value, 10);

            if (!cart[productId]) {
                cart[productId] = { name: productName, price: productPrice, quantity: 0 };
            }

            cart[productId].quantity += quantity;

            alert(`Producto añadido al carrito. Cantidad total: ${cart[productId].quantity}`);
            updateCart();
        });
    });

    if (document.getElementById('checkout')) {
        document.getElementById('checkout').addEventListener('click', () => {
            let message = 'Hola Marvel, me gustaría hacer el siguiente pedido:\n\n';
            let total = 0;

            for (const productId in cart) {
                if (cart.hasOwnProperty(productId)) {
                    const item = cart[productId];
                    message += `${item.name} 
                    Cantidad: ${item.quantity}
                    Precio: $${item.price * item.quantity}\n`;
                    total += item.price * item.quantity;
                }
            }

            message += `\nTotal: $${total}`;
            
            const phoneNumber = '5493415326060'; // Reemplaza con tu número de WhatsApp en formato internacional
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
            cart = {};
            localStorage.removeItem('cart');
            updateCart();
        });
    }

    if (document.getElementById('cancel')) {
        document.getElementById('cancel').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cancelar la compra?')) {
                cart = {};
                updateCart();
                alert('Compra cancelada.');
                localStorage.removeItem('cart');
            }
        });
    }

    if (document.getElementById('modify')) {
        document.getElementById('modify').addEventListener('click', () => {
            document.querySelectorAll('.quantity-input').forEach(input => {
                const productId = input.getAttribute('data-product-id');
                const newQuantity = parseInt(input.value, 10);

                if (cart[productId]) {
                    cart[productId].quantity = newQuantity;
                }
            });
            updateCart();
            alert('Carrito actualizado.');
        });
    }

    if (document.getElementById('complaint')) {
        document.getElementById('complaint').addEventListener('click', () => {
            const complaintMessage = 'Hola, me gustaría hacer un reclamo:\n\n';
            const phoneNumber = '5493415326060'; // Reemplaza con tu número de WhatsApp en formato internacional
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(complaintMessage)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }

    if (document.getElementById('cart-items')) {
        document.getElementById('cart-items').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-cart')) {
                const productId = e.target.getAttribute('data-product-id');
                delete cart[productId];
                updateCart();
            }
        });
    }

    if (document.getElementById('print-invoice')) {
        document.getElementById('print-invoice').addEventListener('click', () => {
            let invoiceWindow = window.open('', 'Invoice', 'width=800,height=600');
            let invoiceContent = `
                <html>
                <head>
                    <title>Factura</title>
                    
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .invoice { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ccc; }
                        .invoice h1 { text-align: center; }
                        .invoice h2 { text-align: center; }
                        .invoice table { width: 100%; border-collapse: collapse; }
                        .invoice table, .invoice th, .invoice td { border: 1px solid black; }
                        .invoice th, .invoice td { padding: 10px; text-align: left; }
                        .invoice .total { text-align: right; font-weight: bold;}
                    </style>
                </head>
                <body>
                    <div class="invoice">
                        <h1>Factura</h1>
                         <h2>POLIRUBRO CJ</h2>
                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Precio Total</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            let total = 0;
            for (const productId in cart) {
                if (cart.hasOwnProperty(productId)) {
                    const item = cart[productId];
                    invoiceContent += `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price}</td>
                            <td>$${item.price * item.quantity}</td>
                        </tr>
                    `;
                    total += item.price * item.quantity;
                }
            }

            invoiceContent += `
                            </tbody>
                        </table>
                        <p class="total">Total: $${total}</p>
                    </div>
                </body>
                </html>
            `;

            invoiceWindow.document.write(invoiceContent);
            invoiceWindow.document.close();
            invoiceWindow.print();
        });
    }

    updateCart();
});
