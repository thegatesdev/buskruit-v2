
// Products

const activeProducts = {};
const fetchingProducts = {};

async function fetchProducts(){
    for ([id, f] of Object.entries(fetchingProducts)){
        const res = await f.promise;
        if (res.ok){
            const json = await res.json();
            if (json.ok){
                const content = json.content;
                if (id in activeProducts) activeProducts[id].amount += f.amount;
                else activeProducts[id] = {
                    id: id,
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

function addProduct(prodId, amount){
    if (amount == 0) return;
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

function removeProduct(prodId){
    delete activeProducts[prodId];
    delete fetchingProducts[prodId];
}

// Table

const tableBody = document.getElementById("product-table-body");

async function updateProductTable(){
    await fetchProducts();
    tableBody.innerHTML = '';
    for ([,prod] of Object.entries(activeProducts)){
        if (prod.amount == 0) removeProduct();
        else appendProductRow(prod);
    }
}

function appendProductRow(prod){
    const htmlRow = tableBody.appendChild(document.createElement('tr'));
    htmlRow.insertCell().innerHTML = prod.desc;
    htmlRow.insertCell().innerHTML = prod.unit;
    htmlRow.insertCell().innerHTML = prod.price;
    htmlRow.insertCell().innerHTML = prod.amount;

    const row = $(htmlRow);
    if (selectedProductRow === prod.id) row.addClass('selected').siblings().removeClass('selected');
    row.click(function(){
        setSelected(prod.id);
        $(this).addClass('selected').siblings().removeClass('selected');
    });
}

let selectedProductRow = null;

function setSelected(prodId = selectedProductRow){
    selectedProductRow = prodId;
    updateInput(selectedProductRow);
}

// Adding / removing

let prodBeingAdded = null;

function onAddProduct(){
    if (prodBeingAdded === null){
        prodBeingAdded = currentInput;
        setInputPrefix("Aantal: ");
        updateInput(0);
    }else{
        addProduct(prodBeingAdded, Math.max(1,getCurrentInput()));
        clearBeingAdded();
        updateProductTable();
    }
}

function clearBeingAdded(){
    setInputPrefix(null);
    prodBeingAdded = null;
    setSelected(selectedProductRow ?? 0);
}

function onRemoveProduct(){
    const input = getCurrentInput();
    if (isNaN(input)) return;
    updateInput(0);
    if (prodBeingAdded !== null){
        clearBeingAdded();
        return;
    }
    removeProduct(input);
    updateProductTable();
}