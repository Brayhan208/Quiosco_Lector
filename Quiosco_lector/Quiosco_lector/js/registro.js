const fechaNacimiento = document.getElementById('fechaNacimiento');
const edadInput = document.getElementById('edad');
const nombreInput = document.getElementById('nombre');
const apellidosInput = document.getElementById('apellidos');
const usuarioInput = document.getElementById('usuario');
const form = document.getElementById('registroForm');
const btnRegistrar = document.getElementById('btnRegistrar');

// Calcular edad automáticamente
fechaNacimiento.addEventListener('change', () => {
  const fecha = new Date(fechaNacimiento.value);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }
  edadInput.value = edad >= 0 ? edad : '';
});

// Generar nombre de usuario automáticamente
function generarUsuario() {
  const nombre = nombreInput.value.trim().toLowerCase();
  const apellido = apellidosInput.value.trim().toLowerCase();
  if (nombre && apellido) {
    const random = Math.floor(Math.random() * 10000);
    usuarioInput.value = `${nombre}.${apellido}${random}`;
  }
}

nombreInput.addEventListener('input', generarUsuario);
apellidosInput.addEventListener('input', generarUsuario);

// Habilitar botón solo si todos los campos requeridos están completos
form.addEventListener('input', () => {
  const camposRequeridos = form.querySelectorAll('[required]');
  const todosLlenos = Array.from(camposRequeridos).every(campo => campo.value.trim() !== '');
  btnRegistrar.disabled = !todosLlenos;
});

// Evento de envío del formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const edad = parseInt(edadInput.value);

  if (isNaN(edad) || edad < 18) {
    alert("Debes tener al menos 18 años para registrarte...");
    return;
  }

  alert("El usuario fue registrado con éxito...");

  form.reset();
  edadInput.value = '';
  usuarioInput.value = '';
  btnRegistrar.disabled = true;

  // Redirigir al login después de 1 segundo
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
});