const tableBody = document.getElementById("product-table-body");

let addingProduct = null;

function onAddProduct(){
    if (addingProduct === null){
        addingProduct = currentInput;
        setInputPrefix("Aantal: ");
        updateInput(0);
    }else{
        addProduct(addingProduct, Math.max(1,getCurrentInput()));
        resetAdding();
        updateTable();
    }
}

function resetAdding(){
    setInputPrefix(null);
    addingProduct = null;
    setSelected(selectedProductRow ?? 0);
}

function onRemoveProduct(){
    const input = getCurrentInput();
    if (isNaN(input)) return;
    updateInput(0);
    if (addingProduct !== null){
        resetAdding();
        return;
    }
    removeProduct(input);
    updateTable();
}

const activeProducts = {};
const fetchingProducts = {};

async function updateTable(){
    await fetchAll();
    tableBody.innerHTML = '';
    for ([,prod] of Object.entries(activeProducts)){
        if (prod.amount == 0) removeProduct();
        else appendProductRow(prod);
    }
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

function appendProductRow(prod){
    const row = tableBody.appendChild(document.createElement('tr'));
    row.insertCell().innerHTML = prod.desc;
    row.insertCell().innerHTML = prod.unit;
    row.insertCell().innerHTML = prod.price;
    row.insertCell().innerHTML = prod.amount;
    onProductRowAdd(row, prod);
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

let selectedProductRow = null;

function onProductRowAdd(htmlRow, prod){
    const row = $(htmlRow);
    if (selectedProductRow === prod.id) row.addClass('selected').siblings().removeClass('selected');
    row.click(function(){
        setSelected(prod.id);
        $(this).addClass('selected').siblings().removeClass('selected');
    });
}

function setSelected(prodId = selectedProductRow){
    selectedProductRow = prodId;
    updateInput(selectedProductRow);
}