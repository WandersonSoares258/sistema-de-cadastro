// Dados iniciais (simulando um banco de dados)
let games = JSON.parse(localStorage.getItem('games')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Elementos do DOM
const gamesList = document.getElementById('games-list');
const gameForm = document.getElementById('game-form');
const searchInput = document.getElementById('search-input');
const ratingSlider = document.getElementById('game-rating');
const ratingValue = document.getElementById('rating-value');
const filterGenre = document.getElementById('filter-genre');
const filterPlatform = document.getElementById('filter-platform');
const sortSelect = document.getElementById('sort-by');
const activeFiltersContainer = document.getElementById('active-filters');

// Inicializar filtros e ordenação
function initFilters() {
    // Preencher filtro de gêneros
    const genres = [...new Set(games.map(game => game.genre))];
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        filterGenre.appendChild(option);
    });

    // Preencher filtro de plataformas
    const platforms = [...new Set(games.flatMap(game => game.platforms))];
    platforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = platform;
        option.textContent = platform;
        filterPlatform.appendChild(option);
    });
}

// Atualizar o valor do rating ao mover o slider
ratingSlider.addEventListener('input', () => {
    ratingValue.textContent = ratingSlider.value;
});

// Função para salvar jogo
document.getElementById('save-game').addEventListener('click', () => {
    if (validateForm()) {
        const title = document.getElementById('game-title').value;
        const developer = document.getElementById('game-developer').value;
        const genre = document.getElementById('game-genre').value;
        const releaseYear = document.getElementById('game-release').value;
        const rating = document.getElementById('game-rating').value;
        const description = document.getElementById('game-description').value;
        const imageUrl = document.getElementById('game-image').value;
        const id = document.getElementById('game-id').value;

        // Obter plataformas selecionadas
        const platforms = [];
        document.querySelectorAll('.platform:checked').forEach(checkbox => {
            platforms.push(checkbox.value);
        });

        const game = {
            title,
            developer,
            genre,
            releaseYear: parseInt(releaseYear),
            platforms,
            rating: parseFloat(rating),
            description,
            imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Imagem+Indisponível',
            id: id || Date.now().toString(),
            createdAt: id ? games.find(g => g.id === id).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (id) {
            // Editar jogo existente
            const index = games.findIndex(g => g.id === id);
            if (index !== -1) {
                games[index] = game;
                showToast('Jogo atualizado com sucesso!');
            }
        } else {
            // Adicionar novo jogo
            games.push(game);
            showToast('Jogo adicionado com sucesso!');
        }

        // Salvar no localStorage
        localStorage.setItem('games', JSON.stringify(games));

        // Fechar o modal e atualizar a lista
        bootstrap.Modal.getInstance(document.getElementById('gameModal')).hide();
        renderGames();
        updateStats();
        initFilters();
    }
});

// Validação do formulário
function validateForm() {
    const title = document.getElementById('game-title').value;
    const developer = document.getElementById('game-developer').value;
    const genre = document.getElementById('game-genre').value;
    const releaseYear = document.getElementById('game-release').value;
    const platforms = document.querySelectorAll('.platform:checked');

    if (!title) {
        showToast('Por favor, informe o título do jogo', 'error');
        return false;
    }

    if (!developer) {
        showToast('Por favor, informe a desenvolvedora', 'error');
        return false;
    }

    if (!genre) {
        showToast('Por favor, selecione um gênero', 'error');
        return false;
    }

    if (!releaseYear || releaseYear < 1950 || releaseYear > 2030) {
        showToast('Por favor, informe um ano de lançamento válido', 'error');
        return false;
    }

    if (platforms.length === 0) {
        showToast('Por favor, selecione pelo menos uma plataforma', 'error');
        return false;
    }

    return true;
}

// Função para renderizar a lista de jogos
function renderGames(filteredGames = null) {
    const gamesToRender = filteredGames || games;
    gamesList.innerHTML = '';

    if (gamesToRender.length === 0) {
        gamesList.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-emoji-frown" style="font-size: 3rem;"></i>
                <h4 class="mt-3">Nenhum jogo encontrado</h4>
                <p>Que tal adicionar um novo jogo à sua coleção?</p>
            </div>
        `;
        return;
    }

    gamesToRender.forEach(game => {
        const platformsHTML = game.platforms.map(platform =>
            `<span class="game-platform">${platform}</span>`
        ).join('');

        const isFavorite = favorites.includes(game.id);

        const gameCard = document.createElement('div');
        gameCard.className = 'col-md-4 mb-4 fade-in';
        gameCard.innerHTML = `
            <div class="card game-card">
                <img src="${game.imageUrl}" class="card-img-top" alt="${game.title}">
                <div class="game-rating">${game.rating}/10</div>
                <div class="card-body">
                    <h5 class="card-title">${game.title}</h5>
                    <p class="card-text">${game.developer} • ${game.releaseYear} • ${game.genre}</p>
                    <div class="mb-2">${platformsHTML}</div>
                    <p class="card-text">${game.description || 'Sem descrição.'}</p>
                    <div class="d-flex justify-content-between">
                        <div>
                            <button class="btn btn-sm btn-info view-game" data-id="${game.id}">
                                <i class="bi bi-eye"></i> Ver
                            </button>
                            <button class="btn btn-sm btn-warning edit-game" data-id="${game.id}">
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                        </div>
                        <div>
                            <button class="btn btn-favorite ${isFavorite ? 'active' : ''}" data-id="${game.id}">
                                <i class="bi ${isFavorite ? 'bi-star-fill' : 'bi-star'}"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-game" data-id="${game.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        gamesList.appendChild(gameCard);
    });

    // Adicionar event listeners para os botões
    addGameEventListeners();
}

// Adicionar event listeners para os botões dos jogos
function addGameEventListeners() {
    document.querySelectorAll('.view-game').forEach(button => {
        button.addEventListener('click', (e) => {
            const gameId = e.target.closest('.view-game').dataset.id;
            viewGameDetails(gameId);
        });
    });

    document.querySelectorAll('.edit-game').forEach(button => {
        button.addEventListener('click', (e) => {
            const gameId = e.target.closest('.edit-game').dataset.id;
            editGame(gameId);
        });
    });

    document.querySelectorAll('.delete-game').forEach(button => {
        button.addEventListener('click', (e) => {
            const gameId = e.target.closest('.delete-game').dataset.id;
            deleteGame(gameId);
        });
    });

    document.querySelectorAll('.btn-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            const gameId = e.target.closest('.btn-favorite').dataset.id;
            toggleFavorite(gameId);
        });
    });
}

