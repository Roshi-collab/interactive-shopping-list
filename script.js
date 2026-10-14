
let shoppingList = [];

const form = document.querySelector('form');
const container = document.querySelector('.container');
const total = document.querySelector('.total');
const btns = document.querySelector('.btn-sections');

function displayItems() {
    container.innerHTML = '';

    shoppingList.forEach((item, index) => {
        const itemCard = `<div class="item">
            <div id="details-${index}" class="${item.purchased ? 'purchased' : ''}">
                <h4 class="title">${item.name}</h4>
                <p class="price">Ksh ${Number(item.price).toFixed(2)}</p>
            </div>

            <div class="check">
                <input
                    type="checkbox"
                    id="mark-${index}"
                    ${item.purchased ? 'checked' : ''}
                    onchange="togglePurchased(${index})"
                >
                <label for="mark-${index}">Mark as purchased</label>
                
            </div>
        </div>`;

        container.insertAdjacentHTML('beforeend', itemCard);
    });

    updateTotal();

    if (shoppingList.length > 0) {
        btns.classList.remove('hidden');
    } else {
        btns.classList.add('hidden');
    }
}

function togglePurchased(index) {
    const checkbox = document.getElementById(`mark-${index}`);

    shoppingList[index].purchased = checkbox.checked;

    saveList();
    displayItems();
}

function updateTotal() {
    let sum = 0;

    shoppingList.forEach((item) => {
        if (item.purchased) {
            sum += Number(item.price);
        }
    });

    total.textContent = `Total purchased: Ksh ${sum.toFixed(2)}`;
}

function editItem(index) {
    const newName = prompt(
        'Enter item name:',
        shoppingList[index].name
    );

    if (newName === null || newName.trim() === '') {
        return;
    }

    const newPrice = prompt(
        'Enter item price:',
        shoppingList[index].price
    );

    if (
        newPrice === null ||
        newPrice.trim() === '' ||
        !Number.isFinite(Number(newPrice)) ||
        Number(newPrice) < 0
    ) {
        alert('Please enter a valid price.');
        return;
    }

    shoppingList[index].name = newName.trim();
    shoppingList[index].price = Number(newPrice);

    saveList();
    displayItems();
}

function saveList() {
    localStorage.setItem(
        'shoppingList',
        JSON.stringify(shoppingList)
    );
}
const savedList = localStorage.getItem('shoppingList');

if (savedList) {
    try {
        shoppingList = JSON.parse(savedList);
    } catch (error) {
        shoppingList = [];
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const itemName = form.product.value.trim();
    const itemPrice = Number(form.price.value);

    if (
        itemName === '' ||
        form.price.value === '' ||
        !Number.isFinite(itemPrice) ||
        itemPrice < 0
    ) {
        alert('Please enter an item name and a valid price.');
        return;
    }

    shoppingList.push({
        name: itemName,
        price: itemPrice,
        purchased: false
    });

    saveList();
    form.reset();
    displayItems();
});

document.querySelector('.clear-list').addEventListener('click', () => {
    shoppingList = [];

    saveList();
    displayItems();
});

displayItems();
