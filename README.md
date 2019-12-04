Desafios Bootcamp da Rocketseat
Desafio do segundo módulo do Bootcamp GoStack 🚀👨🏻‍🚀

Desenvolvimento de uma Api para uma academia fictícia, a "Gympoint".

Neste projeto foi utilizado:
*NodeJs
*ExpressJs
*Sucrase
*Nodemailer
*Sequelize
*Docker
*Redis
*PostgreSQL
*express-handlebars
*bee-queue

Funcionalidades esperadas:

1. Autenticação do usuário:
  1.1 => Permita que um usuário se autentique em sua aplicação utilizando e-mail e uma senha.
  1.2=> A autenticação deve ser feita utilizando JWT.
  1.3 => Realize a validação dos dados de entrada.
2. Cadastro de alunos:
  2.1 => Permita que alunos sejam mantidos (cadastrados/atualizados) na aplicação utilizando nome, email, idade, peso e altura.
  2.2 => O cadastro de alunos só pode ser feito por administradores autenticados na aplicação.
3. Gestão dos planos;
  3.1 => Permita que o usuário possa cadastrar planos para matrícula de alunos.
4. Gestã das matrículas;
  4.1 => Nessa funcionalidade criaremos um cadastro de matrículas por aluno.
5. Checkins dos alunos;
  5.1 => Quando o aluno chega na academia o mesmo realiza um check-in apenas informando seu ID de cadastro (ID do banco de dados).
  5.2 => O usuário só pode fazer 5 checkins dentro de um período de 7 dias corridos.
6. Pedidos de auxílio;
  6.1 => O aluno pode criar pedidos de auxílio para a academia em relação a algum exercício, alimentação ou instrução qualquer.
  6.2 => Quando um pedido de auxílio for respondido, o aluno deve receber um e-mail da plataforma com a pergunta e resposta da academia.
