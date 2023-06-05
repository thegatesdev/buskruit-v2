const tableBody = document.getElementById("product-table-body");

let selectingProduct = null;

function onAddProduct(){
    if (selectingProduct === null){
        selectingProduct = currentInput;
    }else{
        addProduct(selectingProduct, isNaN(currentInput) || currentInput < 1 ? 1 : currentInput);
        updateTable();
        selectingProduct = null;
    }
    updateInput(0);
}

const activeProducts = {};
const fetchingProducts = {};

async function updateTable(){
    await fetchAll();
    tableBody.innerHTML = '';
    for ([,prod] of Object.entries(activeProducts)) appendProductRow(prod);
}

async function fetchAll(){
    for ([id, f] of Object.entries(fetchingProducts)){
        const res = await f.promise;
        if (res.ok){
            const json = await res.json();
            if (json.ok){
                const content = json.content;
                if (id in activeProducts) activeProducts[id].amount += f.amount;
                else activeProducts[id] = {
                    desc: content.description,
                    unit: content.unit,
                    price: content.price,
                    amount: f.amount,
                }
            }
        }
        delete fetchingProducts[id];        
    }
}

function addProduct(prodId, amount){
    if (prodId in activeProducts){
        activeProducts[prodId].amount += amount;
        return;
    }
    if (prodId in fetchingProducts){
        fetchingProducts[prodId].amount += amount;
        return;
    }
    fetchingProducts[prodId] = {
        amount: amount,
        promise: fetchProduct(prodId),
    }
}

function appendProductRow(prod){
    const row = tableBody.appendChild(document.createElement('tr'));
    row.insertCell().innerHTML = prod.desc;
    row.insertCell().innerHTML = prod.unit;
    row.insertCell().innerHTML = prod.price;
    row.insertCell().innerHTML = prod.amount;
}

function fetchProduct(productNum){
    return fetch("../api/products/getproduct.php", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
            product_id: productNum
        }),
    });
}