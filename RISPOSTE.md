# Risposte - Laboratorio 03.16 · Chiamate HTTP

## Passo 6 - Richieste osservate

Ho aperto la scheda Network (F12, filtro Fetch/XHR) e ho premuto uno dopo l'altro i pulsanti della pagina dei post. Queste sono le richieste che sono comparse:

| Pulsante | Metodo | URL | Stato |
|---|---|---|---|
| Carica un post (con 1) | GET | https://jsonplaceholder.typicode.com/posts/1 | 200 OK |
| Carica un post (con 999) | GET | https://jsonplaceholder.typicode.com/posts/999 | 404 Not Found |
| Carica tutti | GET | https://jsonplaceholder.typicode.com/posts | 200 OK |
| Invia un post | POST | https://jsonplaceholder.typicode.com/posts | 201 Created |

Aprendo la riga della `POST`, la sezione **Payload** contiene l'oggetto che ho inviato (`userId`, `title`, `body`). In **Response** c'è lo stesso oggetto con in più `"id": 101`. Subito prima della POST compare anche una richiesta `OPTIONS` allo stesso URL, con stato 204: è il controllo preliminare CORS, con cui il browser chiede al server se può inviargli dati JSON da un'altra origine (`http://localhost:4200`).

Con la rete impostata su **Offline**, il pulsante *Carica tutti* mostra in pagina "Errore 0". La richiesta non è mai arrivata al server, quindi non esiste un codice di stato da restituire.

## Domande

### 1. A che cosa serve `provideHttpClient()` e in quale file va scritto?

Rende disponibile `HttpClient` nel sistema di iniezione delle dipendenze, così i servizi possono ottenerlo con `inject(HttpClient)`. Si scrive nell'array `providers` di `src/app/app.config.ts`.

Nelle versioni recenti di Angular `HttpClient` funziona anche senza questa riga, che però resta il punto in cui si configura l'HTTP dell'intera app, per esempio quando si vuole aggiungere un token a ogni richiesta. Nelle versioni precedenti, dimenticarla causava l'errore `NullInjectorError: No provider for HttpClient!`.

### 2. `constructor(public http: HttpClient)` oppure `private readonly http = inject(HttpClient)`?

Il risultato è lo stesso: Angular fornisce un'istanza di `HttpClient`. Cambia il modo in cui la si chiede. Con il costruttore la dipendenza arriva come parametro e, grazie a `public`, diventa anche una proprietà accessibile dall'esterno della classe. Con `inject()` la si ottiene direttamente nell'inizializzazione di un campo, che può essere `private readonly`: nessuno lo legge da fuori, nessuno lo riassegna, e il costruttore resta libero.

Dentro una classe `@Service()` la versione con il costruttore non funziona. L'ho verificato: la compilazione si ferma con `NG2028: @Service class cannot use constructor dependency injection. Use the inject function instead.`

### 3. Che cos'è un Observable? Quando parte la richiesta scritta in `getPosts()`?

Un Observable, che arriva dalla libreria RxJS, rappresenta un valore che sarà disponibile più avanti. Funziona un po' come l'iscrizione a una newsletter: finché non ti iscrivi non ricevi niente.

Per questo `getPosts()` da sola non fa partire nulla, si limita a restituire l'Observable. La richiesta parte quando il componente chiama `subscribe(...)`, cioè dentro `caricaTutti()`. Ogni nuova `subscribe` genera una nuova richiesta.

### 4. Che cosa fanno `next` ed `error` in `subscribe({ next, error })`?

`next` viene eseguita quando arriva la risposta e riceve i dati già convertiti in oggetti, per esempio un `Post`. In una richiesta HTTP arriva un solo valore, dopodiché l'Observable si chiude da solo.

`error` viene eseguita al posto di `next` quando qualcosa va storto: uno stato 4xx o 5xx, la rete assente, una richiesta bloccata dal browser. Riceve un `HttpErrorResponse` che contiene `status` e `message`.

Con il post 999 viene chiamata `error` con stato **404** (Not Found), e in pagina compare "Errore 404: Http failure response for .../posts/999: 404".

### 5. Perché `post`, `posts`, `loading` ed `errore` sono signal?

La risposta arriva in modo asincrono, molto dopo il click e fuori da qualsiasi evento del template. Dato che l'app è zoneless, nessuno avvisa Angular quando una proprietà normale cambia. Se scrivessi `posts: Post[] = []` e poi `this.posts = dati`, il valore dentro la classe sarebbe aggiornato ma la pagina resterebbe vuota, oppure lo spinner continuerebbe a girare. Con `signal()` e `.set(...)` è il signal stesso ad avvisare Angular, che ridisegna solo la parte di template che lo legge.

