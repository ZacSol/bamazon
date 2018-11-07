// variables
const itemsDump=$("#products");
const addBar=$("#addBar");
const upBar=$("#upBar");
const delBar=$("#deleteBar");
let products=[];
let currentView="view";
let validLogin=localStorage.getItem("validUser");
// console.log(validLogin);

// Functions
function checkValidUser(bool){
    // console.log(bool);
    if(bool){
        getData();
        localStorage.removeItem('validUser');
    }
    else{
        window.location="/";
        alert("Please log in.");
    }
};

function getData() {
    $.get("/api/products")
        .then(function (res) {
            // console.log(res);
            products = res;
            // console.log(products);
            displayItems(products);
            // return res;
        });
};

function getLowData(){
    $.get('/api/products/low')
    .then(function(res){
        products=res;
        displayItems(products);
    });
};

function validateNewProduct(newProduct){
    // check if any field is blank
    if(newProduct.name===""||newProduct.price===""||newProduct.availQty===""||newProduct.imageUrl===""||newProduct.department===""){
        alert("Please fill out all fields.");
    }
    else{
        // all fields are filled
        if(!parseFloat(newProduct.price)||!parseInt(newProduct.availQty)){
            alert("Enter a number for both the ID and quantity fields.");
        }
        else{
            // price and quantity are numbers
            postNewProduct(newProduct);
            $("#addName").val("");
            $("#addPrice").val('');
            $("#addQuantity").val('');
            $("#addImage").val("");
            $("#addDepartment").val("");
        };
    };
};

function postNewProduct(newProduct){
    console.log(newProduct);
    $.ajax({
        url:"api/manager/products",
        method:"POST",
        data:newProduct
    }).then(function(response){
        // console.log(response);
        if(response.success){
            normalOrLow();
        }
        else{
            alert("Product was not added, please try again.");
        }
    });

};

function validateUpdate(id,quantity){
    if(id===""||quantity===""){
        alert("Please fill both fields.");
    }
    else{
        // Neither is blank, check if they are numbers
        // console.log("Neither is blank.");
        // console.log(parseInt(id),parseInt(quantity));
        if(!parseInt(id)||!parseInt(quantity)){
            alert("Please enter a number in both fields.");
        }
        else{
            // both are numbers, check if id exists
            // console.log("Both are numbers.");
            let exists=false;
            // console.log(products);
            products.forEach(function(item){
                // console.log(item.id);
                if(parseInt(id)===item.id){
                    exists=true;
                };
            });
            if(exists){
                changeQuantity(id,quantity);
            }
            else{
                alert("The entered ID is invalid in this view. Please try again.");
            };
        };
    }; 
};


function normalOrLow(){
    // renders the updated list depending on whichever view was previously rendered
    if(currentView==="view"){
        getData();
    }
    else if(currentView==="low"){
        getLowData();
    };
};

function changeQuantity(id,quantity){
    // console.log("changeQuantity()");
    $.ajax({
        url:`/api/manager/${id}`,
        method:"PUT",
        data:{availQty:quantity}
    })
    .then(function(response){
        if(response.success){
            // alert("They quantity has been successfully updated.");
            normalOrLow();
            $("#updateId").val("");
            $("#updateQuantity").val("");
        }
        else{
            alert("There was a problem updating the quantity.");
        }
    })
};

function validateDelete(id){
    if(id===""){
        alert("Please enter the ID of the product.");
    }
    else{
        // check that input is a number
        if(!parseInt(id)){
            alert("Enter a number for the ID.");
        }
        else{
            // it is a number, check that it exists in products list
            let exists=false;
            // console.log(products);
            products.forEach(function(item){
                // console.log(item.id);
                if(parseInt(id)===item.id){
                    exists=true;
                };
            });
            if(exists){
                removeProduct(id);
            }
            else{
                alert("Please enter a valid ID.");
            };
        };
    };
};

function removeProduct(itemId){
    // console.log(itemId);
    $.ajax({
        url:`/api/manager/${itemId}`,
        method:"DELETE"
    })
    .then(function(res){
        if(res.success){
            // alert("Item successfully removed from cart.");
        }
        else{
            alert("Unable to remove from cartDb.");
        };
        normalOrLow();
        $("#deleteId").val("");
    });
};

function changeView(view) {
    // console.log(view,typeof(view));
    switch (view) {
        case "view":
            // console.log('view');
            addBar.addClass("hidden");
            upBar.addClass("hidden");
            delBar.addClass("hidden");
            currentView="view";
            getData();
            break;
        case "low":
            // console.log('low');
            addBar.addClass("hidden");
            upBar.addClass("hidden");
            delBar.addClass("hidden");
            currentView="low";
            getLowData();
            break;
        case "new":
            // console.log('new');
            addBar.removeClass("hidden");
            upBar.addClass("hidden");
            delBar.addClass("hidden");
            break;
        case 'update':
            // console.log('update');
            addBar.addClass("hidden");
            upBar.removeClass("hidden");
            delBar.addClass("hidden");
            break;
        case 'delete':
            // console.log('delete');
            addBar.addClass("hidden");
            upBar.addClass("hidden");
            delBar.removeClass("hidden");
            break;

        default:
            break;
    }
};

//renders the collected items
function displayItems(productList){
    // console.log(productList);
    itemsDump.empty();
    productList.forEach(function(product){
        // console.log(product);
        itemsDump.append(`<div class="itemContainer"><div class="row"><div class="col-2 centerBox left35"><img class="managerResize" src="${product.imageUrl}"></div><div class="col-10">
        <ul class="productInfo" style="list-style-type:none">
            <li><strong>${product.name}</strong></li>
            <li>ID: ${product.id}</li>
            <li>Price: $${product.price}</li>
            <li>In Stock: ${product.availQty}</li>
        </ul>
        </div></div></div>`);
    });
};

// Event Handlers
$('#view').click(function(){
    let myView=($(this)[0].id).trim();
    // console.log(myView,typeof(myView));
    changeView(myView);
});

$('#low').click(function(){
    let myView=($(this)[0].id).trim();
    // console.log(myView,typeof(myView));
    changeView(myView);
});

$('#new').click(function(){
    let myView=($(this)[0].id).trim();
    // console.log(myView,typeof(myView));
    changeView(myView);
});

$('#update').click(function(){
    let myView=($(this)[0].id).trim();
    // console.log(myView,typeof(myView));
    changeView(myView);
});

$('#delete').click(function(){
    let myView=($(this)[0].id).trim();
    // console.log(myView,typeof(myView));
    changeView(myView);
});

$("#addBtn").click(function(event){
    event.preventDefault();
    let newProduct={
        name:$("#addName").val().trim(),
        price:$("#addPrice").val().trim(),
        availQty:$("#addQuantity").val().trim(),
        imageUrl:$("#addImage").val().trim(),
        department:$("#addDepartment").val().trim()
    };
    validateNewProduct(newProduct);
});

$("#upBtn").click(function(e){
    e.preventDefault();
    let itemsId=$("#updateId").val().trim();
    let quantity=$("#updateQuantity").val().trim();
    validateUpdate(itemsId,quantity);
});

$("#deleteBtn").click(function(e){
    e.preventDefault();
    let number=$("#deleteId").val().trim();
    validateDelete(number);
})



// getData();
checkValidUser(validLogin);