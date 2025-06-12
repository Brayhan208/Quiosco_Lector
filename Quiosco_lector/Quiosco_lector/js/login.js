document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const user = document.querySelector("input[name='user']").value.trim();
    const pass = document.querySelector("input[name='clave']").value.trim();

    if (user === "admin" && pass === "admin123") {
        localStorage.setItem("rol", "admin");
        window.location.href = "perfil.html";
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});