### 6. Perché tipizzare le risposte con un'interfaccia invece di usare `any`?

Scrivendo `http.get<Post>` TypeScript conosce i campi della risposta. L'editor li suggerisce mentre scrivo e il compilatore blocca i nomi sbagliati. Se nel template scrivo `p.titolo` invece di `p.title`, la compilazione si ferma con `TS2339: Property 'titolo' does not exist on type 'Post'`. Con `any` l'errore passerebbe inosservato e a runtime vedrei solo un campo vuoto (`undefined`).

C'è però un limite: TypeScript si fida dell'interfaccia e non controlla il JSON che arriva davvero. Per questo l'interfaccia va scritta partendo da una risposta reale.

### 7. Che cosa fa il pipe `json` e perché è utile durante lo sviluppo?

Converte un oggetto in testo JSON indentato (`{{ p | json }}`). Dentro un `<pre>` mostra esattamente che cosa ha risposto il server, campo per campo. È comodo per capire la forma dei dati prima di scrivere l'interfaccia e per accorgersi subito di un campo mancante o con un nome diverso da quello atteso. Bisogna importare `JsonPipe` da `@angular/common` negli `imports` del componente, altrimenti si ottiene `NG8004: No pipe found with name 'json'`.

### 8. Perché la POST restituisce sempre l'id 101? Perché nella POST non si usa `JSON.stringify`?

JSONPlaceholder contiene 100 post e si comporta come un server vero: risponde 201 Created e assegna al nuovo post l'id successivo, cioè 101. È però un'API finta che non salva niente, quindi alla POST successiva i post sono ancora 100 e l'id torna a essere 101. Lo conferma anche "Carica tutti", che continua a mostrare 100 post.

`JSON.stringify` non serve perché `HttpClient` converte l'oggetto in JSON da solo e aggiunge l'header `Content-Type: application/json`. Se gli passassi una stringa, la richiesta partirebbe come testo semplice e molti server non saprebbero interpretarla.

### 9. Come hai tenuto la chiave della NASA fuori dal repository? A che cosa serve `environment.example.ts`?

L'ordine dei passaggi conta, perché un file già committato resta nella storia anche se poi lo si aggiunge al `.gitignore`:

1. ho generato i file di ambiente con `ng g environments`, che crea `environment.ts` ed `environment.development.ts` e aggiunge le *file replacements* in `angular.json`, poi ho riavviato `ng serve`;
2. prima di qualsiasi commit ho aggiunto i due file al `.gitignore` del progetto;
3. ho creato `environment.example.ts` con il segnaposto `INSERISCI_QUI_LA_TUA_CHIAVE`, che invece va committato;
4. ho scritto la chiave vera in entrambi i file ignorati, perché `ng serve` usa la versione `.development`;
5. con `git status` ho verificato che comparissero solo `.gitignore`, `angular.json` ed `environment.example.ts`.

`environment.example.ts` serve a chi clona il repository, docente compreso, per sapere che forma devono avere i file di ambiente. Basta copiarlo due volte con i nomi `environment.ts` ed `environment.development.ts` e inserire la propria chiave. Senza quei file la compilazione si interrompe con `TS2307: Cannot find module '../../environments/environment'`.

### 10. Perché la chiave in un'app Angular non è comunque segreta? Dove andrebbe tenuta una chiave importante?

Il `.gitignore` impedisce alla chiave di finire su GitHub, ma l'app Angular gira nel browser: tutto il suo codice, file di ambiente compresi, viene scaricato sul computer di chi la apre. La chiave si può leggere nei file JavaScript con gli strumenti per sviluppatori, e compare in chiaro anche nella scheda Network, dentro l'URL `?api_key=...`.

Una chiave davvero importante va tenuta su un server. In quel caso il browser chiama il nostro backend, che conosce la chiave, interroga l'API esterna e restituisce soltanto il risultato.

## Prove in autonomia svolte

Per il **livello 1 (post a pagine)** ho aggiunto a `PostService` il metodo `getPagina(pagina)`, che passa `params: { _page: pagina, _limit: 10 }`. Nel componente la pagina corrente è il signal `pagina`, e i pulsanti *Precedente* e *Successiva* si disabilitano rispettivamente sulla prima e sulla decima pagina. La pagina 2 chiama `.../posts?_page=2&_limit=10` e mostra i post dall'11 al 20.

Per il **livello 2 (Pokédex)** ho creato la pagina `pokedex` con un `PokemonService`. All'apertura la pagina mostra come badge i tipi di Pokémon presi da `/api/v2/type`. La ricerca per nome o per numero mostra nome, immagine, altezza in metri e peso in chilogrammi. Se il server risponde 404 compare il messaggio "Pokémon non trovato".
