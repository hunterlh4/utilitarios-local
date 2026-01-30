erDiagram
    direction TB

    %% --- Bloque Tag, TagRelation, Media, Link ---
    Tag:::tagColor {
        int id PK ""  
        nvarchar name  ""  
        char type  ""  
    }
    TagRelation:::relationColor {
        int tagId FK ""  
        int refId  ""  
        char type  ""  
    }
    Media:::mediaColor {
        int id PK ""  
        char type  ""  
        int refId  ""  
        nvarchar url  ""  
        nvarchar thumbnail  ""  
        nvarchar deleteUrl  ""  
        int orderIndex  ""  
        datetime createdAt  ""  
    }
    Link:::linkColor {
        int id PK ""  
        char type  ""  
        int refId  ""  
        nvarchar name  ""  
        nvarchar url  ""  
        int orderIndex  ""  
        datetime createdAt  ""  
    }

    %% --- Galerías más cerca de media ---
    GirlGalery {
        int id PK ""  
        nvarchar name  ""  
        datetime createdAt  ""  
    }
    AnimeGalery {
        int id PK ""  
        nvarchar name  ""  
        datetime createdAt  ""  
    }

    %% --- Anime/Hentai/Series ---
    Anime {
        int id PK ""  
        nvarchar title  ""  
        nvarchar image  ""  
        int episodes  ""  
        char status  ""  
        datetime createdAt  ""  
    }
    Hentai {
        int id PK ""  
        nvarchar title  ""  
        nvarchar image  ""  
        int episodes  ""  
        char status  ""  
        datetime createdAt  ""  
    }
    Series {
        int id PK ""  
        nvarchar imdbId  ""  
        nvarchar title  ""  
        nvarchar image  ""  
        int year  ""  
        decimal rating  ""  
        nvarchar type  ""  
        char status  ""  
        datetime createdAt  ""  
    }
    Genre {
        int id PK ""  
        nvarchar name  ""  
    }
    HentaiGenre {
        int hentaiId FK ""  
        int genreId FK ""  
    }

    %% --- JAV/Actrices ---
    Actress {
        int id PK ""  
        nvarchar name  ""  
        nvarchar image  ""  
        datetime createdAt  ""  
    }
    Jav {
        int id PK ""  
        nvarchar code  ""  
        int actressId FK ""  
        nvarchar image  ""  
        char status  ""  
        datetime createdAt  ""  
    }

    %% --- Proyectos/YouTube ---
    Proyect {
        int id PK ""  
        nvarchar name  ""  
        nvarchar description  ""  
        nvarchar url  ""  
        datetime createdAt  ""  
    }
    YouTube {
        int id PK ""  
        nvarchar url  ""  
        nvarchar title  ""  
        nvarchar authorName  ""  
        nvarchar thumbnailUrl  ""  
        nvarchar html  ""  
        char category  ""  
        datetime createdAt  ""  
    }

    %% --- DOTA ---
    DotaHero {
        int id PK ""  
        nvarchar name  ""  
        nvarchar image  ""  
        datetime createdAt  ""  
    }
    DotaTreasure {
        int id PK ""  
        nvarchar name  ""  
        nvarchar image  ""  
        nvarchar imagePresentation  ""  
        int year  ""  
        char type  ""  
        datetime createdAt  ""  
    }
    DotaCache {
        int id PK ""  
        int treasureId FK ""  
        int heroId FK ""  
        nvarchar name  ""  
        nvarchar photo  ""  
        decimal price  ""  
        int quantity  ""  
        decimal total  ""  
        nvarchar owner  ""  
        datetime createdAt  ""  
    }
    DotaMedia {
        int id PK ""  
        char type  ""  
        int refId  ""  
        nvarchar url  ""  
        int orderIndex  ""  
        datetime createdAt  ""  
    }

    %% --- STEAM ---
    SteamItem {
        int id PK ""  
        nvarchar name  ""  
        nvarchar image  ""  
        nvarchar price  ""  
        char game  ""  
        nvarchar marketUrl  ""  
        char status  ""  
        datetime createdAt  ""  
    }
    SteamItemDrop {
        int id PK ""  
        int steamItemId FK ""  
        int quantity  ""  
        decimal price  ""  
        decimal salePrice  ""  
        decimal total  ""  
        datetime createdAt  ""  
    }
    SteamItemPurchase {
        int id PK ""  
        int steamItemId FK ""  
        decimal purchasePrice  ""  
        decimal salePrice  ""  
        decimal profit  ""  
        char status  ""  
        datetime purchaseDate  ""  
        datetime saleDate  ""  
        datetime createdAt  ""  
    }

    %% --- CUENTAS/PERSONA/DINERO ---
    Account {
        int id PK ""  
        char type  ""  
        nvarchar name  ""  
        nvarchar username  ""  
        nvarchar password  ""  
        nvarchar profileUrl  ""  
        nvarchar phoneNumber  ""  
        nvarchar recoveryEmail  ""  
        datetime lastConnection  ""  
        datetime createdAt  ""  
    }
    AccountRelation {
        int id PK ""  
        int parentAccountId FK ""  
        int childAccountId FK ""  
        datetime createdAt  ""  
    }
    AccountProperty {
        int id PK ""  
        int accountId FK ""  
        char key  ""  
        bit value  ""  
        datetime createdAt  ""  
    }
    Person {
        int id PK ""  
        nvarchar name  ""  
        datetime createdAt  ""  
    }
    Payment {
        int id PK ""  
        int personId FK ""  
        char type  ""  
        decimal amount  ""  
        nvarchar description  ""  
        date date  ""  
        datetime createdAt  ""  
    }
    Salary {
        int id PK ""  
        decimal currentMoney  ""  
        decimal grossSalary  ""  
        decimal afpDiscount  ""  
        decimal firstFortnightNet  ""  
        decimal secondFortnightNet  ""  
        decimal cts  ""  
        decimal bonus  ""  
        datetime createdAt  ""  
    }

    %% --- POST/CONTENIDO ---
    Post {
        int id PK ""  
        nvarchar title  ""  
        nvarchar description  ""  
        char category  ""  
        nvarchar subcategory  ""  
        nvarchar slug  ""  
        date date  ""  
        datetime createdAt  ""  
    }
    PostContent {
        int id PK ""  
        int postId FK ""  
        char type  ""  
        nvarchar text  ""  
        nvarchar language  ""  
        nvarchar url  ""  
        nvarchar alt  ""  
        int orderIndex  ""  
        datetime createdAt  ""  
    }
    PostContentItem {
        int id PK ""  
        int postContentId FK ""  
        nvarchar text  ""  
        int orderIndex  ""  
    }

    %% --- TAREAS/EVENTOS ---
    TaskList {
        nvarchar id PK ""  
        nvarchar title  ""  
        char status  ""  
        datetime createdAt  ""  
        datetime updatedAt  ""  
    }
    Task {
        nvarchar id PK ""  
        nvarchar taskListId FK ""  
        nvarchar title  ""  
        bit completed  ""  
    }
    Event {
        nvarchar id PK ""  
        nvarchar title  ""  
        date startDate  ""  
        date endDate  ""  
        char type  ""  
        bit allDay  ""  
        nvarchar color  ""  
        datetime createdAt  ""  
    }

    %% --- VENTAS ---
    Seller {
        int id PK ""  
        nvarchar name  ""  
        nvarchar whatsapp  ""  
        nvarchar products  ""  
        datetime createdAt  ""  
    }

    %% --- RELACIONES CLAVE ---
    Tag||--o{TagRelation:"tiene"
    Media||--o{GirlGalery:"galería chica"
    Media||--o{AnimeGalery:"galería anime"
    TagRelation||--o{Link:"usa link"
    
    %% --- Relaciones originales relevantes (aún agrupadas) ---
    Hentai||--o{HentaiGenre:"tiene"
    Genre||--o{HentaiGenre:"pertenece"
    Actress||--o{Jav:"actúa en"
    Proyect||--o{Media:"tiene fotos"
    DotaTreasure||--o{DotaCache:"contiene"
    DotaHero||--o{DotaCache:"para héroe"
    DotaTreasure||--o{DotaMedia:"tiene fotos"
    DotaCache||--o{DotaMedia:"tiene fotos"
    SteamItem||--o{SteamItemDrop:"drops"
    SteamItem||--o{SteamItemPurchase:"compras"
    Account||--o{AccountRelation:"padre"
    Account||--o{AccountRelation:"hijo"
    Account||--o{AccountProperty:"propiedades"
    Person||--o{Payment:"pagos/deudas"
    Post||--o{PostContent:"contenido"
    PostContent||--o{PostContentItem:"items"
    TaskList||--o{Task:"tareas"
    Jav||--o{TagRelation:"etiquetas"
    Proyect||--o{TagRelation:"etiquetas"
    Post||--o{TagRelation:"etiquetas"
    Jav||--o{Link:"links streaming"
    Proyect||--o{Link:"links extra"
    GirlGalery||--o{Link:"links"
    Actress||--o{Link:"links"
    Post||--o{Link:"links"

    %% --- Colores para resaltar ---
    classDef tagColor fill:#fffae6,stroke:#d7ae06,stroke-width:2px;
    classDef relationColor fill:#e6f7ff,stroke:#0788db,stroke-width:2px;
    classDef mediaColor fill:#fce4ec,stroke:#ad1457,stroke-width:2px;
    classDef linkColor fill:#e8f5e9,stroke:#43a047,stroke-width:2px;