// Função para visualizar detalhes do jogo
function viewGameDetails(id) {
    const game = games.find(g => g.id === id);
    if (game) {
        const platformsHTML = game.platforms.map(platform =>
            `<span class="game-platform">${platform}</span>`
        ).join('');

        document.getElementById('detail-title').textContent = game.title;
        document.getElementById('detail-content').innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${game.imageUrl}" class="game-detail-img" alt="${game.title}">
                    <div class="game-rating">${game.rating}/10</div>
                </div>
                <div class="col-md-8">
                    <div class="game-detail-info">
                        <span class="game-detail-label">Desenvolvedora:</span> ${game.developer}
                    </div>
                    <div class="game-detail-info">
                        <span class="game-detail-label">Gênero:</span> ${game.genre}
                    </div>
                    <div class="game-detail-info">
                        <span class="game-detail-label">Ano de Lançamento:</span> ${game.releaseYear}
                    </div>
                    <div class="game-detail-info">
                        <span class="game-detail-label">Plataformas:</span> ${platformsHTML}
                    </div>
                    <div class="game-detail-info">
                        <span class="game-detail-label">Descrição:</span> ${game.description || 'Sem descrição.'}
                    </div>
                    <div class="game-detail-info">
                        <span class="game-detail-label">Data de Cadastro:</span> ${new Date(game.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div class="game-detail-info">
                        <span class="game-detail-label">Última Atualização:</span> ${new Date(game.updatedAt).toLocaleDateString('pt-BR')}
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('gameDetailModal'));
        modal.show();
    }
}

// Função para editar um jogo
function editGame(id) {
    const game = games.find(g => g.id === id);
    if (game) {
        document.getElementById('modal-title').textContent = 'Editar Jogo';
        document.getElementById('game-id').value = game.id;
        document.getElementById('game-title').value = game.title;
        document.getElementById('game-developer').value = game.developer;
        document.getElementById('game-genre').value = game.genre;
        document.getElementById('game-release').value = game.releaseYear;
        document.getElementById('game-rating').value = game.rating;
        document.getElementById('rating-value').textContent = game.rating;
        document.getElementById('game-description').value = game.description || '';
        document.getElementById('game-image').value = game.imageUrl;

        // Limpar seleções anteriores de plataformas
        document.querySelectorAll('.platform').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Marcar as plataformas do jogo
        game.platforms.forEach(platform => {
            const checkbox = document.querySelector(`.platform[value="${platform}"]`);
            if (checkbox) checkbox.checked = true;
        });

        // Abrir o modal
        const modal = new bootstrap.Modal(document.getElementById('gameModal'));
        modal.show();
    }
}

// Função para excluir um jogo
function deleteGame(id) {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
        games = games.filter(game => game.id !== id);

        // Remover dos favoritos também
        favorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('favorites', JSON.stringify(favorites));

        localStorage.setItem('games', JSON.stringify(games));
        renderGames();
        updateStats();
        initFilters();
        showToast('Jogo excluído com sucesso!');
    }
}

