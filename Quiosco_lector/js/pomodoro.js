document.addEventListener('DOMContentLoaded', function() {
      // Variables del Pomodoro
      let timer;
      let minutes = 25;
      let seconds = 0;
      let isRunning = false;
      let pomodoroCount = 0;
      
      // Variables del Calendario
      let currentDate = new Date();
      let events = JSON.parse(localStorage.getItem('pomodoroEvents')) || [];
      
      // Elementos del DOM
      const minutesDisplay = document.getElementById('minutes');
      const secondsDisplay = document.getElementById('seconds');
      const startBtn = document.getElementById('startBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const resetBtn = document.getElementById('resetBtn');
      const completedPomodoros = document.getElementById('completedPomodoros');
      const modeButtons = document.querySelectorAll('.mode-btn');
      
      // Elementos del Calendario
      const currentMonthDisplay = document.getElementById('currentMonth');
      const calendarGrid = document.getElementById('calendarGrid');
      const prevMonthBtn = document.getElementById('prevMonth');
      const nextMonthBtn = document.getElementById('nextMonth');
      const eventsList = document.getElementById('eventsList');
      const addEventBtn = document.getElementById('addEventBtn');
      const eventModal = document.getElementById('eventModal');
      const closeModal = document.querySelector('.close-modal');
      const eventForm = document.getElementById('eventForm');
      
      // Inicializar
      updateTimerDisplay();
      renderCalendar();
      renderTodayEvents();
      
      // Event Listeners del Pomodoro
      startBtn.addEventListener('click', startTimer);
      pauseBtn.addEventListener('click', pauseTimer);
      resetBtn.addEventListener('click', resetTimer);
      
      modeButtons.forEach(button => {
        button.addEventListener('click', function() {
          modeButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          minutes = parseInt(this.dataset.minutes);
          seconds = 0;
          updateTimerDisplay();
          // Detener el temporizador si está en marcha al cambiar de modo
          if (isRunning) {
            pauseTimer();
          }
        });
      });
      
      // Event Listeners del Calendario
      prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });
      
      nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });
      
      addEventBtn.addEventListener('click', () => {
        eventModal.style.display = 'flex';
        document.getElementById('eventDate').valueAsDate = new Date();
      });
      
      closeModal.addEventListener('click', () => {
        eventModal.style.display = 'none';
      });
      
      eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newEvent = {
          id: Date.now(),
          title: document.getElementById('eventTitle').value,
          date: document.getElementById('eventDate').value,
          time: document.getElementById('eventTime').value,
          description: document.getElementById('eventDescription').value
        };
        
        events.push(newEvent);
        saveEvents();
        renderCalendar();
        renderTodayEvents();
        eventModal.style.display = 'none';
        this.reset();
      });
      
      // Funciones del Pomodoro
      function startTimer() {
        if (!isRunning) {
          isRunning = true;
          startBtn.disabled = true;
          pauseBtn.disabled = false;
          
          timer = setInterval(() => {
            if (seconds === 0) {
              if (minutes === 0) {
                // Tiempo completado
                clearInterval(timer);
                isRunning = false;
                pomodoroCount++;
                completedPomodoros.textContent = pomodoroCount;
                
                // Reproducir sonido de alarma (opcional)
                playAlarmSound();
                
                // Mostrar notificación
                showCompletionNotification();
                
                // Reiniciar al modo Pomodoro (25 min)
                const pomodoroBtn = document.querySelector('.mode-btn[data-minutes="25"]');
                if (pomodoroBtn) {
                  pomodoroBtn.click();
                }
                return;
              }
              minutes--;
              seconds = 59;
            } else {
              seconds--;
            }
            updateTimerDisplay();
          }, 1000);
        }
      }
      
      function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
      }
      
      function resetTimer() {
        pauseTimer();
        const activeMode = document.querySelector('.mode-btn.active');
        if (activeMode) {
          minutes = parseInt(activeMode.dataset.minutes);
        } else {
          // Valor por defecto si no hay modo activo
          minutes = 25;
        }
        seconds = 0;
        updateTimerDisplay();
      }
      
      function updateTimerDisplay() {
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
      }
      
      // Función para reproducir sonido de alarma (opcional)
      function playAlarmSound() {
        const alarmSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        alarmSound.play().catch(e => console.log('Error al reproducir sonido:', e));
      }
      
      // Función para mostrar notificación (opcional)
      function showCompletionNotification() {
        if (Notification.permission === 'granted') {
          new Notification('¡Tiempo completado!', {
            body: 'El temporizador ha finalizado.',
            icon: 'https://cdn-icons-png.flaticon.com/512/2910/2910769.png'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('¡Tiempo completado!', {
                body: 'El temporizador ha finalizado.',
                icon: 'https://cdn-icons-png.flaticon.com/512/2910/2910769.png'
              });
            }
          });
        }
        
        // Alternativa para navegadores que no soportan notificaciones
        alert('¡Tiempo completado!');
      }
      
      // Funciones del Calendario
      function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        currentMonthDisplay.textContent = new Date(year, month).toLocaleDateString('es', {
          month: 'long',
          year: 'numeric'
        }).toUpperCase();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        calendarGrid.innerHTML = '';
        
        // Encabezados de días
        ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(day => {
          const dayHeader = document.createElement('div');
          dayHeader.className = 'calendar-day-header';
          dayHeader.textContent = day;
          calendarGrid.appendChild(dayHeader);
        });
        
        // Días del mes
        for (let i = 0; i < firstDay; i++) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'calendar-day empty';
          calendarGrid.appendChild(emptyDay);
        }
        
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          const dayElement = document.createElement('div');
          dayElement.className = 'calendar-day';
          dayElement.textContent = day;
          
          if (isCurrentMonth && day === today.getDate()) {
            dayElement.classList.add('today');
          }
          
          // Verificar si hay eventos en este día
          const hasEvent = events.some(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day && 
                   eventDate.getMonth() === month && 
                   eventDate.getFullYear() === year;
          });
          
          if (hasEvent) {
            dayElement.classList.add('has-event');
          }
          
          dayElement.addEventListener('click', () => {
            showEventsForDate(date);
          });
          
          calendarGrid.appendChild(dayElement);
        }
      }
      
      function renderTodayEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        showEventsForDate(today);
      }
      
      function showEventsForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        const dayEvents = events.filter(event => event.date === dateStr);
        
        eventsList.innerHTML = `<h3>Eventos para ${date.toLocaleDateString('es')}</h3>`;
        
        if (dayEvents.length === 0) {
          eventsList.innerHTML += '<p>No hay eventos programados para este día.</p>';
          return;
        }
        
        dayEvents.sort((a, b) => a.time.localeCompare(b.time)).forEach(event => {
          const eventElement = document.createElement('div');
          eventElement.className = 'event-item';
          eventElement.innerHTML = `
            <div class="event-time">${event.time}</div>
            <div class="event-title"><strong>${event.title}</strong></div>
            ${event.description ? `<div class="event-desc">${event.description}</div>` : ''}
            <button class="delete-event" data-id="${event.id}">×</button>
          `;
          eventsList.appendChild(eventElement);
        });
        
        // Agregar event listeners para los botones de eliminar
        document.querySelectorAll('.delete-event').forEach(button => {
          button.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.id);
            events = events.filter(event => event.id !== eventId);
            saveEvents();
            showEventsForDate(date);
            renderCalendar();
          });
        });
      }
      
      function saveEvents() {
        localStorage.setItem('pomodoroEvents', JSON.stringify(events));
      }
    });