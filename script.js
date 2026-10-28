const products = [
    {
        id: 1,
        name: "Venum Lobo",
        type: "Sparring",
        category: "sparring",
        price: 329.90,
        oz: "14–16 OZ",
        desc: "Visual marcante e acolchoamento para treinos intensos.",
        badge: "DESTAQUE",
        a: "#252923",
        b: "#11130f"
    },
    {
        id: 2,
        name: "Venum Training",
        type: "Treino",
        category: "treino",
        price: 279.90,
        oz: "12–16 OZ",
        desc: "Espuma de tripla densidade e ajuste anatômico.",
        badge: "MAIS VENDIDA",
        a: "#e6e4d8",
        b: "#a5a697"
    },
    {
        id: 3,
        name: "Green Hill Eagle Eye",
        type: "Couro legítimo",
        category: "couro",
        price: 449.90,
        oz: "14–16 OZ",
        desc: "Couro selecionado e fechamento em cadarço.",
        badge: "COURO",
        a: "#343b2b",
        b: "#11150f"
    },
    {
        id: 4,
        name: "FAUNA Rhino",
        type: "Treino",
        category: "treino",
        price: 359.90,
        oz: "12–16 OZ",
        desc: "Design inspirado na força do rinoceronte.",
        badge: "FAUNA SERIES",
        a: "#c8c9bd",
        b: "#73776b"
    },
    {
        id: 5,
        name: "FAUNA Panther",
        type: "Sparring",
        category: "sparring",
        price: 389.90,
        oz: "14–16 OZ",
        desc: "Modelo de perfil discreto para sessões exigentes.",
        badge: "NOVO",
        a: "#373a33",
        b: "#090a08"
    },
    {
        id: 6,
        name: "FAUNA Viper",
        type: "Treino",
        category: "treino",
        price: 249.90,
        oz: "10–14 OZ",
        desc: "Mobilidade para treinos técnicos.",
        badge: "ESSENCIAL",
        a: "#c8e36c",
        b: "#71852c"
    }
];

const money = value =>
    value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

let filter = "todos";

let cart = JSON.parse(
    localStorage.getItem("fauna-cart") || "[]"
);

let favorites = JSON.parse(
    localStorage.getItem("fauna-favorites") || "[]"
);

const grid = document.getElementById("product-grid");
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");


function visibleProducts() {
    let list = products.filter(product =>
        filter === "todos" ||
        product.category === filter
    );

    const sort = document.getElementById("sort").value;

    if (sort === "low") {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        list.sort((a, b) => b.price - a.price);
    }

    return list;
}


function renderProducts() {
    grid.innerHTML = visibleProducts().map(product => `
        <article class="product-card">

            <div
                class="product-image"
                style="
                    --glove-a: ${product.a};
                    --glove-b: ${product.b};
                "
            >

                <span class="product-badge">
                    ${product.badge}
                </span>

                <button
                    class="favorite ${favorites.includes(product.id) ? "saved" : ""}"
                    data-favorite="${product.id}"
                    aria-label="Favoritar ${product.name}"
                >
                    ${favorites.includes(product.id) ? "♥" : "♡"}
                </button>

                <div class="product-art"></div>

            </div>

            <div class="product-info">

                <span class="product-type">
                    ${product.type}
                </span>

                <h3>${product.name}</h3>

                <p class="product-desc">
                    ${product.desc}
                </p>

                <div class="product-meta">
                    <span class="price">
                        ${money(product.price)}
                    </span>

                    <span class="oz">
                        ${product.oz}
                    </span>
                </div>

                <button
                    class="add-button"
                    data-add="${product.id}"
                >
                    ADICIONAR À SACOLA +
                </button>

            </div>

        </article>
    `).join("");
}


function saveCart() {
    localStorage.setItem(
        "fauna-cart",
        JSON.stringify(cart)
    );

    renderCart();
}


