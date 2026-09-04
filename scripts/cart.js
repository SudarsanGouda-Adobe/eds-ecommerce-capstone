function getCart(){
    return JSON.parse(localStorage.getItem('cart')) || [];    
}

function saveCart(cart){
    localStorage.setItem('cart',JSON.stringify(cart));
}

function updateCartCount(){
    const countElement=document.querySelector('.cart');
    if(!countElement) return;
    countElement.textContent = getCart().length;

}

function removeFromCart(productID){
    let cart = getCart();
    cart=cart.filter((item)=>item.id !== productID);
    saveCart(cart);
    updateCartCount();
    // renderCart();
    // createProductTeaser()

}