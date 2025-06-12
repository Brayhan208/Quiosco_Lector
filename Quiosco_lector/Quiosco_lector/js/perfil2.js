document.addEventListener('DOMContentLoaded', function () {
  // Cargar calificaciones guardadas
  const ratings = JSON.parse(localStorage.getItem('planRatings')) || {
    hamsters: 0,
    rata: 0,
    zarigueya: 0
  };

  // Inicializar estrellas
  const allStars = document.querySelectorAll('.star');

  // Aplicar calificaciones guardadas
  Object.keys(ratings).forEach(plan => {
    const stars = document.querySelectorAll(`.rating-stars[data-plan="${plan}"] .star`);
    const valueDisplay = document.querySelector(`.rating-stars[data-plan="${plan}"] + .rating-value`);

    if (ratings[plan] > 0) {
      highlightStars(stars, ratings[plan]);
      valueDisplay.textContent = ratings[plan];
    }
  });

  // Manejar eventos de clic
  allStars.forEach(star => {
    star.addEventListener('click', function () {
      const plan = this.closest('.rating-stars').dataset.plan;
      const value = parseInt(this.dataset.value);
      const stars = document.querySelectorAll(`.rating-stars[data-plan="${plan}"] .star`);
      const valueDisplay = document.querySelector(`.rating-stars[data-plan="${plan}"] + .rating-value`);

      // Guardar la calificación
      ratings[plan] = value;
      localStorage.setItem('planRatings', JSON.stringify(ratings));

      // Actualizar visualización
      highlightStars(stars, value);
      valueDisplay.textContent = value;
    });
  });

  // Función para resaltar estrellas
  function highlightStars(stars, upToValue) {
    stars.forEach(star => {
      star.classList.remove('active');
      if (parseInt(star.dataset.value) <= upToValue) {
        star.classList.add('active');
      }
    });
  }

  // Efecto hover para las estrellas
  allStars.forEach(star => {
    star.addEventListener('mouseover', function () {
      const value = parseInt(this.dataset.value);
      const stars = this.closest('.rating-stars').querySelectorAll('.star');

      stars.forEach(s => {
        s.classList.remove('hover');
        if (parseInt(s.dataset.value) <= value) {
          s.classList.add('hover');
        }
      });
    });

    star.addEventListener('mouseout', function () {
      const stars = this.closest('.rating-stars').querySelectorAll('.star');
      stars.forEach(s => s.classList.remove('hover'));
    });
  });
});
// Funcionalidad para cambiar el tema
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    if (this.dataset.theme === 'dark') {
      document.body.classList.add('dark-theme');
      // Aquí podrías guardar la preferencia en localStorage
    } else {
      document.body.classList.remove('dark-theme');
      // Aquí podrías guardar la preferencia en localStorage
    }
  });
});

// Funcionalidad para cambiar el tamaño de fuente
document.querySelectorAll('.font-size-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    // Aplicar el tamaño de fuente seleccionado al cuerpo del documento
    document.body.classList.remove('small-text', 'medium-text', 'large-text');
    document.body.classList.add(`${this.dataset.size}-text`);

    // Aquí podrías guardar la preferencia en localStorage
  });
});