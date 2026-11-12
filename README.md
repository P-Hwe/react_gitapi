# Meus Repositórios

Aplicação React para pesquisar repositórios públicos do GitHub, salvar uma lista local de favoritos e consultar as issues de cada repositório.

## Funcionalidades

- Pesquisa de repositórios pela API do GitHub.
- Persistência da lista no `localStorage` do navegador.
- Remoção de repositórios salvos.
- Visualização de detalhes e issues de um repositório.
- Filtros de issues por status: todas, abertas ou fechadas.
- Paginação das issues.

## Tecnologias

- React
- React Router
- Axios
- Styled Components
- React Icons
- Create React App

## Requisitos

- Node.js e npm instalados.
- Acesso à internet para consultar a API do GitHub.

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

3. Acesse [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia a aplicação em modo de desenvolvimento. |
| `npm test` | Executa os testes no modo interativo. |
| `npm run build` | Gera a versão otimizada para produção na pasta `build`. |
| `npm run eject` | Expõe as configurações internas do Create React App. É irreversível. |

## Estrutura principal

```text
src/
├── pages/
│   ├── Main/          # Pesquisa e lista de repositórios
│   └── Repositorio/   # Detalhes e issues
├── services/api.js    # Cliente Axios da API do GitHub
├── routes.js          # Rotas da aplicação
└── styles/            # Estilos globais
```

## Rotas

- `/` — tela inicial com a lista de repositórios salvos.
- `/repositorio/:repositorio` — detalhes e issues do repositório selecionado.

O nome informado deve seguir o formato `usuario/repositorio`, como `facebook/react`.

## Persistência e API

Os repositórios salvos são serializados em JSON no `localStorage`, usando a chave `repos`. A aplicação utiliza o cliente configurado em `src/services/api.js` para acessar os endpoints da [API do GitHub](https://docs.github.com/en/rest).

Em ambientes reais, tokens de autenticação não devem ser expostos diretamente no código do frontend. Prefira uma variável de ambiente ou um backend intermediário.
