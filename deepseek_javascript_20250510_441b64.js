document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карты
    const map = L.map('map').setView([56.8527, 53.2115], 13);
    
    // Добавление слоя OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Создание группы маркеров
    const markers = L.layerGroup().addTo(map);

    // Элементы DOM
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const monumentsContainer = document.getElementById('monuments-container');

    // Функция для отображения памятников
    function displayMonuments(filteredMonuments) {
        // Очистка предыдущих маркеров
        markers.clearLayers();
        monumentsContainer.innerHTML = '';

        filteredMonuments.forEach(monument => {
            // Добавление маркера на карту
            const marker = L.marker([monument.lat, monument.lng])
                .addTo(markers)
                .bindPopup(`
                    <b>${monument.name}</b><br>
                    <em>${monument.categoryLabel}</em><br>
                    ${monument.description}
                `);

            // Создание карточки памятника
            const card = document.createElement('div');
            card.className = 'monument-card';
            card.innerHTML = `
                <h3>${monument.name}</h3>
                <p>${monument.description}</p>
                <span class="monument-category">${monument.categoryLabel}</span>
            `;
            
            // Обработчик клика по карточке
            card.addEventListener('click', () => {
                map.setView([monument.lat, monument.lng], 16);
                marker.openPopup();
            });

            monumentsContainer.appendChild(card);
        });
    }

    // Функция фильтрации
    function filterMonuments() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        const filtered = monuments.filter(monument => {
            const matchesSearch = monument.name.toLowerCase().includes(searchTerm) || 
                               monument.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || monument.category === category;
            return matchesSearch && matchesCategory;
        });

        displayMonuments(filtered);
    }

    // Обработчики событий
    searchInput.addEventListener('input', filterMonuments);
    categoryFilter.addEventListener('change', filterMonuments);

    // Первоначальная загрузка
    filterMonuments();
});