function renderCart() {
    const count = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    document.getElementById("cart-count").textContent = count;

    document.getElementById("drawer-count").textContent =
        `(${count})`;

    const items = document.getElementById("cart-items");

    if (cart.length === 0) {
        items.innerHTML = `
            <p class="empty-cart">
                Sua sacola está vazia.
            </p>
        `;
    } else {
        items.innerHTML = cart.map(item => {
            const product = products.find(
                p => p.id === item.id
            );

            return `
                <div class="cart-item">

                    <div
                        class="mini-art"
                        style="
                            --glove-a: ${product.a};
                            --glove-b: ${product.b};
                        "
                    >
                        <div class="product-art"></div>
                    </div>

                    <div>
                        <h3>${product.name}</h3>

                        <p>${money(product.price)}</p>

                        <div class="quantity">

                            <button
                                data-qty="${product.id}"
                                data-change="-1"
                            >−</button>

                            <span>${item.qty}</span>

                            <button
                                data-qty="${product.id}"
                                data-change="1"
                            >+</button>

                        </div>
                    </div>

                    <button
                        class="remove-item"
                        data-remove="${product.id}"
                        aria-label="Remover produto"
                    >
                        ×
                    </button>

                </div>
            `;
        }).join("");
    }

    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(
            p => p.id === item.id
        );

        return sum + product.price * item.qty;
    }, 0);

    document.getElementById("subtotal").textContent =
        money(subtotal);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


function openCart() {
    drawer.classList.add("open");
    overlay.classList.add("visible");

    drawer.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("visible");

    drawer.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}


grid.addEventListener("click", event => {

    const addButton = event.target.closest("[data-add]");
    const favoriteButton = event.target.closest("[data-favorite]");

    if (addButton) {
        const id = Number(addButton.dataset.add);

        const item = cart.find(
            product => product.id === id
        );

        if (item) {
            item.qty++;
        } else {
            cart.push({
                id: id,
                qty: 1
            });
        }

        saveCart();

        showToast("Produto adicionado à sacola.");
    }

    if (favoriteButton) {
        const id = Number(favoriteButton.dataset.favorite);

        if (favorites.includes(id)) {
            favorites = favorites.filter(
                productId => productId !== id
            );
        } else {
            favorites.push(id);
        }

        localStorage.setItem(
            "fauna-favorites",
            JSON.stringify(favorites)
        );

        renderProducts();

        showToast(
            favorites.includes(id)
                ? "Adicionado aos favoritos."
                : "Removido dos favoritos."
        );
    }
});


document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        filter = button.dataset.filter;

        renderProducts();
    });
});


document.getElementById("sort").addEventListener(
    "change",
    renderProducts
);


document.getElementById("open-cart").addEventListener(
    "click",
    openCart
);

document.getElementById("close-cart").addEventListener(
    "click",
    closeCart
);

overlay.addEventListener("click", closeCart);

document.getElementById("cart-items").addEventListener(
    "click",
    event => {

        const quantityButton = event.target.closest("[data-qty]");
        const removeButton = event.target.closest("[data-remove]");

        if (quantityButton) {
            const id = Number(quantityButton.dataset.qty);
            const change = Number(quantityButton.dataset.change);

            const item = cart.find(
                product => product.id === id
            );

            if (item) {
                item.qty += change;

                if (item.qty <= 0) {
                    cart = cart.filter(
                        product => product.id !== id
                    );
                }

                saveCart();
            }
        }

        if (removeButton) {
            const id = Number(removeButton.dataset.remove);

            cart = cart.filter(
                product => product.id !== id
            );

            saveCart();
        }
    }
);


document.getElementById("checkout").addEventListener(
    "click",
    () => {
        if (cart.length === 0) {
            showToast("Adicione um produto à sacola primeiro.");
            return;
        }

        showToast(
            "Checkout demonstrativo: pagamentos ainda não integrados."
        );
    }
);

// FECHAR COM ESC

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
    }
});

// INICIALIZAÇÃO

renderProducts();
renderCart();