// Função para favoritar/desfavoritar um jogo
function toggleFavorite(id) {
    const index = favorites.indexOf(id);

    if (index === -1) {
        // Adicionar aos favoritos
        favorites.push(id);
        showToast('Jogo adicionado aos favoritos!');
    } else {
        // Remover dos favoritos
        favorites.splice(index, 1);
        showToast('Jogo removido dos favoritos!');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderGames();
}

// Função para atualizar as estatísticas
function updateStats() {
    document.getElementById('total-games').textContent = games.length;
    document.getElementById('total-ps').textContent = games.filter(game => game.platforms.includes('PlayStation')).length;
    document.getElementById('total-xbox').textContent = games.filter(game => game.platforms.includes('Xbox')).length;
    document.getElementById('total-pc').textContent = games.filter(game => game.platforms.includes('PC')).length;
    document.getElementById('total-favorites').textContent = favorites.length;
}

// Função para pesquisar jogos
searchInput.addEventListener('input', () => {
    applyFilters();
});

// Função para aplicar filtros
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const genreFilter = filterGenre.value;
    const platformFilter = filterPlatform.value;
    const sortBy = sortSelect.value;

    let filteredGames = games;

    // Aplicar filtro de pesquisa
    if (searchTerm) {
        filteredGames = filteredGames.filter(game =>
            game.title.toLowerCase().includes(searchTerm) ||
            game.developer.toLowerCase().includes(searchTerm) ||
            game.genre.toLowerCase().includes(searchTerm) ||
            game.platforms.some(platform => platform.toLowerCase().includes(searchTerm))
        );
    }

    // Aplicar filtro de gênero
    if (genreFilter) {
        filteredGames = filteredGames.filter(game => game.genre === genreFilter);
    }

    // Aplicar filtro de plataforma
    if (platformFilter) {
        filteredGames = filteredGames.filter(game => game.platforms.includes(platformFilter));
    }

    // Aplicar ordenação
    switch (sortBy) {
        case 'title-asc':
            filteredGames.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            filteredGames.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'rating-asc':
            filteredGames.sort((a, b) => a.rating - b.rating);
            break;
        case 'rating-desc':
            filteredGames.sort((a, b) => b.rating - a.rating);
            break;
        case 'year-asc':
            filteredGames.sort((a, b) => a.releaseYear - b.releaseYear);
            break;
        case 'year-desc':
            filteredGames.sort((a, b) => b.releaseYear - a.releaseYear);
            break;
        case 'newest':
            filteredGames.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            filteredGames.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
    }

    renderGames(filteredGames);
    updateActiveFilters();
}

