# Sistema de Gestão para Escritório de Investimentos

Este projeto é uma aplicação web containerizada desenvolvida para atender às necessidades de um escritório de investimentos. O sistema permite:

- **Cadastro e gerenciamento de clientes**
- **Registro de alocação em ativos financeiros (cliente × ativo)**
- **Registro de entradas e saídas de dinheiro na conta dos clientes**

## Contexto

O objetivo é fornecer uma solução completa para escritórios de investimentos, facilitando o controle de clientes, ativos e movimentações financeiras, tudo em um ambiente seguro e moderno.

## Tecnologias Utilizadas

- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL, Redis
- **Frontend:** Next.js (React)
- **Containerização:** Docker, Docker Compose

## Estrutura do Projeto

```
/
├── backend/   # API FastAPI, modelos, serviços e banco de dados
├── frontend/  # Aplicação Next.js (interface web)
├── docker-compose.yml
```

## Como Executar

1. **Pré-requisitos:** Docker e Docker Compose instalados.
2. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```
3. **Suba os containers:**
   ```sh
   docker-compose up --build
   ```
4. **Acesse:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger)

## Funcionalidades

- CRUD completo de clientes
- CRUD de ativos financeiros
- Associação de ativos a clientes (alocações)
- Registro de movimentações financeiras (entradas e saídas)
- Autenticação JWT

## Observações

- O projeto segue arquitetura em camadas para facilitar manutenção e escalabilidade.
- O backend utiliza Alembic para migrações de banco de dados.
- Variáveis sensíveis devem ser configuradas via variáveis de ambiente.

---

Desenvolvido para o desafio Anka.
