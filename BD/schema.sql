-- Anime table (lista de anime)
CREATE TABLE Anime (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(500) NOT NULL,
    image NVARCHAR(1000) NOT NULL,
    episodes INT NOT NULL,
    status CHAR(1) NOT NULL, -- 1: proximamente, 2: completado
    createdAt DATETIME DEFAULT GETDATE()
);

-- Hentai table (lista de hentai)
CREATE TABLE Hentai (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(500) NOT NULL,
    image NVARCHAR(1000) NOT NULL,
    episodes INT NOT NULL,
    status CHAR(1) NOT NULL, -- 1: proximamente, 2: completado
    createdAt DATETIME DEFAULT GETDATE()
);

-- Series table (lista de series/películas)
CREATE TABLE Series (
    id INT IDENTITY(1,1) PRIMARY KEY,
    imdbId NVARCHAR(20) NOT NULL,
    title NVARCHAR(500) NOT NULL,
    image NVARCHAR(1000) NOT NULL,
    year INT,
    rating DECIMAL(3,1),
    type NVARCHAR(50),
    status CHAR(1) NOT NULL, -- 1: proximamente, 2: completado
    createdAt DATETIME DEFAULT GETDATE()
);

-- Genre catalog table
CREATE TABLE Genre (
    id INT PRIMARY KEY, -- 1-99
    name NVARCHAR(100) NOT NULL
);

-- HentaiGenre relationship
CREATE TABLE HentaiGenre (
    hentaiId INT NOT NULL,
    genreId INT NOT NULL,
    PRIMARY KEY (hentaiId, genreId)
);

