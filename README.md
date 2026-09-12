# CLYVO Elo — Mobile

App em React Native (Expo) para o CLYVO Elo — a solução construída para o Challenge FIAP 2026 (CLYVO VET), cobrindo a entrega da disciplina de Mobile Application Development (Sprint 3).

O app consome a API construída na disciplina de .NET (`ClyvoElo-dotnet`, publicada em `https://clyvoelo-dotnet.onrender.com`), com dois papéis de acesso: **Tutor** e **Doutor**.

## O problema

O tutor só procura a clínica quando já tem um problema na mão. Fora isso, o vínculo esfria — consulta preventiva é esquecida, adesão ao tratamento pós-operatório cai pela metade do caminho, e a clínica não tem visibilidade nenhuma do que acontece com o pet fora do consultório. O CLYVO Elo mantém esse vínculo ativo: o doutor registra o cuidado, o tutor acompanha em tempo real.

## Stack

- React Native + Expo (SDK 57), Expo Router (navegação por arquivo)
- TanStack Query (`useQuery`/`useMutation`) para toda a integração com a API
- Axios como cliente HTTP, com logout automático quando a sessão expira
- Autenticação JWT com sessão persistida (SecureStore no nativo, localStorage na web)
- lucide-react-native para os ícones

## Como rodar

```
npm install
npx expo start
```

Aperta `w` pra abrir no navegador, ou escaneia o QR code com o app Expo Go no celular.

### Login de demonstração

- Tutor: `gabriel@email.com` / `clyvo123`
- Doutor: `ana.ferreira@clyvovet.com` / `clyvo123`

Também dá pra criar uma conta de Tutor nova pela tela de Cadastro.

## Telas

| Tela | Papel | O que faz |
|---|---|---|
| Login | Todos | Entrar como Tutor ou Doutor |
| Cadastro | Público | Criar conta nova de Tutor |
| Início | Todos | Tutor vê só os próprios pets; Doutor vê todos os pacientes |
| Detalhe do Pet | Todos (ações de Tutor) | Ver dados, editar peso, excluir — escrita restrita ao Tutor |
| Novo Pet | Tutor | Cadastrar um pet |
| Eventos Clínicos | Todos (ações de Doutor) | Tutor só lê o histórico; Doutor cria, muda status e exclui |
| Novo Evento | Doutor | Registrar vacina, checkup, pós-operatório, medicação ou exame |
| Perfil | Todos | Dados da conta logada e logout |

## Papéis e permissões

| Ação | Quem pode |
|---|---|
| Ver só os próprios pets | Tutor |
| Ver todos os pacientes | Doutor |
| Cadastrar / editar peso / excluir pet | Tutor |
| Registrar / mudar status / excluir evento clínico | Doutor |
| Ver histórico de eventos | Tutor e Doutor |

## Integração com a API

Toda chamada passa por `src/api/client.ts`, que injeta o token JWT automaticamente (via interceptor do axios) nas rotas protegidas, e desloga sozinho se o servidor rejeitar a sessão. Nenhum dado é mockado — pets, eventos e login vêm todos da API real, publicada no Render.

Repositório da API: `https://github.com/GabrielCabralmm/ClyvoElo-dotnet`

## Identidade visual

Paleta oficial do CLYVO Elo (definida em `src/theme/colors.ts`), aplicada em todas as telas, no ícone do app e na tela de abertura (splash):

| Cor | Hex | Uso |
|---|---|---|
| Verde escuro | `#0B4F4A` | Títulos |
| Verde principal | `#3F8F68` | Botões, ações |
| Verde claro | `#8FBE83` | Elementos secundários |
| Verde fundo | `#EAF3E8` | Cards |
| Off-white | `#FAF9F5` | Fundo geral |
| Texto escuro | `#173D3A` | Corpo de texto |
| Cinza secundário | `#6F7D79` | Texto auxiliar |

## Estrutura do projeto

```
src/
  app/             rotas (Expo Router)
    (auth)/        login, cadastro
    (app)/         área logada
      (tabs)/      início, perfil
      pet/         detalhe, novo
      eventos/     lista por pet, novo evento
  api/             chamadas HTTP por recurso (auth, pets, eventos)
  contexts/        AuthContext (sessão, login, cadastro, logout)
  lib/             storage.ts — abstrai SecureStore (nativo) e localStorage (web)
  theme/           paleta de cores da identidade visual
  types/           tipos compartilhados, espelhando os DTOs da API
```

## Funciona também no navegador

O app roda tanto em iOS/Android quanto na web (`npx expo start` + `w`), com layout responsivo — a navegação se adapta (abas embaixo no celular, menu lateral em telas largas) sem duplicar a lógica de dados.
