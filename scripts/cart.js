const cart_key='cart';
export function getCart(){
    return JSON.parse(localStorage.getItem(cart_key)) || [];    
}

export function saveCart(cart){
    localStorage.setItem(cart_key,JSON.stringify(cart));
}

export function updateCartCount(){
    const countElement=document.querySelector('.cart-count');
    if(!countElement) return;
    countElement.textContent = getCart().length;

}

export function addToCart(product){
    let cart = getCart();
    const existingProduct = cart.find((item)=>item.id ===product.id);
    if(existingProduct){
        existingProduct.quantity += product.quantity;
    }else{
        cart.push({
           ...product,
           quantity:product.quantity || 1
            
        });
    }

    saveCart(cart);
    updateCartCount(); 
}

export function removeFromCart(productID){
    let cart = getCart();
    cart=cart.filter((item)=>item.id !== productID);
    saveCart(cart);
    updateCartCount();
    // renderCart();
    // createProductTeaser()

}

export function increaseQuantity(productID){
    const cart = getCart();
    const product=cart.find((item)=>item.id == productID)
    if(product){
        product.quantity +=1;
    }
    saveCart(cart);
    updateCartCount();
}   

export function decreaseQuantity(productID){
    const cart = getCart();
    const product = cart.find((item)=>item.id == productID);
    if(product && product.quantity >1){
        product.quantity -= 1;
    }
    saveCart(cart);
    updateCartCount();
}

export function getCartSubtotal(){
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}