// Atualizar filtros ativos
function updateActiveFilters() {
    activeFiltersContainer.innerHTML = '';

    const searchTerm = searchInput.value;
    const genreFilter = filterGenre.value;
    const platformFilter = filterPlatform.value;

    if (searchTerm) {
        addActiveFilter('Pesquisa', searchTerm, 'search');
    }

    if (genreFilter) {
        addActiveFilter('Gênero', genreFilter, 'genre');
    }

    if (platformFilter) {
        addActiveFilter('Plataforma', platformFilter, 'platform');
    }
}

// Adicionar filtro ativo
function addActiveFilter(label, value, type) {
    const filterElement = document.createElement('span');
    filterElement.className = 'active-filter';
    filterElement.innerHTML = `
        ${label}: ${value}
        <span class="close" data-type="${type}">&times;</span>
    `;
    activeFiltersContainer.appendChild(filterElement);

    // Adicionar evento para remover o filtro
    filterElement.querySelector('.close').addEventListener('click', (e) => {
        e.stopPropagation();
        removeFilter(type);
    });
}

// Remover filtro
function removeFilter(type) {
    switch (type) {
        case 'search':
            searchInput.value = '';
            break;
        case 'genre':
            filterGenre.value = '';
            break;
        case 'platform':
            filterPlatform.value = '';
            break;
    }
    applyFilters();
}

// Limpar formulário quando o modal for fechado
document.getElementById('gameModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('modal-title').textContent = 'Adicionar Novo Jogo';
    gameForm.reset();
    document.getElementById('game-id').value = '';
    document.getElementById('rating-value').textContent = '5';
});

// Mostrar notificação toast
function showToast(message, type = 'success') {
    const toastElement = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toast-message');

    // Alterar cor conforme o tipo
    if (type === 'error') {
        toastElement.querySelector('.toast-header').style.backgroundColor = '#f8d7da';
        toastElement.querySelector('.toast-header').style.color = '#721c24';
    } else {
        toastElement.querySelector('.toast-header').style.backgroundColor = '';
        toastElement.querySelector('.toast-header').style.color = '';
    }

    toastMessage.textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Inicializar a aplicação
function init() {
    renderGames();
    updateStats();
    initFilters();

    // Adicionar alguns jogos de exemplo se estiver vazio
    if (games.length === 0) {
        games = [
            {
                id: '1',
                title: 'The Witcher 3: Wild Hunt',
                developer: 'CD Projekt Red',
                genre: 'RPG',
                releaseYear: 2015,
                platforms: ['PC', 'PlayStation', 'Xbox'],
                rating: 9.8,
                description: 'Um RPG de mundo aberto ambientado em um universo de fantasia sombria.',
                imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MUIuMmHlktOHar3lVl6rY.png',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Red Dead Redemption 2',
                developer: 'Rockstar Games',
                genre: 'Ação',
                releaseYear: 2018,
                platforms: ['PC', 'PlayStation', 'Xbox'],
                rating: 9.7,
                description: 'Uma história épica sobre a vida no coração da América.',
                imageUrl: 'https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5MtwQgOVF9vJqlfui6SDB5Jl4oBSq.png',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'The Last of Us Part II',
                developer: 'Naughty Dog',
                genre: 'Ação',
                releaseYear: 2020,
                platforms: ['PlayStation'],
                rating: 9.5,
                description: 'Uma jornada emocional através de um mundo pós-apocalíptico.',
                imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202010/2618/8a8M6m6M6cGx4M6cGx4M6cGx4.png',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('games', JSON.stringify(games));
        renderGames();
        updateStats();
        initFilters();
    }

    // Adicionar event listeners para filtros e ordenação
    filterGenre.addEventListener('change', applyFilters);
    filterPlatform.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
}

// Iniciar a aplicação quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', init);