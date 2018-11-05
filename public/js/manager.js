// variables
const itemsDump=$("#products");
const addBar=$("#addBar");
const upBar=$("#upBar");
const delBar=$("#deleteBar");
let products=[];
let currentView="view";

// Functions
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

function postNewProduct(){
    let newProduct={
        name:$("#addName").val().trim(),
        price:$("#addPrice").val().trim(),
        availQty:$("#addQuantity").val().trim(),
        imageUrl:$("#addImage").val().trim(),
        department:$("#addDepartment").val().trim()
    };
    console.log(newProduct);
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
            };
        };
    }; 
};

function normalOrLow(){
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
        }
        else{
            alert("There was a problem updating the quantity.");
        }
    })
};

function removeProduct(itemId){

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
    if($("#addName").val().trim()&&
    $("#addPrice").val().trim()&&
    $("#addQuantity").val().trim()&&
    $("#addImage").val().trim()&&
    $("#addDepartment").val().trim()){
        postNewProduct();
    }
    else{
        alert("Please fill in all fields.");
    }
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
    if(number===""){
        alert("Please enter a product ID in the entry field.");
    }
    else if(parseInt(number)){
    removeProduct(number);
    }
    else{
        alert("Please enter a number into the field.");
    };

})



getData();