-- Girl table (galería de chicas)
CREATE TABLE GirlGalery (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Proyecto table (galería de proyectos)
CREATE TABLE Proyect (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(500) NOT NULL,
    description NVARCHAR(MAX),
    url NVARCHAR(1000),
    createdAt DATETIME DEFAULT GETDATE()
);

-- AnimeGaleria table (galería de imágenes de anime)
CREATE TABLE AnimeGalery (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL, -- Shigatsu, Konosuba, Steins;Gate, etc.
    createdAt DATETIME DEFAULT GETDATE()
);

-- Media table (solo imágenes para galerías)
CREATE TABLE Media (
    id INT IDENTITY(1,1) PRIMARY KEY,
    type CHAR(1) NOT NULL, -- 1: GirlGalery, 2: AnimeGalery, 3: Project
    refId INT NOT NULL,
    url NVARCHAR(1000) NOT NULL,
    thumbnail NVARCHAR(1000),
    deleteUrl NVARCHAR(1000),
    orderIndex INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Link table (enlaces genéricos para Project, Jav, GirlGalery, Actress, Post, helpers)
CREATE TABLE Link (
    id INT IDENTITY(1,1) PRIMARY KEY,
    type CHAR(1) NOT NULL, -- 1: Project (url_extra), 2: Jav (streaming), 3: Helper, 4: GirlGalery, 5: Actress, 6: Post
    refId INT, -- ID de la entidad (NULL para helpers)
    name NVARCHAR(200), -- Nombre del helper o link
    url NVARCHAR(1000) NOT NULL,
    orderIndex INT,
    createdAt DATETIME DEFAULT GETDATE()
);

-- YouTube table (videos de YouTube con metadata oEmbed)
CREATE TABLE YouTube (
    id INT IDENTITY(1,1) PRIMARY KEY,
    url NVARCHAR(500) NOT NULL,
    title NVARCHAR(500) NOT NULL,
    authorName NVARCHAR(200),
    authorUrl NVARCHAR(500),
    type NVARCHAR(50), -- "video"
    height INT,
    width INT,
    version NVARCHAR(10), -- "1.0"
    providerName NVARCHAR(100), -- "YouTube"
    providerUrl NVARCHAR(500), -- "https://www.youtube.com/"
    thumbnailHeight INT,
    thumbnailWidth INT,
    thumbnailUrl NVARCHAR(1000),
    html NVARCHAR(MAX), -- iframe embed code
    category CHAR(1) NOT NULL, -- 1: anime, 2: serie, 3: pelicula, 4: shorts
    createdAt DATETIME DEFAULT GETDATE()
);

-- Tag table (tags genéricos reutilizables para Jav, Project, Post, etc.)
CREATE TABLE Tag (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    type CHAR(1) NOT NULL, -- 1: Jav, 2: Project, 3: Post, 4: otros
    UNIQUE (name, type) -- Mismo nombre puede existir en diferentes tipos
);

-- Actress table (actrices de JAV)
CREATE TABLE Actress (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    image NVARCHAR(1000),
    createdAt DATETIME DEFAULT GETDATE()
);

-- Jav table (videos JAV)
CREATE TABLE Jav (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE, -- NIMA-055
    actressId INT, -- ID de Actress
    image NVARCHAR(1000) NOT NULL,
    status CHAR(1) NOT NULL, -- 1: proximamente, 2: completado
    createdAt DATETIME DEFAULT GETDATE()
);

-- TagRelation table (relación genérica entre tags y entidades)
CREATE TABLE TagRelation (
    tagId INT NOT NULL,
    refId INT NOT NULL, -- ID de la entidad (Jav, Project, Post, etc.)
    type CHAR(1) NOT NULL, -- 1: Jav, 2: Project, 3: Post
    PRIMARY KEY (tagId, refId, type)
);

-- Seller table (vendedores)
CREATE TABLE Seller (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200),
    whatsapp NVARCHAR(20), -- +1234567890
    products NVARCHAR(MAX), -- Lista de productos que vende
    createdAt DATETIME DEFAULT GETDATE()
);

-- DotaHero table (héroes de Dota 2)
CREATE TABLE DotaHero (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    image NVARCHAR(1000),
    createdAt DATETIME DEFAULT GETDATE()
);

-- DotaTreasure table (cofres de Dota 2)
CREATE TABLE DotaTreasure (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    image NVARCHAR(1000) NOT NULL,
    imagePresentation NVARCHAR(1000),
    year INT NOT NULL,
    type CHAR(1), -- 1: Treasure I, 2: Treasure II, NULL: sin número
    createdAt DATETIME DEFAULT GETDATE()
);

-- DotaCache table (sets de cache)
CREATE TABLE DotaCache (
    id INT IDENTITY(1,1) PRIMARY KEY,
    treasureId INT NOT NULL, -- ID del cofre
    heroId INT NOT NULL, -- ID del héroe
    name NVARCHAR(200) NOT NULL, -- Nombre del set
    photo NVARCHAR(1000) NOT NULL, -- Foto principal
    price DECIMAL(10,2),
    quantity INT,
    total DECIMAL(10,2),
    owner NVARCHAR(200),
    createdAt DATETIME DEFAULT GETDATE()
);

-- DotaMedia table (fotos para cofres y cache)
CREATE TABLE DotaMedia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    type CHAR(1) NOT NULL, -- 1: DotaTreasure, 2: DotaCache
    refId INT NOT NULL, -- ID del cofre o cache
    url NVARCHAR(1000) NOT NULL,
    orderIndex INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- SteamItem table (catálogo de items de Steam)
CREATE TABLE SteamItem (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(300) NOT NULL,
    image NVARCHAR(1000) NOT NULL,
    price NVARCHAR(50), -- "$0.64"
    game CHAR(1) NOT NULL, -- 1: dota2, 2: cs2
    marketUrl NVARCHAR(1000) NOT NULL,
    status CHAR(1) NOT NULL, -- 1: historial, 2: por_comprar
    createdAt DATETIME DEFAULT GETDATE()
);

-- SteamItemDrop table (drops semanales - items que tengo)
CREATE TABLE SteamItemDrop (
    id INT IDENTITY(1,1) PRIMARY KEY,
    steamItemId INT NOT NULL, -- ID del SteamItem
    quantity INT NOT NULL,
    price DECIMAL(10,2), -- Precio unitario
    salePrice DECIMAL(10,2), -- Precio de venta
    total DECIMAL(10,2), -- quantity * salePrice
    createdAt DATETIME DEFAULT GETDATE()
);

-- SteamItemPurchase table (compras de items de Steam)
CREATE TABLE SteamItemPurchase (
    id INT IDENTITY(1,1) PRIMARY KEY,
    steamItemId INT NOT NULL, -- ID del SteamItem
    purchasePrice DECIMAL(10,2) NOT NULL, -- Precio de compra
    salePrice DECIMAL(10,2) DEFAULT 0, -- Precio de venta (0 hasta que se venda)
    profit DECIMAL(10,2), -- Ganancia (salePrice - purchasePrice)
    status CHAR(1) NOT NULL, -- 1: comprado, 2: vendido
    purchaseDate DATETIME NOT NULL, -- Fecha de compra
    saleDate DATETIME, -- Fecha de venta (opcional)
    createdAt DATETIME DEFAULT GETDATE()
);

-- Account table (cuentas genéricas - correos, Steam, Facebook, etc.)
CREATE TABLE Account (
    id INT IDENTITY(1,1) PRIMARY KEY,
    type CHAR(1) NOT NULL, -- 1: Email, 2: Steam, 3: Facebook, 4: Instagram, 5: Game, 6: Other
    name NVARCHAR(200) NOT NULL, -- Main, Segunda, Tercera, etc.
    username NVARCHAR(200), -- Usuario o correo
    password NVARCHAR(200),
    profileUrl NVARCHAR(1000), -- URL del perfil (Steam, Facebook, Instagram, etc.)
    phoneNumber NVARCHAR(20),
    recoveryEmail NVARCHAR(200),
    lastConnection DATETIME, -- Última conexión (para cualquier tipo de cuenta)
    createdAt DATETIME DEFAULT GETDATE()
);

-- AccountRelation table (relaciones entre cuentas)
CREATE TABLE AccountRelation (
    id INT IDENTITY(1,1) PRIMARY KEY,
    parentAccountId INT NOT NULL, -- Cuenta padre (ej: correo)
    childAccountId INT NOT NULL, -- Cuenta hija (ej: Steam que usa ese correo)
    createdAt DATETIME DEFAULT GETDATE()
);

-- AccountProperty table (propiedades adicionales - solo booleanos)
CREATE TABLE AccountProperty (
    id INT IDENTITY(1,1) PRIMARY KEY,
    accountId INT NOT NULL,
    key CHAR(1) NOT NULL, -- 1: hasDota2, 2: hasCS2, 3: hasSteamMobile, 4: vacBanned
    value BIT default 0, -- 0 = false, 1 = true
    createdAt DATETIME DEFAULT GETDATE()
);

-- Person table (personas para control de dinero)
CREATE TABLE Person (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Payment table (pagos/deudas de dinero)
CREATE TABLE Payment (
    id INT IDENTITY(1,1) PRIMARY KEY,
    personId INT NOT NULL, -- ID de la persona
    type CHAR(1) NOT NULL, -- 1: deuda, 2: pago, 3: interes_deuda, 4: interes_pago
    amount DECIMAL(10,2) NOT NULL,
    description NVARCHAR(500),
    date DATE NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Salary table (configuración de sueldo)
CREATE TABLE Salary (
    id INT IDENTITY(1,1) PRIMARY KEY,
    currentMoney DECIMAL(10,2), -- Dinero actual
    grossSalary DECIMAL(10,2) NOT NULL, -- Sueldo bruto mensual
    afpDiscount DECIMAL(10,2) NOT NULL, -- Descuento AFP/ONP
    firstFortnightNet DECIMAL(10,2) NOT NULL, -- Primera quincena neta
    secondFortnightNet DECIMAL(10,2) NOT NULL, -- Segunda quincena neta
    cts DECIMAL(10,2), -- CTS semestral
    bonus DECIMAL(10,2), -- Gratificación semestral
    createdAt DATETIME DEFAULT GETDATE()
);

-- Post table (publicaciones/manuales)
CREATE TABLE Post (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(500) NOT NULL,
    description NVARCHAR(MAX),
    category CHAR(1) NOT NULL, -- 1: Frontend, 2: Backend, 3: Mobile, 4: Diseño, 5: Base de Datos, 6: Utilidades, 7: ORM, 8: Fullstack
    subcategory NVARCHAR(100),
    slug NVARCHAR(200) NOT NULL UNIQUE,
    date DATE NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- PostContent table (bloques de contenido)
CREATE TABLE PostContent (
    id INT IDENTITY(1,1) PRIMARY KEY,
    postId INT NOT NULL,
    type CHAR(1) NOT NULL, -- 1: titulo, 2: parrafo, 3: codigo, 4: imagen, 5: lista
    text NVARCHAR(MAX),
    language NVARCHAR(50), -- Para código
    url NVARCHAR(1000), -- Para imagen
    alt NVARCHAR(500), -- Para imagen
    orderIndex INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- PostContentItem table (items de lista)
CREATE TABLE PostContentItem (
    id INT IDENTITY(1,1) PRIMARY KEY,
    postContentId INT NOT NULL,
    text NVARCHAR(MAX) NOT NULL,
    orderIndex INT NOT NULL
);  

-- TaskList table (listas de tareas)
CREATE TABLE TaskList (
    id NVARCHAR(50) PRIMARY KEY, -- timestamp como string
    title NVARCHAR(500) NOT NULL,
    status CHAR(1) NOT NULL, -- 1: en proceso, 2: completado
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME
);

-- Task table (tareas individuales)
CREATE TABLE Task (
    id NVARCHAR(50) PRIMARY KEY,
    taskListId NVARCHAR(50) NOT NULL, -- FK a TaskList
    title NVARCHAR(500) NOT NULL,
    completed BIT NOT NULL DEFAULT 0, -- 0 = false, 1 = true
    FOREIGN KEY (taskListId) REFERENCES TaskList(id) ON DELETE CASCADE
);

-- Event table (eventos de calendario)
CREATE TABLE Event (
    id NVARCHAR(50) PRIMARY KEY,
    title NVARCHAR(500) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    type CHAR(1) NOT NULL, -- 1: festivo, 2: personal
    allDay BIT NOT NULL DEFAULT 1, -- 0 = false, 1 = true
    color NVARCHAR(20), -- #ef4444
    createdAt DATETIME DEFAULT GETDATE()
);

-- Indexes para mejorar rendimiento de consultas

-- Filtrar por status (proximamente/completado)
CREATE INDEX IX_Anime_Status ON Anime(status);
CREATE INDEX IX_Hentai_Status ON Hentai(status);
CREATE INDEX IX_Series_Status ON Series(status);
CREATE INDEX IX_Jav_Status ON Jav(status);

-- Buscar por IMDB ID
CREATE INDEX IX_Series_ImdbId ON Series(imdbId);

-- Buscar por código JAV
CREATE INDEX IX_Jav_Code ON Jav(code);

-- Buscar por actriz
CREATE INDEX IX_Jav_ActressId ON Jav(actressId);

-- Obtener media de una entidad
CREATE INDEX IX_Media_Type_RefId ON Media(type, refId);

-- Obtener links de una entidad
CREATE INDEX IX_Link_Type_RefId ON Link(type, refId);

-- Filtrar helpers por categoría
CREATE INDEX IX_Link_Type_Category ON Link(type, category) WHERE type = '3';

-- Obtener tags de una entidad
CREATE INDEX IX_TagRelation_Type_RefId ON TagRelation(type, refId);

-- Buscar tags por tipo
CREATE INDEX IX_Tag_Type ON Tag(type);

-- Filtrar YouTube por categoría
CREATE INDEX IX_YouTube_Categoria ON YouTube(category);

-- Ordenar por fecha de creación
CREATE INDEX IX_Anime_CreatedAt ON Anime(createdAt DESC);
CREATE INDEX IX_Hentai_CreatedAt ON Hentai(createdAt DESC);
CREATE INDEX IX_Series_CreatedAt ON Series(createdAt DESC);
CREATE INDEX IX_Jav_CreatedAt ON Jav(createdAt DESC);
CREATE INDEX IX_YouTube_CreatedAt ON YouTube(createdAt DESC);

-- Índices para Account
CREATE INDEX IX_Account_Type ON Account(type);
CREATE INDEX IX_AccountRelation_Parent ON AccountRelation(parentAccountId);
CREATE INDEX IX_AccountRelation_Child ON AccountRelation(childAccountId);
CREATE INDEX IX_AccountProperty_Account ON AccountProperty(accountId);

-- Índices para Money (Person, Payment)
CREATE INDEX IX_Payment_PersonId ON Payment(personId);
CREATE INDEX IX_Payment_Date ON Payment(date DESC);

-- Índices para Post
CREATE INDEX IX_Post_Category ON Post(category);
CREATE INDEX IX_Post_Slug ON Post(slug);
CREATE INDEX IX_Post_Date ON Post(date DESC);
CREATE INDEX IX_PostContent_PostId ON PostContent(postId);
CREATE INDEX IX_PostContentItem_PostContentId ON PostContentItem(postContentId);

-- Índices para TaskList y Task
CREATE INDEX IX_TaskList_Status ON TaskList(status);
CREATE INDEX IX_TaskList_CreatedAt ON TaskList(createdAt DESC);
CREATE INDEX IX_Task_TaskListId ON Task(taskListId);
CREATE INDEX IX_Task_Completed ON Task(completed);

-- Índices para Event
CREATE INDEX IX_Event_Type ON Event(type);
CREATE INDEX IX_Event_StartDate ON Event(startDate);
CREATE INDEX IX_Event_EndDate ON Event(endDate);
