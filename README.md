## Executando o Projeto Localmente

Para executar o projeto localmente em sua máquina, siga as etapas abaixo:

### Pré-requisitos

- Conta na Stripe com chaves de API;
- SMTP para envio de e-mails;
- Ter o Docker em sua máquina antes de prosseguir;
- Certifique-se de ter as portas 3000 livre em sua máquina antes de prosseguir.

### Passos

1. Clone o repositório do projeto:

   ```bash
   git clone <repository-url>
   ```

2. Navegue até o diretório raiz do projeto;

3. Crie um arquivo `.env` com base no arquivo `.env.example`;

4. Inicie o projeto usando o Docker Compose:

   ```bash
   docker compose up
   ```

   Isso iniciará os contêineres necessários para executar o projeto;

5. Após a inicialização, você poderá acessar a documentação da API em seu navegador através do seguinte endereço:

   ```bash
   http://localhost:3000/api
   ```
