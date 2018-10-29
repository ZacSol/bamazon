let products=[];
let cart=[];
const itemsDump=$("#itemsDump");
const cartDump=$("#cartDump");

// Grabs the product data from the database
function getData(){
$.get("/api/products")
.then(function(res){
    console.log(res);
    products=res;
    // console.log(products);
    displayItems(products);
    return res;
});
};

//renders the collected items
function displayItems(productList){
    itemsDump.empty();
    productList.forEach(function(product){
        // console.log(product);
        itemsDump.append(`<div class="itemContainer"><div class="row"><div class="col-3 centerBox"><img class="resize" src="${product.imageUrl}"></div><div class="col-7"><h3>${product.name}</h3><h5>$${product.price}</h5><p>${product.availQty} Available</p></div><div class="col-2 centerBox"><button type="button" class="btn btn-secondary addBtn" id="add${product.id}" value="${product.id}">Add to Cart</button></div></div></div><br>`);
    });
};

function findWithAttr(array, attribute, value) {
    // console.log(typeof(value));
    for(let i = 0; i < array.length; i += 1) {
        if(array[i][attribute] === value) {
            return i;
        }
    }
    return -1;
}

function addToCart(itemId) {
    // console.log(itemId,typeof(itemId));
    // console.log(typeof(products[0].id));
    // console.log(products[findWithAttr(products,'id',parseInt(itemId))]);
    let exists = false;
    let newItem=products[findWithAttr(products, 'id', parseInt(itemId))];
    // console.log(newItem);
    if (cart.length === 0) {
        cart.push(newItem);
    }
    else {
        cart.forEach(function(item){
            if(item===newItem){
                // console.log("already here");
                exists=true;
                return;
            }
        })
        if(exists===false){
            cart.push(newItem);
        }
        // console.log(cart);
    }
};

function removeFromCart(itemId){
    let removeIndex=findWithAttr(cart, 'id', parseInt(itemId));
    // console.log(removeIndex);
    cart.splice(removeIndex,1);
    // console.log(findWithAttr(cart, 'id', parseInt(itemId)));
    // console.log(cart);
    displayCart(cart);
};

function displayCart(cartList){
    cartDump.empty();
    if(cartList.length===0){
        cartDump.text("There are no items in the cart.");
    }
    cartList.forEach(function(product){
        // console.log(product);
        cartDump.append(`<div class="cartItemContainer"><div class="row"><div class="col-3 centerBox"><img class="cartSize" src="${product.imageUrl}"></div><div class="col-6"><h3>${product.name}</h3><p>${product.availQty} Available</p><button type="button" class="btn btn-warning delBtn" id="remove${product.id}" value="${product.id}">Remove</button></div><div class="col-3 centerBox"></div></div></div><br>`);
    });
};

// Event Handlers
$("#cartIcon").on('click',function(){
    $("#cartModal").modal();
    displayCart(cart);
});
$("#itemsDump").on('click','.addBtn',function(){
    // console.log("Button clicked");
    // console.log($(this).val());
    addToCart($(this).val());
});
$("#cartDump").on('click','.delBtn',function(){
    // console.log($(this).val());
    removeFromCart($(this).val());
})
$("#checkoutBtn").on('click',function(){
    // console.log("You asked to check out.");

})

// at page load, grab items from server then render all product data to display
getData();