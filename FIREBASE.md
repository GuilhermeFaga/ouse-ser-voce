# Login, acessos e sincronização na nuvem

O app é **fechado**: o login com Google é obrigatório e só e-mails liberados
pela administração entram. Dentro de uma conta liberada, o registro continua
local-first: vive no `localStorage`, abre offline e é copiado para o Cloud
Firestore em um documento privado por conta.

Sem as variáveis do Firebase, o app não abre (mostra uma tela de configuração).

---

## 1. Configurar o Firebase (uma vez)

1. O projeto **`ouse-ser-voce`** já está criado e ligado a este repositório
   (`.firebaserc`). Se estiver começando do zero, crie um projeto em
   <https://console.firebase.google.com>.
2. Em **Visão geral do projeto → Adicionar app → Web**, registre o app e copie
   os valores do SDK.
3. Cole em um `.env` na raiz (use `.env.example` como modelo):

   ```bash
   cp .env.example .env
   ```

   ```dotenv
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto
   VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

   Só `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID` e `APP_ID` são obrigatórios para
   ligar o recurso; os outros dois completam o SDK.

4. **Authentication → Sign-in method → Google**: ative e escolha um e-mail de
   suporte.
5. **Authentication → Settings → Authorized domains**: adicione o domínio de
   produção. O site deste repositório roda em
   **`ouseservoce.sorayafarias.com.br`** (CNAME do GitHub Pages), então ele
   precisa estar na lista. `localhost` já vem incluso; o host
   `guilhermefaga.github.io` também pode ficar autorizado para o endereço
   padrão do Pages.
6. **Google Auth Platform → OAuth consent screen**: preencha nome do app, e-mail
   de suporte e os escopos `email` e `profile`. Em desenvolvimento, adicione as
   contas de teste; para o público geral, publique o app. Sem isso o Google
   bloqueia o login de quem não está na lista de teste.
7. **Firestore Database → Criar banco de dados**: modo de produção, região
   próxima do público (ex.: `southamerica-east1`).
8. Publique as regras de segurança deste repositório:

   ```bash
   pnpm dlx firebase-tools login
   pnpm dlx firebase-tools deploy --only firestore:rules
   ```

As regras em [`firestore.rules`](firestore.rules) fazem a autorização:

- `users/{uid}`: só a própria conta, e só se o e-mail estiver em `access` ou for
  de uma administradora.
- `access/{email}`: qualquer conta lê o **próprio** documento de acesso; só as
  administradoras leem a lista e escrevem nela.

Não há endpoint de backend: o cliente fala direto com o Firebase, e as regras
são a fronteira de segurança.

### GitHub Pages (o deploy deste repositório)

O site é publicado em **`https://ouseservoce.sorayafarias.com.br`**, com o
CNAME configurado no GitHub Pages.

O workflow `.github/workflows/deploy.yml` já lê as variáveis de repositório.
Em **Settings → Secrets and variables → Actions → Variables**, crie as seis
`VITE_FIREBASE_*` com os mesmos valores. Elas são embutidas no bundle no momento
do build — **não são segredos**, e isso é esperado para a configuração web do
Firebase. Em outras hospedagens (Vercel, Netlify, Firebase Hosting), use o
painel equivalente.

---

## 2. Quem entra

O login é obrigatório. Depois que o Google devolve a conta, o app confere
`access/{email}` — o id do documento é o e-mail em minúsculas:

| Situação                                  | O que o app faz                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| Documento existe                          | Abre a jornada.                                                        |
| Documento ausente                         | Mostra “seu e-mail ainda não está liberado” e permite trocar de conta. |
| Sem conexão, mas com o documento em cache | Abre a jornada offline.                                                |
| Sem conexão e sem cache                   | Pede conexão e oferece “tentar de novo”.                               |

O app escuta o próprio documento: se a administração remover o acesso, a
próxima atualização derruba a sessão. A checagem no cliente é conveniência; as
regras do Firestore negam os dados mesmo que alguém tente falar com o banco
direto.

### Administradoras

A lista de administradoras fica em `client/src/app/access.ts` e precisa estar
igual em `firestore.rules`. Hoje são:

- `guilhermefaaga@gmail.com`
- `soraya.farias@gmail.com`

Administradoras entram sem documento em `access` e são as únicas que leem e
escrevem a lista. A página **Acessos** aparece no menu só para elas.

Para incluir outra administradora, edite as duas listas e publique as regras.

### A página Acessos

Em **Acessos** (menu, visível só para administradoras) é possível:

- ver a lista liberada em tempo real;
- liberar um ou vários e-mails (separe por vírgula);
- remover um acesso, com confirmação.

Cada liberação grava `access/{email}` com `email`, `addedAt` e `addedBy`. Se
precisar criar o primeiro acesso manualmente, o console do Firestore serve.

