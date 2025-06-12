const carrito = [];
let totalGlobal = 0;

document.querySelectorAll(".agregar").forEach(btn => {
    btn.addEventListener("click", () => {
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);
        const item = carrito.find(i => i.nombre === nombre);
        if (item) item.cantidad++;
        else carrito.push({ nombre, precio, cantidad: 1 });
        actualizarCarrito(); actualizarTotales();
    });
});

function actualizarCarrito() {
    document.getElementById("tabla-carrito").innerHTML =
        carrito.map(i => `<tr><td>${i.nombre}</td><td>$${(i.precio * i.cantidad).toFixed(2)}</td></tr>`).join("");
    document.getElementById("tablaLicencias").innerHTML =
        carrito.map(i => `<tr><td>${i.nombre}</td><td>${i.cantidad}</td><td>$${(i.precio * i.cantidad).toFixed(2)}</td></tr>`).join("");
}

function vaciarCarrito() {
    carrito.length = 0;
    actualizarCarrito();
    actualizarTotales();
}

function finalizarCompra() {
    if (carrito.length === 0) return alert("No hay productos en el carrito.");
    let subtotal = carrito.reduce((a, b) => a + b.precio * b.cantidad, 0);
    let iva = +(subtotal * 0.19).toFixed(2);
    let total = +(subtotal + iva).toFixed(2);
    localStorage.setItem('compra', JSON.stringify({ items: carrito, total }));
    window.location.href = 'pago.html';
}

function actualizarTotales() {
    let subtotal = carrito.reduce((a, b) => a + b.precio * b.cantidad, 0);
    let iva = +(subtotal * 0.19).toFixed(2);
    let total = +(subtotal + iva).toFixed(2);
    document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("iva").innerText = `$${iva}`;
    document.getElementById("total").innerText = `$${total}`;
}