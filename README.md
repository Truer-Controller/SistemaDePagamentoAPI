<h1>SistemaDePagamentoAPI</h1>

<h2>Sistema para teste realizando com react, EF 5.0.8 e SQL Server</h2>

> Status: Finalizado ✅

<h3>Rotas das API's</h3>

<h4>Clientes:</h4>

+ GET [api/Cliente](https://localhost/api/Clientes)
+ POST [api/Clientes](https://localhost/api/Clientes)

<h4>Pagamentos:</h4>

+ GET [api/Pagamentos/clienteId={idCliente}](https://localhost/api/Pagamentos/clienteId=1)  --Exemplo com o cliente de ID 1
+ POST [api/Pagamentos](https://localhost/api/Pagamentos)
+ PUT [api/Pagamentos/{id}/status](https://localhost/api/Pagamentos/12/status) --Exemplo com o pedido 12

![image](https://github.com/user-attachments/assets/5bba4091-6f8f-42b4-8b8c-11aeff9d9f0f)

## Explicação do Backend

Para esse projeto utilizei o .NET na sua versão 5.0.4 e o Entity Freamework na sua versão 5.0.8

![image](https://github.com/user-attachments/assets/116feef5-2346-461f-9cd0-aa745a6d21b0)

![image](https://github.com/user-attachments/assets/30881ec2-9f4f-49ca-962c-76ea92e37638)

Link para instalação da versão mais antiga do .NET -> https://dotnet.microsoft.com/pt-br/download/dotnet/5.0

Para instalar no projeto se necessário o pacote nuget do EF 5.0.8 basta rodar os dois comandos abaixo:

+ Install-Package Microsoft.EntityFrameworkCore.SqlServer -Version 5.0.8

+ Install-Package Microsoft.EntityFrameworkCore.Tools -Version 5.0.8

A escolha dessa versão foi sua base solida de programação, é uma versão que conheço mais a qual não estava dando problemas de compatibilidade e versionamento, também é um modelo mais intuitivo para se programar na minha opinião.

### Estrutura das pastas

Escolhi montar esse modelo devido a consistencia e entrega dos dados, a facil manutenção que esse projeto propõe e também é facil de escalar informações caso venha a precisar. Minha Dto dita as informações que gostaria de inserir pela API já meus serviços fazem toda logica tirando a responsabilidade e a sujeira de codigos da Model deixando toda complexidade para os serviços, enquanto meu controller cuida apenas de entregar as informações e retas, com pouca complexidade onde a maior parte das regras de negocio se encontram no serviços.

![image](https://github.com/user-attachments/assets/83310955-fd78-4684-9d13-5ff95ca71115)

### Context

Meu context realiza a ponte de conexão com o SQL Server utilizando uma classe nativa do EF que seria a classe DbContext, depois de declarar meu construtor ele mapeia meus modelos e cria as tabelas, deixei também dois valores padrões de criação caso não tenha nada no banco.

![image](https://github.com/user-attachments/assets/5eacdcce-7639-4e5c-aab5-491395bbc19d)

Caso necessário para carregar as informações no banco rodar o comando update-database no terminal do Nuget

### Serviços

Na camada de serviços eu coloquei toda logica e regra de negocio solicitada como podemos ver trabalho com 3 Status escolhidos e isso vamos ver no front os pedidos são criados com o status "A" de aguardando pagamento e são alterados apenas para P ou C, após serem alterados para "P"(pagos) ou "C"(cancelados) não é possível realizar mais a alteração.

![image](https://github.com/user-attachments/assets/18e3ddbb-d8b4-44a0-8ffb-bc63b1cbde5a)

## Explicação do front

Foi utilizado o React Vite com Axios, também utilizei o tailwind, lucide-react e o import do pacote de avisos Toast, para baixar os pacotes necessários deve rodar o comando "npm install".

O axios foi utilizado para o consumo da API, já o tailwind é uma forma pratica e moderna de escrever o CSS da pagina, o lucide-react é uma biblioteca de icones para ajudar na estilização agradavel da pagina e o pacote toast é uma biblioteca de avisos.

A estrutura do projeto front poderia ser melhor organizada em pastas mas preferi realizar com modais e os arquivos de chamadas no App.jsx para ocupar menos tempo aumentando a complexidade do projeto. 
O axios realiza as requisições que preciso utilizando minha URL base e com isso montando consumindo minha API a partir da concatenação da URL base declarado como uma const

Get clientes:

![image](https://github.com/user-attachments/assets/68727de9-567c-438b-b4ad-a104851c1ed9)

Get pagamento do cliente:

![image](https://github.com/user-attachments/assets/ebb794d5-84a7-4a32-83c0-cd0ce8487677)


Post cliente:

![image](https://github.com/user-attachments/assets/4361d76c-2a86-4a88-b95e-8f771b066a6d)

Post pagamento:

![image](https://github.com/user-attachments/assets/1f835c3a-7d3e-4bb1-b873-b0f3a632c91d)

