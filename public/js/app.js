// Initialize values
let products=[];
let cart=[];
let lastPurchase=[];
let subTotal=0;
const itemsDump=$("#itemsDump");
const cartDump=$("#cartDump");
const receiptDump=$("#receiptDump");
let validLogin=false;
// localStorage.setItem("validUser",validLogin);

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
            $.get("/api/cart")
                .then(function (response) {
                    // checks that the item's id attribute matches the original product's id
                    // console.log(response);
                    response.forEach(function (item) {
                        if (item.productId) {
                            item.id = item.productId;
                        };
                        // item is only added to the cart from cartDb if it exists in the product database and in stock
                        for (let i = 0; i < products.length; i++) {
                            if (item.id === products[i].id&&item.availQty>0) {
                                cart.push(item);
                            };
                        };
                    });
                    // console.log(cart);
                    updateCartIcon();
                });
        });
};

//renders the collected items
function displayItems(productList){
    itemsDump.empty();
    productList.forEach(function(product){
        // console.log(product);
        let ifAllowed;
        if(product.availQty<1){
            ifAllowed=`<button class="btn btn-warning" value="${product.id}">Out of Stock</button>`;
        }
        else{
            ifAllowed=`<button type="button" class="btn btn-secondary addBtn" id="add${product.id}" value="${product.id}">Add to Cart</button>`
        }

        itemsDump.append(`<div class="itemContainer"><div class="row"><div class="col-3 centerBox"><img class="resize" src="${product.imageUrl}"></div><div class="col-7"><h3>${product.name}</h3><h5>$${product.price}</h5><br><h6>${product.availQty} Available</h6></div><div class="col-2 centerBox">${ifAllowed}</div></div></div><br>`);
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

        cartDump.append(`<div class="cartItemContainer"><div class="row"><div class="col-3 centerBox"><img class="cartSize" src="${item.imageUrl}"></div><div class="col-6"><h6>${item.name}</h6><button type="button" class="btn btn-warning delBtn" id="remove${item.id}" value="${item.id}">Remove</button></div><div class="col-3"><br><div id="cost${item.id}">$${mathCost.toFixed(2)}</div><br>${dropdown}</div></div></div><br>`);
    });
    findSubTotal("cart");
    updateCartIcon();
};

function findSubTotal(option){
    let runningCost=0;
    
    // Update display for subtotal in cart
    switch (option) {
        case "cart":
        cart.forEach(function(item){
            // console.log(item);
            let itemSub=item.price*item.buying;
            // console.log(itemSub);
            runningCost+=(itemSub);
        // console.log("Running cost: "+runningCost);
    });
        subTotal=runningCost;
        // console.log("Subtotal: "+subTotal);
        $("#subTotal").html(`<h6>Subtotal:<br> $${subTotal.toFixed(2)}</h6>`);
            break;

        case "receipt":
        lastPurchase.forEach(function(item){
            // console.log(item);
            let itemSub=item.price*item.buying;
            // console.log(itemSub);
            runningCost+=(itemSub);
        // console.log("Running cost: "+runningCost);
    });
        subTotal=runningCost;
        // console.log("Subtotal: "+subTotal);
        $("#receiptTotal").html(`
        <div class="row">
        <div class="col-3"></div>
        <div class="col-3"><h6>Subtotal:<br> $${subTotal.toFixed(2)}</h6></div>
        <div class="col-3"></div>
        <div class="col-3"><h6>Total:<br> $${(subTotal*1.0825).toFixed(2)}</h6></div>
        </div>`);
            break;

        default:
            break;
    };
};

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

function regularSort(a, b) {
    // used to sort the cart array and make easier to loop through
    const idA = a.id;
    const idB = b.id;
  
    let comparison = 0;
    if (idA > idB) {
      comparison = 1;
    } else if (idA < idB) {
      comparison = -1;
    }
    return comparison;
  }

function checkoutPurchase(cartArr) {
    // Check to see if cart is empty
    if (cartArr.length < 1) {
        alert("There are no items in the cart.");
    }
    // If cart has things, do things
    else {
        // console.log(cart);
        let ids = [];
        cart.forEach(function (item) {
            // console.log(item);
            ids.push({ id: `${item.id}` });
        });
        // console.log(ids);
        $.ajax({
            url: '/api/cart/checkout',
            method: "GET",
            data: { ids }
        })
            .then(function (response) {
                // console.log("response:");
                // console.log(response);
                // console.log('cart:');
                cart.sort(regularSort);
                // console.log(cart);
                let enough = true;
                for (let i = 0; i < cart.length; i++) {
                    // trying to buy more than available
                    if (cart[i].buying > response[i].availQty) {
                        enough = false;
                        alert("There is not enough in stock for one of your items.");
                    };
                };
                if (enough) {
                    // alert("There are enough of all the products.");
                    // there are enough of the items, update the database quantity
                    // console.log(cart);
                    lastPurchase=cart;
                    // console.log(lastPurchase);
                    fillReceipt();
                    $("#receiptModal").modal();
                    for (let i = 0; i < cart.length; i++) {
                        // console.log(response[i].availQty-cart[i].buying);
                        let newQuantitiy=response[i].availQty-cart[i].buying;
                        // console.log(cart[i].id,newQuantitiy);
                        $.ajax({
                            url:`/api/cart/checkout/${cart[i].id}`,
                            method:"PUT",
                            data:{availQty:newQuantitiy}
                        }).then(function(res){
                            if(res.success){
                                // console.log(`Quantity updated for item ${cart[i].id}`);
                                getData();

                            }
                            else{
                                alert("Something went wrong.");
                            };
                        });
                    };
                    $.ajax({
                        url: '/api/checkout/cart/',
                        method: "DELETE"
                    }).then(function (response) {
                        // console.log(response);
                        cart = [];
                        updateCartIcon();
                    });
                };
            });
    };
};

function fillReceipt(){
    // console.log(lastPurchase);
    receiptDump.empty();
    lastPurchase.forEach(function(item){
        // console.log(item);
        let mathCost=item.buying*item.price;
        receiptDump.append(`

        <div class="cartItemContainer"><div class="row"><div class="col-3 centerBox"><img class="cartSize" src="${item.imageUrl}"></div><div class="col-6"><h6>${item.buying}x ${item.name}</h6></div><div class="col-3"><br><div id="cost${item.id}">$${mathCost.toFixed(2)}</div><br><br></div></div></div><br>

        `)
    })
    findSubTotal("receipt");
}

function checkLogin(object){
    // console.log(object);
    $.ajax({
        url:'/login',
        method:"POST",
        data:object
    })
    .then(function(response){
        // console.log(response.success);
        if(response.success){
            validLogin=true;
            localStorage.setItem("validUser",validLogin);
            window.location='/manager';
        }
        else{
            localStorage.setItem("validUser",validLogin);
            alert("Login failed, try again.");
        }
    });
}

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
$("#managerLogin").click(function(){
    $("#loginModal").modal();
})
$("#loginBtn").click(function(){
    if($("#username").val().trim()===""||$("#password").val().trim()===""){
        alert("Please fill all forms.");
        localStorage.setItem("validUser",validLogin);
    }
    else{
        let login={
        username:$("#username").val().trim(),
        password:$("#password").val().trim()
    };
    // console.log(login);
    checkLogin(login);
    }
})

// // at page load, grab items from server then render all product data to display
getData();
