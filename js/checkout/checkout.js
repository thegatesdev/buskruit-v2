const table = document.getElementById("product-table");
const tableContent = document.getElementById("product-content");

const activeProducts = {
    1: {
        desc: "Test",
        unit: "KG",
        price: 2,
        amount: 20
    }
};

updateTable();

function updateTable(){
    tableContent.textContent = '';
    for ([,prod] of Object.entries(activeProducts)) appendProductRow(prod);
}

async function addProduct(prodId, amount){
    if (amount == 0) return;
    if (prodId in activeProducts){ // Product already exists, add amount
        activeProducts[prodId].amount += amount;
        return;
    }
    const res = await fetchProduct(prodId);
    if (!res.ok){
        alert("Could not fetch product");
        return;
    } 
    const json = await res.json();
    if (!("product" in json)){
        alert("Could not resolve product");
        return;
    }

    activeProducts[prodId] = {
        desc: json.description,
        unit: json.unit,
        price: json.price,
        amount: amount
    }
}

function appendProductRow(prod){
    const row = table.insertRow(1);
    row.insertCell().innerHTML = prod.desc;
    row.insertCell().innerHTML = prod.unit;
    row.insertCell().innerHTML = prod.price;
    row.insertCell().innerHTML = prod.amount;
}

function fetchProduct(productNum){
    return fetch("./api/product.php", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
            product_id: productNum
        }),
    });
}