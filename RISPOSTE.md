# Risposte - Laboratorio 03.16 · Chiamate HTTP

## Passo 6 - Richieste osservate

Richieste osservate nella scheda Network (F12, filtro Fetch/XHR) premendo i pulsanti della pagina dei post.

| Pulsante | Metodo | URL | Stato |
|---|---|---|---|
| Carica un post (con 1) | GET | https://jsonplaceholder.typicode.com/posts/1 | 200 OK |
| Carica un post (con 999) | GET | https://jsonplaceholder.typicode.com/posts/999 | 404 Not Found |
| Carica tutti | GET | https://jsonplaceholder.typicode.com/posts | 200 OK |
| Invia un post | POST | https://jsonplaceholder.typicode.com/posts | 201 Created |

Osservazioni:

- Nella riga della `POST`, in **Payload** c'è l'oggetto inviato (`userId`, `title`, `body`) e in **Response** lo stesso oggetto con in più `"id": 101`.
- Prima della `POST` compare una richiesta `OPTIONS` allo stesso URL, con stato 204: è la richiesta preliminare CORS con cui il browser chiede al server il permesso di inviargli dati JSON da un'altra origine (`http://localhost:4200`).
- In modalità **Offline** il pulsante *Carica tutti* mostra in pagina "Errore 0: ...": la richiesta non è arrivata al server, quindi non c'è un codice di stato.

## Domande

### 1. A che cosa serve `provideHttpClient()` e in quale file va scritto?

Registra `HttpClient` nell'iniezione delle dipendenze dell'app, così i servizi possono ottenerlo con `inject(HttpClient)`. Va scritto nell'array `providers` di `src/app/app.config.ts`. Nelle versioni recenti di Angular `HttpClient` funziona anche senza, ma quella riga resta il punto in cui si configura l'HTTP dell'app (per esempio per aggiungere a ogni richiesta un token). Nelle versioni meno recenti, senza di essa si otteneva `NullInjectorError: No provider for HttpClient!`.

### 2. `constructor(public http: HttpClient)` oppure `private readonly http = inject(HttpClient)`?

Fanno la stessa cosa, cioè chiedono ad Angular un'istanza di `HttpClient`, ma in modo diverso:

- con il **costruttore** la dipendenza è un parametro; con `public` diventa anche una proprietà pubblica, accessibile da fuori la classe;
- con **`inject()`** la dipendenza si ottiene direttamente nell'inizializzazione di un campo. Il costruttore resta libero, il campo può essere `private readonly` (nessuno lo legge da fuori o lo riassegna) e il tipo si ricava da solo.

La notazione con il costruttore **non funziona dentro una classe `@Service()`**. L'ho provato e la compilazione si ferma con `NG2028: @Service class cannot use constructor dependency injection. Use the inject function instead.`

### 3. Che cos'è un Observable? Quando parte la richiesta scritta in `getPosts()`?

Un Observable (libreria RxJS) rappresenta un valore che arriverà in futuro: è come l'iscrizione a una newsletter, finché non ti iscrivi non ricevi nulla. `getPosts()` non fa partire la richiesta, restituisce soltanto l'Observable. La richiesta parte quando il componente chiama `subscribe(...)` (in `caricaTutti()`). Ogni `subscribe` fa partire una nuova richiesta.

### 4. Che cosa fanno `next` ed `error` in `subscribe({ next, error })`?

- `next` viene chiamata quando arriva la risposta e riceve i dati già convertiti in oggetti (per esempio un `Post`). Per una richiesta HTTP arriva un solo valore, poi l'Observable si chiude.
- `error` viene chiamata **al posto** di `next` se la richiesta fallisce: stato 4xx o 5xx, rete assente, richiesta bloccata. Riceve un `HttpErrorResponse` con `status` e `message`.

Con il post 999 viene chiamata `error`, con codice di stato **404** (Not Found): in pagina compare "Errore 404: Http failure response for .../posts/999: 404".

### 5. Perché `post`, `posts`, `loading` ed `errore` sono signal?

La risposta arriva in modo asincrono, molto dopo il click e fuori da qualsiasi evento del template. L'app è zoneless: se il dato fosse in una proprietà semplice (`posts: Post[] = []` e poi `this.posts = dati`), nessuno avviserebbe Angular del cambiamento. Il valore nella classe cambierebbe, ma la pagina resterebbe vuota (o lo spinner girerebbe all'infinito). Con `signal()` e `.set(...)` il signal avvisa Angular, che aggiorna la parte di template che lo legge.

