# Recuperar a senha

**RF(Requisitos funcionais)**

- O usuário deve ser capaz de recuperar sua senha informando o seu enedereço de e-mail cadastrado;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve ser capaz de redefinir sua senha.

**RNF(Requisitos não funcionais)**

- Utilizar mailtrap para testar o envio de e-mails em desenvolvimento;
- Utilizar o Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN(Regras de negócio)**

- O link enviado por e-mail para redefinição de senha, deve expirar em 2h;
- O usuário precisa informar uma senha válida de acordo com as regras de validação;

# Atualização do perfil

**RF(Requisitos funcionais)**

- O usuário deve ser capaz de atualizar o seu nome, email e senha;

**RNF(Requisitos não funcionais)**

**RN(Regras de negócio)**

- O usuário não pode alterar o seu e-mail para um email já utilizado;
- Para atualizar a sua senha, o usuário deve informar a sua senha atual;
- Para atualizar a sua senha, o usuário deve fornecer a confirmação de senha identica a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder listar o seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações devem ser enviadas em tempo-real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não lidara para que o prestador possa
  controlar;

# Agendamento de serviços

**RF(Requisitos funcionais)**

- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias disponíveis de um prestador de acordo com o mês selecionado;
- O usuário deve poder listar os horários disponíveis de um prestador de acordo com o dia selecionado;
- O usuário deve ser capaz de realizar um agendamento de acordo com o dia e o horário disponível selecionado de um prestador.

**RNF(Requisitos não funcionais)**

- A listagem de prestadores deve ser armazenada em cache;

**RN(Regras de negócio)**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviçõs consigo mesmo;
