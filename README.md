# Sistema de Cadastro de Jogos

Um sistema completo para gerenciar sua coleção de jogos, com funcionalidades de cadastro, edição, exclusão e pesquisa.

## Funcionalidades

- Cadastro de jogos com título, desenvolvedora, gênero, ano de lançamento, plataformas, classificação, descrição e imagem
- Visualização de jogos em cards com informações completas
- Edição e exclusão de jogos
- Pesquisa em tempo real
- Estatísticas da coleção
- Armazenamento local (localStorage)

## Como usar

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador web
3. Use o botão "Adicionar Novo Jogo" para cadastrar jogos
4. Pesquise jogos usando a barra de pesquisa
5. Edite ou exclua jogos usando os botões em cada card

## Estrutura do projeto

sistema-de-cadastro/
│
├── index.html # Página principal
├── css/
│ └── style.css # Estilos customizados
├── js/
│ └── script.js # Lógica da aplicação
└── README.md # Este arquivo

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Bootstrap Icons

## Personalização

Você pode personalizar as cores do sistema editando as variáveis CSS no arquivo `css/style.css`:

```css
:root {
    --primary-color: #6c5ce7;
    --secondary-color: #a29bfe;
    --dark-color: #2d3436;
    /* ... outras cores */
}

## Como usar

1. Crie uma pasta para o projeto
2. Dentro dela, crie as subpastas `css` e `js`
3. Salve cada arquivo em sua respectiva pasta
4. Abra o `index.html` em um navegador web

Esta estrutura organizada facilitará a manutenção e expansão do sistema no futuro.


## Novas Funcionalidades

### Filtros Avançados
- Filtro por gênero
- Filtro por plataforma
- Filtro por texto (pesquisa)
- Visualização dos filtros ativos

### Sistema de Favoritos
- Marcar/desmarcar jogos como favoritos
- Visualizar lista de favoritos
- Os favoritos são salvos localmente

### Ordenação
- Ordenar por título (A-Z, Z-A)
- Ordenar por avaliação (maior-menor, menor-maior)
- Ordenar por ano de lançamento
- Ordenar por data de cadastro

### Melhorias de Interface
- Modal de detalhes do jogo
- Sistema de notificações (toast)
- Animações de transição
- Melhorias de responsividade

### Validação de Formulários
- Validação de campos obrigatórios
- Mensagens de erro específicas
- Validação de URL de imagem

## Como usar as novas funcionalidades

### Favoritos
Clique no ícone de estrela em qualquer jogo para adicioná-lo ou removê-lo dos favoritos.

### Filtros
Use os menus suspensos para filtrar por gênero ou plataforma. Use a barra de pesquisa para buscar por texto.

### Ordenação
Use o menu "Ordenar por" para escolher como os jogos devem ser ordenados.

### Visualizar Detalhes
Clique no botão "Ver" em qualquer jogo para visualizar informações detalhadas.

## Próximas Melhorias Possíveis

- [ ] Sistema de usuários e autenticação
- [ ] Upload de imagens (em vez de URL)
- [ ] Exportação/importação de dados
- [ ] Compartilhamento de lista de jogos
- [ ] Sistema de empréstimos de jogos
- [ ] Integração com APIs de jogos (IGDB, RAWG)