### 6. Perché tipizzare le risposte con un'interfaccia invece di usare `any`?

Con `http.get<Post>` TypeScript sa quali campi ha la risposta: l'editor li suggerisce e il compilatore segnala subito i nomi sbagliati. Esempio: se nel template scrivo `p.titolo` invece di `p.title`, la compilazione si ferma con `TS2339: Property 'titolo' does not exist on type 'Post'`. Con `any` l'errore passerebbe e a runtime vedrei solo un campo vuoto (`undefined`). TypeScript però non controlla il JSON che arriva davvero: per questo l'interfaccia va scritta guardando una risposta reale.

### 7. Che cosa fa il pipe `json` e perché è utile durante lo sviluppo?

Trasforma un oggetto in testo JSON indentato (`{{ p | json }}`). Dentro un `<pre>` mostra esattamente che cosa ha risposto il server, con tutti i campi e i loro valori. Serve per capire la forma dei dati, per scrivere l'interfaccia e per accorgersi di campi mancanti o con nomi diversi. Va importato `JsonPipe` da `@angular/common` negli `imports` del componente, altrimenti compare `NG8004: No pipe found with name 'json'`.

### 8. Perché la POST restituisce sempre l'id 101? Perché nella POST non si usa `JSON.stringify`?

JSONPlaceholder contiene 100 post e risponde come farebbe un server vero, assegnando al nuovo post l'id successivo (101) con stato 201 Created. È però un'API finta e non salva nulla: alla POST successiva i post sono ancora 100 e l'id è di nuovo 101. Infatti "Carica tutti" mostra sempre 100 post.

`JSON.stringify` non serve perché `HttpClient` trasforma da solo l'oggetto in JSON e aggiunge l'header `Content-Type: application/json`. Passando una stringa, la richiesta partirebbe come testo semplice e molti server non la capirebbero.

### 9. Come hai tenuto la chiave della NASA fuori dal repository? A che cosa serve `environment.example.ts`?

1. Ho generato i file di ambiente con `ng g environments` (crea `environment.ts` ed `environment.development.ts` e aggiorna `angular.json` con le *file replacements*), poi ho riavviato `ng serve`.
2. **Prima di qualsiasi commit** ho aggiunto i due file al `.gitignore` del progetto.
3. Ho creato `environment.example.ts` con il segnaposto `INSERISCI_QUI_LA_TUA_CHIAVE`, da committare.
4. Ho scritto la chiave vera in entrambi i file ignorati (`ng serve` usa la versione `.development`).
5. Con `git status` ho controllato che comparissero solo `.gitignore`, `angular.json` ed `environment.example.ts`.

`environment.example.ts` mostra a chi clona il repository (anche al docente) quale forma devono avere i file di ambiente. Lo si copia due volte, come `environment.ts` ed `environment.development.ts`, e si inserisce la propria chiave. Senza quei file la compilazione si ferma (`TS2307: Cannot find module '../../environments/environment'`).

### 10. Perché la chiave in un'app Angular non è comunque segreta? Dove andrebbe tenuta una chiave importante?

Il `.gitignore` tiene la chiave fuori da GitHub, ma l'app Angular gira nel browser: tutto il suo codice, file di ambiente compresi, viene scaricato sul computer dell'utente. Chiunque può leggere la chiave negli strumenti per sviluppatori, nei file JavaScript o nella scheda Network, dove compare nell'URL `?api_key=...`. Una chiave davvero importante va tenuta su un **server** (backend): il browser chiama il nostro server, e il server, che conosce la chiave, fa la richiesta all'API esterna e restituisce solo il risultato.

## Prove in autonomia svolte

- **Livello 1 - Post a pagine**: `PostService.getPagina(pagina)` con `params: { _page: pagina, _limit: 10 }`, signal `pagina` e pulsanti *Precedente* / *Successiva*, disabilitati sulla prima e sulla decima pagina. La pagina 2 chiama `.../posts?_page=2&_limit=10` e mostra i post 11-20.
- **Livello 2 - Pokédex**: pagina `pokedex` con `PokemonService`. All'apertura mostra i tipi come badge (`/api/v2/type`); la ricerca per nome o numero mostra nome, immagine, altezza in metri e peso in kg. Se il server risponde 404 compare "Pokémon non trovato".