O link “Peça para liberar seu e-mail” (login) e “Pedir liberação” (acesso
negado) abrem o WhatsApp da Soraya com a mensagem preenchida. O número fica em
`SORAYA_WHATSAPP`, em `client/src/share/messages.ts`.

> O Google autentica qualquer conta; a **autorização** é a lista. Restringir no
> próprio Auth exigiria blocking functions ou custom claims, o que não é
> necessário porque as regras negam os dados de quem não está liberado.

---

## 3. O que é salvo

Um documento por conta, em `users/{uid}`:

```json
{
  "schemaVersion": 1,
  "revision": "V1StGXR8_Z5jdHi6B-myT",
  "savedAt": "<server timestamp>",
  "state": {
    "version": 2,
    "userId": "identidade usada em curtidas e comentários",
    "userName": "Marina",
    "onboardingComplete": true,
    "startDate": "2026-03-01T10:00:00.000Z",
    "days": {
      "1": {
        "day": 1,
        "mood": 4,
        "notes": "…",
        "prompts": {},
        "completedAt": "…",
        "updatedAt": "…"
      }
    },
    "notes": [],
    "scanner": null,
    "initialAssessment": null,
    "finalAssessment": null,
    "unlockedAchievements": ["first-day"],
    "favoriteAudioDays": [2],
    "storyLikes": {},
    "comments": [],
    "updatedAt": "2026-03-02T21:10:00.000Z"
  }
}
```

- `schemaVersion` versiona o **formato do documento**. Um documento de outra
  versão é ignorado, nunca mesclado às cegas.
- `revision` identifica cada escrita. O snapshot que volta com a própria
  revisão é tratado como eco, não como edição de outro aparelho.
- `updatedAt` (raiz) marca a última mudança local e serve de checkpoint contra
  reenvios desnecessários.

---

## 4. Como a sincronização decide

O código está em `client/src/app/cloud.ts` (regras puras, testadas) e
`client/src/app/sync.tsx` (ciclo de vida).

| Situação                          | O que acontece                                                                                                                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aparelho novo, conta com registro | O registro da conta substitui o local vazio.                                                                                                                                                                     |
| Aparelho com registro, conta nova | O registro local vira o documento da conta.                                                                                                                                                                      |
| Os dois têm registro              | Junção única: texto dos dois lados quando um está vazio (em conflito, o mais recente vence), conclusão monotônica, notas/conquistas/favoritos/curtidas em união, avaliação mais recente vence, nome local vence. |
| Cache local já sincronizado       | Nada é reescrito; o aparelho só escuta a nuvem.                                                                                                                                                                  |
| Edição local                      | Push com debounce de 700 ms; um snapshot de outro aparelho nunca sobrescreve uma edição ainda não enviada.                                                                                                       |
| Offline                           | O registro continua no `localStorage`; o Firestore usa cache persistente e envia quando a conexão volta.                                                                                                         |
| “Apagar meus dados”               | Um registro vazio é enviado imediatamente, apagando o conteúdo da nuvem — não é mesclado de volta.                                                                                                               |
| Troca de conta no mesmo aparelho  | O registro da conta anterior é guardado em `ouse-account-{uid}` antes de a nova conta entrar; ao voltar, ele é restaurado e mesclado.                                                                            |

Duas pessoas nunca compartilham o mesmo documento: a conta é a fronteira.

### Limites conhecidos

- Duas edições simultâneas no mesmo dia resolvem por “último a chegar” na
  nuvem; a junção só roda na primeira conexão daquele aparelho com aquela
  conta. Não há CRDT nem resolução por campo em tempo real.
- O login usa popup do Google. Safari e navegadores embutidos (Instagram,
  Facebook) podem bloquear; nesse caso o app cai para redirecionamento, e o
  usuário precisa abrir o site no navegador.
- “Apagar meus dados” apaga o **conteúdo** da nuvem, mas não exclui a conta de
  autenticação (`uid`/e-mail) nem o acesso em `access`. Exclusão de conta exige
  `deleteUser` com login recente ou remoção manual no console do Firebase —
  próximo passo natural se o produto precisar de exclusão completa (LGPD).
- Quem já abriu o app uma vez pode continuar lendo o registro local offline;
  escrever na nuvem continua sujeito às regras. Se o acesso for removido, o app
  cai assim que conseguir falar com o Firestore.

---

## 5. Testar

Regras puras (lista de acesso, junção, leitura do documento, limpeza por
“apagar dados”):

```bash
pnpm test client/src/app/access.test.ts client/src/app/cloud.test.ts
```

Também valide as regras do Firestore no emulador ou no console antes de
publicar mudanças que afetem acesso.

Fluxo completo (login, escrita, outro aparelho) exige um projeto Firebase de
teste com Google ativado. Para checar o bundle:

```bash
pnpm build
```

Firebase entra por `import()` dinâmico em `client/src/app/firebase.ts`, fora do
bundle principal: sem configuração, nada é baixado; com configuração, o SDK de
Auth é buscado para restaurar a sessão e o Firestore só é baixado depois do
login.
