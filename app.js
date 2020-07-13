const itemsList = document.getElementById('itemsList');
const cart = document.getElementById('cart');
const overview = document.getElementById('overview');
const searchBar = document.getElementById('searchBar');
let allItems = [];
let cartItems = [];

searchBar.addEventListener('keyup', (e) => {
    const typedValue = e.target.value.toLowerCase();

    const filteredItems = allItems.filter((item) => {
        return (
            item.name.toLowerCase().includes(typedValue)
        );
    });
    displayItems(filteredItems);
});

const loadItems = async () => {
    try {
        const data = await fetch('https://s3.eu-central-1.amazonaws.com/code-challenge-shopping-cart/cart.json');
        allItems = await data.json();
        displayItems(allItems);
    } catch (err) {
        console.error(err);
    }
};

loadItems();

const displayItems = (items) => {
    const htmlString = items
        .map((item) => {
            return `
            <li class="item">
                <img src="${item.image}"></img>
                <h2>${item.name}</h2>
                <p>Price: ${item.price}</p>
                <button id="${item.id}" onclick="addItem(${item.id})">Add to Cart &#x2795;</button>
            </li>
        `;
        })
        .join('');
    itemsList.innerHTML = htmlString;
};

const sortUp = () => {
    const sortedItems = allItems.sort((a, b) => a.price - b.price);
    displayItems(sortedItems);
};

const sortDown = () => {
    const sortedItems = allItems.sort((a, b) => b.price - a.price);
    displayItems(sortedItems);
};

const addItem = (id) => {
    const item = allItems.filter(x => x.id === id)[0];
    cartItems.push(item);
    let itemDiv = document.createElement('div')
    itemDiv.className = "cartItem";
    itemDiv.id = item.id + Math.floor(Math.random() * 100) + 1;
    const htmlString =
        `    
            <img src="${item.image}"></img>
            <h2>${item.name}</h2>
            <p>Price: ${item.price}</p>
            <button onclick="deleteItem(${itemDiv.id},${item.id})">Remove from Cart &#x2796;</button>
             
        `
    itemDiv.innerHTML = htmlString
    cart.appendChild(itemDiv);

    updateTotal();
};

const deleteItem = (divId, itemId) => {
    cartItems.some((item, index) => {
        if (item.id === itemId) {
            cartItems.splice(index, 1);
            return true;
        }
    });
    document.getElementById(divId).remove();

    updateTotal();
};

const updateTotal = () => {
    const prices = cartItems.map((el) => el.price);
    const totalPrice = prices.reduce((a, b) => a + b, 0);
    const htmlString2 =
        `  <div class="cartItem">  
                <h2>Items: ${cartItems.length}</h2>
                <h2>Total Price: ${totalPrice}</h2>
           </div>
        `
    overview.innerHTML = htmlString2;
}