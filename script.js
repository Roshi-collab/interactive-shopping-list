
let shoppingList = [];

let editingIndex = null;

const form = document.querySelector('form');
const container = document.querySelector('.container');
const totalCostElement = document.querySelector('.total');
const btns = document.querySelector('.btn-sections');

function updateTotalCost() {
    const total = shoppingList.reduce((sum, item) => {
        if (item.purchased) {
            return sum + Number(item.price || 0);
        }

        return sum;
    }, 0);

    totalCostElement.textContent =
        `Total purchased: Ksh ${total.toFixed(2)}`;
}

function displayItems() {
    container.innerHTML = '';

    shoppingList.forEach((item, index) => {
        const itemCard = document.createElement('div');

        itemCard.className =
            `item ${item.purchased ? 'is-purchased' : ''}`;

        if (editingIndex === index) {
            itemCard.innerHTML = `
                <div class="edit-form">
                    <input
                        type="text"
                        class="edit-name"
                        value="${escapeHTML(item.name)}"
                        aria-label="Edit item name"
                    >

                    <input
                        type="number"
                        class="edit-price"
                        value="${Number(item.price)}"
                        min="0"
                        step="0.01"
                        aria-label="Edit item price"
                    >

                    <div class="inline-actions">
                        <button type="button" class="save-edit">
                            Save
                        </button>

                        <button type="button" class="cancel-edit">
                            Cancel
                        </button>
                    </div>
                </div>
            `;
        } else {
            itemCard.innerHTML = `
                <div class="item-details">
                    <h4 class="title">${escapeHTML(item.name)}</h4>

                    <p class="price">
                        Ksh ${Number(item.price).toFixed(2)}
                    </p>
                </div>

                <div class="check">
                    <input
                        type="checkbox"
                        id="mark-${index}"
                        ${item.purchased ? 'checked' : ''}
                    >

                    <label for="mark-${index}">
                        Mark as purchased
                    </label>

                    <button
                        type="button"
                        class="edit-item"
                    >
                        Edit
                    </button>
                </div>
            `;
        }

        container.appendChild(itemCard);
    });

    updateTotalCost();

    if (shoppingList.length > 0) {
        btns.classList.remove('hidden');
    } else {
        btns.classList.add('hidden');
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const characters = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return characters[character];
    });
}

container.addEventListener('click', (e) => {
    const itemCard = e.target.closest('.item');

    if (!itemCard) return;

    const cards = Array.from(container.children);
    const index = cards.indexOf(itemCard);

    if (index === -1) return;

    if (e.target.closest('.edit-item')) {
        editingIndex = index;
        displayItems();
    }


    if (e.target.closest('.save-edit')) {
        const nameInput = itemCard.querySelector('.edit-name');
        const priceInput = itemCard.querySelector('.edit-price');

        const newName = nameInput.value.trim();
        const priceText = priceInput.value.trim();
        const newPrice = Number(priceText);

        if (
            newName === '' ||
            priceText === '' ||
            !Number.isFinite(newPrice) ||
            newPrice < 0
        ) {
            alert('Please enter a valid item name and price.');
            return;
        }

        shoppingList[index].name = newName;
        shoppingList[index].price = newPrice;

        editingIndex = null;

        saveList();
        displayItems();
    }

    
    if (e.target.closest('.cancel-edit')) {
        editingIndex = null;
        displayItems();
    }
});

container.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
        const itemCard = e.target.closest('.item');
        const index = Array.from(container.children).indexOf(itemCard);

        if (index === -1 || !shoppingList[index]) return;

        shoppingList[index].purchased = e.target.checked;

        saveList();
        displayItems();
    }
});

function saveList() {
    localStorage.setItem(
        'shoppingList',
        JSON.stringify(shoppingList)
    );
}

function loadList() {
    const savedList = localStorage.getItem('shoppingList');

    if (savedList) {
        try {
            const parsedList = JSON.parse(savedList);

            if (Array.isArray(parsedList)) {
                shoppingList = parsedList
                    .filter((item) =>
                        item &&
                        typeof item.name === 'string' &&
                        item.name.trim() !== '' &&
                        Number.isFinite(Number(item.price)) &&
                        Number(item.price) >= 0
                    )
                    .map((item) => ({
                        name: item.name,
                        price: Number(item.price),
                        purchased: item.purchased === true
                    }));
            }
        } catch (error) {
            shoppingList = [];
        }
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const itemName = form.product.value.trim();
    const priceText = form.price.value.trim();
    const itemPrice = Number(priceText);

    if (
        itemName === '' ||
        priceText === '' ||
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
    editingIndex = null;

    saveList();
    displayItems();
});

loadList();
displayItems();
