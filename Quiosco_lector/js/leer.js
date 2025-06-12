    document.addEventListener('DOMContentLoaded', function() {
      const dropdown = document.getElementById('main-dropdown');
      const menuToggle = document.getElementById('menu-toggle');
      const dropdownButton = document.querySelector('.dropdown-menu-button');
      const loginButton = document.getElementById('btn-login');
      
      // Función para cerrar el menú
      function closeMenu() {
        dropdown.classList.remove('show', 'mobile-active');
      }
      
      // Toggle mobile menu
      menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('mobile-active');
      });
      
      // Toggle dropdown en desktop
      dropdownButton.addEventListener('click', function(e) {
        if (window.innerWidth > 768) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle('show');
        }
      });
      
      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', function() {
        closeMenu();
      });
      
      // Evitar que el menú se cierre al hacer clic dentro
      const menuContent = document.querySelector('.dropdown-menu-content');
      if (menuContent) {
        menuContent.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
      
      // Funcionalidad para submenús en móvil
      const submenuItems = document.querySelectorAll('.dropdown-submenu > a');
      submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
          }
        });
      });
      
      // Función para el botón de login
      loginButton.addEventListener('click', function() {
        if (this.textContent === 'Iniciar Sesión') {
          // Redirigir a login.html cuando es "Iniciar Sesión"
          window.location.href = 'login.html';
        } else {
          // Redirigir a miperfil.html cuando es "Mi Perfil"
          window.location.href = 'perfil.html';
        }
      });
      
      // Verificar estado de sesión al cargar la página
      function checkLoginStatus() {
        // Aquí puedes implementar lógica para verificar si el usuario está logueado
        // Por ejemplo, usando localStorage o una cookie
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
          loginButton.textContent = 'Mi Perfil';
          loginButton.style.backgroundColor = 'var(--color-perfil)';
        } else {
          loginButton.textContent = 'Iniciar Sesión';
          loginButton.style.backgroundColor = 'var(--color-login)';
        }
      }
      
      // Llamar a la función al cargar la página
      checkLoginStatus();
      
      // Cerrar menú al cambiar el tamaño de la ventana
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
          closeMenu();
        }
      });
    });