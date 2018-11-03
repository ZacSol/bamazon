// Initialize values
let products=[];
let cart=[];
let subTotal=0;
const itemsDump=$("#itemsDump");
const cartDump=$("#cartDump");

// // Functions
// Grabs the product data from the database
function getData() {
    $.get("/api/products")
        .then(function (res) {
            // console.log(res);
            products = res;
            // console.log(products);
            displayItems(products);
            // return res;
        });
    $.get("/api/cart")
        .then(function(response){
            // checks that the item's id attribute matches the original product's id
            response.forEach(function(item){
                if(item.productId){
                    item.id=item.productId;
                };
            });
            cart=response;
            updateCartIcon();
        })
    
};

//renders the collected items
function displayItems(productList){
    itemsDump.empty();
    productList.forEach(function(product){
        // console.log(product);
        itemsDump.append(`<div class="itemContainer"><div class="row"><div class="col-3 centerBox"><img class="resize" src="${product.imageUrl}"></div><div class="col-7"><h3>${product.name}</h3><h5>$${product.price}</h5><br><h6>${product.availQty} Available</h6></div><div class="col-2 centerBox"><button type="button" class="btn btn-secondary addBtn" id="add${product.id}" value="${product.id}">Add to Cart</button></div></div></div><br>`);
    });
};

// Used to find an item in an array with a specific attribute value
function findWithAttr(array, attribute, value) {
    // console.log(typeof(value));
    for(let i = 0; i < array.length; i += 1) {
        if(array[i][attribute] === value) {
            return i;
        }
    }
    return -1;
}

// takes an id and adds that product to the cart
function addToCart(itemId) {
    // console.log(cart);
    // console.log(itemId,typeof(itemId));
    // console.log(typeof(products[0].id));
    // console.log(products[findWithAttr(products,'id',parseInt(itemId))]);
    let exists = false;
    let newItem=products[findWithAttr(products, 'id', parseInt(itemId))];
    newItem.buying=1;
    // console.log(newItem);
    if (cart.length === 0) {
        cart.push(newItem);
        // console.log(cart);
        updateCartIcon();  
        postToCartDb(newItem);      
    }
    else {
        cart.forEach(function(item){
            if(item.id===newItem.id){
                // console.log("already here");
                exists=true;
                return;
            }
        })
        if (exists === false) {
            cart.push(newItem);
            updateCartIcon();
            postToCartDb(newItem);
        }
        else{
            alert("This item is already in the cart, please update quantity there.");
        }
    }
};

// adds item to the cart db
function postToCartDb(itemObject){
    // console.log(itemObject);
    newObject={
        name:itemObject.name,
        productId:itemObject.id,
        price:itemObject.price,
        availQty:itemObject.availQty,
        imageUrl:itemObject.imageUrl,
        department:itemObject.department,
        buying:itemObject.buying
    }
    $.post("/api/cart", newObject, function(res){
        // console.log(res);
        if (res.success) {
        }
        else {
            alert("There was an error sending to the cartDb.");
        };
    });
};

// item exists in db and buying quantity updated
// function updateCartDbQuantity(){
//     $.put("/api/cart",)
// };

function updateCartIcon(){
    let number=0;
    cart.forEach(function(item){
        number+=item.buying;
    });
    $("#numInCart").text(number);
};

// removes item from cart and re-renders displayed cart
function removeFromCart(itemId){
    let removeIndex=findWithAttr(cart, 'id', parseInt(itemId));
    // console.log(removeIndex);
    cart.splice(removeIndex,1);
    // console.log(findWithAttr(cart, 'id', parseInt(itemId)));
    // console.log(cart);
    displayCart(cart);
    updateCartIcon();
    cartDbDelete(itemId);
};

function cartDbDelete(itemId){
    // console.log(itemId);
    $.ajax({
        url:`/api/cart/${itemId}`,
        method:"DELETE"
    })
    .then(function(res){
        if(res.success){
            // alert("Item successfully removed from cart.");
            // console.log(cart);
        }
        else{
            alert("Unable to remove from cartDb.");
        };
    });
};

