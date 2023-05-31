import './input.js';

const tableContent = document.getElementById("product-table").getElementsByClassName("table-content")[0];

const activeProducts = {};

function updateTable(){
    tableContent.textContent = '';
    for (p of activeProducts){
        tableContent.appendChild(createTableRow(p.name, p.unit, p.price, p.amount));
    }
}

function addProduct(prod){
    activeProducts[prod.id] = prod;
}

function createTableRow(name, unit, price, amount){

}

function fetchProduct(productNum){
    return ("./api/product.php", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
            product_id: productNum
        }),
    });
}