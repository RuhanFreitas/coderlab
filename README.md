## CoderLab

### PRÉ-REQUISITOS
- Docker

Nota: Não é necessário ter nada instalado localmente. O Docker gerencia essas dependências.

<hr/>

### CONFIGURAÇÃO

1. Clonar o repositório:

```
git clone https://github.com/RuhanFreitas/coderlab
cd coderlab
```

2. Configurar as variáveis de ambiente
- Na raiz do projeto, crie um arquivo .env e cole o código seguinte:
  
```
POSTGRES_USER=project_user
POSTGRES_PASSWORD=safe_password
POSTGRES_DB=coderlab

BACKEND_PORT=3000
FRONTEND_PORT=5173
DB_PORT=5432
```

- Na raiz do backend (diretório "api"), crie um arquivo .env e cole o código seguinte:

```
PORT=3000

DATABASE_URL=postgresql://project_user:safe_password@db:5432/coderlab?schema=public
```
  
- Na raiz do backend (api), crie um arquivo .env e copie o .env.example

3. Subir a aplicação

- No diretório raiz, digite:
```
docker compose up --build
```

4. Aguarde alguns minutos até a aplicação estar no ar.

<hr/>

### ENDEREÇOS

- BACKEND:
http://localhost:3000/
- SWAGGER:
http://localhost:3000/api
- FRONTEND:
http://localhost:5173/



