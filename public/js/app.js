let products=[];
let cart=[];
const itemsDump=$("#itemsDump");

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
        itemsDump.append(`<div class="itemContainer"><div class="row"><div class="col-3 centerBox"><img class="resize" src="${product.imageUrl}"></div><div class="col-7"><h3>${product.name}</h3><p>${product.availQty} Available</p><h4>$${product.price}</h4></div><div class="col-2 centerBox"><button type="button" class="btn btn-secondary addBtn" id="add${product.id}" value="${product.id}">Add to Cart</button></div></div></div><br>`);
    });
};

function findWithAttr(array, attribute, value) {
    for(let i = 0; i < array.length; i += 1) {
        if(array[i][attribute] === value) {
            return i;
        }
    }
    return -1;
}

function addToCart(itemId){
    // console.log(itemId,typeof(itemId));
    // console.log(typeof(products[0].id));
    console.log(products[findWithAttr(products,'id',parseInt(itemId))]);
};

function displayCart(cartList){

};

// Event Handlers
$("#cartIcon").on('click',function(){
    $("#cartModal").modal();
});
$("#itemsDump").on('click','.addBtn',function(){
    // console.log("Button clicked");
    // console.log($(this).val());
    addToCart($(this).val());
});

// at page load, grab items from server then render all product data to display
getData();