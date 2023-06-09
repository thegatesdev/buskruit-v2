
// Connection

function fetchApi(path, jsonBody){
    return fetch("../api/"+path, {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(jsonBody),
    });
}

function fetchProduct(productNum){
    return fetchApi("products/meta.php", {
        type: "getproduct",
        product_id: productNum
    });
}

function postCheckoutItems(products){
    return fetchApi("products/updatecheckout.php", {
        // TODO
    });
}


async function fetchProductIds(){
    const res = await fetchApi("products/meta.php", {type: "getindexes"});
    if (!res.ok) return false;
    const json = await res.json();
    if (!json.ok) return false;
    return json.content.product_ids;
}

// Products

let productIds = null;
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
                    storage: content.storage,
                }
            }else showPopup(json.error.title, json.error.msg);
        }else showPopup("Kon product niet ophalen");
        delete fetchingProducts[id];        
    }
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
    if (productIds !== null && !productIds.includes(prodId)){
        showPopup("Product bestaat niet", "Dit product bestaat niet!");
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
        if (prod.amount == 0){
            removeProduct(prod.id);
            continue;
        }
        prod.amount = Math.min(prod.amount, prod.storage);
        appendProductRow(prod);
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
        updateInput(0);
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

fetchProductIds().then(value => {
    if (value !== false){
        productIds = value.map(function (x) {
            return parseInt(x);
        });
        console.log("Got product indexes.");
    } else console.log("Failed to get product indexes.");
});

// Popup

const popup = document.getElementById("message-popup");
let popupTimeout = null;

function showPopup(title, message = null, time = 2000){
    // Remove previous hide message timout
    if (popupTimeout != null) clearTimeout(popupTimeout);

    popup.classList.add("show");
    popup.innerText = (message === null ? "" : message);

    popupTimeout = setTimeout(hidePopup,time);
}

function hidePopup(){
    popup.classList.remove("show");
    popupTimeout = null;
}