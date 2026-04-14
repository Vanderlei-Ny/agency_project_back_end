# agency_project_back_end

API back-end com Fastify e TypeScript.

🏗️ Estratégia de Arquitetura: Clean & Semantic Fastify
A estrutura deste projeto foi desenhada seguindo os princípios de Separação de Preocupações (SoC) e Clean Code, garantindo que o código seja testável, escalável e fácil de manter.

🧩 Divisão de Responsabilidades
src/core/use-cases (A "Cozinha"): Aqui reside a inteligência do software. Cada arquivo representa uma única ação do sistema (ex: authenticate-user.ts, create-order.ts).

Regra: Não importa se os dados vêm de uma API HTTP ou de um console, a lógica aqui é pura e independente de frameworks.

src/http/controllers (O "Garçom"): Responsável apenas por receber a requisição, validar a entrada básica e chamar o caso de uso correspondente.

Regra: O controller não toma decisões de negócio; ele apenas orquestra o fluxo de dados.

src/http/routes (O "Menu"): Onde os caminhos da API são expostos. Usamos o sistema de plugins do Fastify para modularizar rotas por domínio (ex: /users, /products).

src/database (O "Arquivo"): Contém os repositórios e a configuração de conexão. Se amanhã trocarmos o MongoDB pelo PostgreSQL, apenas esta camada sofre alterações significativas.

🖋️ Convenções de Nomenclatura
Para manter a clareza, adotamos nomes que expressam intenção:

Funções e Variáveis: Sempre verbos e substantivos claros (findUserByEmail, não getUser).

DTOs (Data Transfer Objects): Interfaces que descrevem exatamente o que transita entre as camadas (ex: RegisterUserRequest).

Sufixos Semânticos: Arquivos terminam com sua função (.controller.ts, .service.ts, .routes.ts).

////

Lógica interna da aplicação

1° Cliente manda para agência a ideia e o q quer
2° Agência recebe e manda orçamento
3° Cliente aceita o orçamento ou não
4° Caso aceite, seleciona o 'método de pagamento' - adicionamos algo ficticio  
5° Agencia recebe o pedido
6° Depois um funcionário pega o pedido e faz e manda para aprovação, se for aprovado finalizado se não for volta com alguma mensagem do cliente explicando o pq n gostou
