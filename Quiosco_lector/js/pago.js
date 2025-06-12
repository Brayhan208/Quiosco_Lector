document.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("compra"));
    const totalInput = document.getElementById("valorCuota");
    const cuotasInput = document.getElementById("cuotas");

    // Mostrar total de la compra
    const totalCompra = document.getElementById("totalCompra");
    if (data && data.total) {
        totalCompra.textContent = `$${data.total.toFixed(2)}`;
        calcularValorCuota();
    } else {
        totalCompra.textContent = "$0";
        totalInput.value = 0;
    }

    cuotasInput.addEventListener("input", calcularValorCuota);

    function calcularValorCuota() {
        const cuotas = parseInt(cuotasInput.value);
        if (data && cuotas > 0) {
            totalInput.value = (data.total / cuotas).toFixed(2);
        }
    }

    // Validar número de tarjeta y detectar franquicia en tiempo real
    window.formatearTarjeta = function () {
        const input = document.getElementById("numeroTarjeta");
        let valor = input.value.replace(/\D/g, "").substring(0, 16);
        const grupos = valor.match(/.{1,4}/g);
        if (grupos) {
            input.value = grupos.join("-");
        }
        validarFranquicia(valor);
    };

    function validarFranquicia(numero) {
        const franquiciaImg = document.getElementById("franquiciaImg");
        let src = "img/credito.png";
        if (numero.startsWith('4')) src = "img/visa.svg";
        else if (numero.startsWith('5')) src = "img/mastercard.jpg";
        else if (numero.startsWith('3')) src = "img/amex.jpg";
        else if (numero.startsWith('7')) src = "img/diners.png";
        franquiciaImg.src = src;
    }

    // Validar formulario y mostrar resumen
    document.getElementById("pagoForm").addEventListener("submit", e => {
        e.preventDefault();
        const mes = document.getElementById("mesExpiracion").value;
        const anio = document.getElementById("anoExpiracion").value;

        if (!mes || !anio) {
            alert("Seleccione mes y año de expiración");
            return;
        }

        const resumen = document.getElementById("resumenCompra");
        resumen.innerHTML = `
            <h4>Resumen de Compra</h4>
            <p>Total: $${data.total.toFixed(2)}</p>
            <p>Cuotas: ${cuotasInput.value}</p>
            <p>Valor por cuota: $${totalInput.value}</p>
        `;
        document.getElementById("confirmacionModal").style.display = "flex";
    });

    document.getElementById("confirmarPago").addEventListener("click", () => {
        alert("¡Pago confirmado!");
        localStorage.removeItem("compra");
        window.location.href = "planes.html";
    });

    // Validación de código de seguridad
    document.getElementById("codigoSeguridad").addEventListener("input", e => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
});