// Empties cart display then renders new; if cart empty displays text
function displayCart(cartList){
    cartDump.empty();
    if(cartList.length===0){
        cartDump.text("There are no items in the cart.");
    }
    cartList.forEach(function(item){
        // console.log(item);
        // console.log(products[findWithAttr(products,'id',item.id)].availQty);
        if(item.buying>products[findWithAttr(products,"id",item.id)].availQty&&products[findWithAttr(products,"id",item.id)].availQty!==1){
            item.availQty=products[findWithAttr(products,"id",item.id)].availQty;
        }
        

        // create dropdown object that displays as many options as there are items available
        let dropdown= `<span class="a-dropdown-container"><label class="a-native-dropdown"><span class="sc-offscreen-label" aria-label="Quantity"></span></label><select
        name="quantity" autocomplete="off" data-a-touch-header="Quantity" tabindex="-1" class="quantity-dropdown" id="dropdown ${item.id}">`

        if(item.availQty>0){
            for(let i=1;i<=item.availQty;i++){
                if(i===item.buying){
                    dropdown+= `<option value="${i}" data-a-css-class="quantity-option" selected="">
                ${i}
              </option>`;
                }
                else{
                    dropdown+= `<option value="${i}" data-a-css-class="quantity-option">
                ${i}
              </option>`;
                }
            }
        }

        dropdown+=`</select></span>`

        let mathCost=item.buying*item.price;

        cartDump.append(`<div class="cartItemContainer"><div class="row"><div class="col-3 centerBox"><img class="cartSize" src="${item.imageUrl}"></div><div class="col-6"><h6>${item.name}</h6><button type="button" class="btn btn-warning delBtn" id="remove${item.id}" value="${item.id}">Remove</button></div><div class="col-3"><br><div id="cost${item.id}">$${mathCost.toFixed(2)}</div><br><br>${dropdown}</div></div></div><br>`);
    });
    findSubTotal();
    updateCartIcon();
};

function findSubTotal(){
    let runningCost=0;
    cart.forEach(function(item){
        // console.log(item);
        let itemSub=item.price*item.buying;
        // console.log(itemSub);
        runningCost+=(itemSub);
    // console.log("Running cost: "+runningCost);
});
    subTotal=runningCost;
    // console.log("Subtotal: "+subTotal);
    // Update display for subtotal in cart
    $("#subTotal").html(`<h6>Subtotal:<br> $${subTotal.toFixed(2)}</h6>`);
}

function updateCart(id,quantity){
    // console.log("ID: "+id);
    // console.log("Quantity: "+quantity);
    let itemToUpdate=cart[findWithAttr(cart, 'id', parseInt(id))];
    // console.log(itemToUpdate);
    itemToUpdate.buying=parseInt(quantity);
    // console.log(itemToUpdate.buying);
    let itemTotal=(itemToUpdate.buying*itemToUpdate.price).toFixed(2);
    // console.log(itemTotal);
    $(`#cost${id}`).text(`$${itemTotal}`);

    // Update visible subtotal with every quantity change
    findSubTotal();
    updateCartIcon();
    updateCartDbItemBuyQuantity(id,quantity);
}

function updateCartDbItemBuyQuantity(productId,buyingQuantity){
    // console.log(productId);
    $.ajax({
        url:`/api/cart/${productId}`,
        method:"PUT",
        data:{buying:buyingQuantity}
    })
    .then(function(response){
        if(response.success){
            // alert("The quantity has been successfully updated.");
        }
        else{
            alert('There was a problem updating the cartDb quantity.');
        }
    })
}

function checkoutPurchase(cartArr){
    // Check to see if cart is empty
    if(cartArr.length<1){
        alert("There are no items in the cart.");
    }
    // If cart has things, do things
    else {
        // console.log(cart);
        let ids=[];
        cart.forEach(function (item) {
            // console.log(item);
            ids.push(item.id);
        });
        console.log(ids);
        // console.log("all things checked");
        $.get('/api/cart/checkout',ids)
        .then(function(response){
            console.log(response);
        });
    };
};

// // Event Handlers
// Displays cart
$("#cartIcon").on('click',function(){
    $("#cartModal").modal();
    displayCart(cart);
});
// Adds item to cart
$("#itemsDump").on('click','.addBtn',function(){
    // console.log("Button clicked");
    // console.log($(this).val());
    addToCart($(this).val());
});
// Removes item from cart
$("#cartDump").on('click','.delBtn',function(){
    // console.log($(this).val());
    removeFromCart($(this).val());
})
// Updates amount available based on checkout quantities
$("#checkoutBtn").on('click',function(){
    // console.log("You asked to check out.");
    checkoutPurchase(cart);
})
// Updates quantites in the cart
$("#cartDump").on('change','.quantity-dropdown',function(){
    // console.log("changed quantity");

    let thisId=$(this)[0].id;
    // split the id and take just the number
    thisId=thisId.split(" ");
    thisId=thisId[1];

    let thisQuantity=$(this).val();
    updateCart(thisId,thisQuantity);
})

// // at page load, grab items from server then render all product data to display
getData();