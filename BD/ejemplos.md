# Ejemplos de Datos

## Anime (Lista de anime)
| id | title | image | episodes | status | createdAt |
|----|-------|-------|----------|--------|-----------|
| 1 | Shigatsu wa Kimi no Uso | https://cdn.myanimelist.net/images/anime/3/67177.jpg | 22 | 2 | 2025-01-15 14:30:25 |
| 2 | Steins;Gate | https://cdn.myanimelist.net/images/anime/5/73199.jpg | 24 | 1 | 2025-01-20 09:15:42 |

**Status:** 1=proximamente, 2=completado

---

## Hentai (Lista de hentai)
| id | title | image | episodes | status | createdAt |
|----|-------|-------|----------|--------|-----------|
| 1 | Overflow | https://example.com/overflow.jpg | 8 | 2 | 2025-01-10 20:45:10 |
| 2 | Kanojo x Kanojo x Kanojo | https://example.com/kxkxk.jpg | 3 | 1 | 2025-01-18 16:22:33 |

**Status:** 1=proximamente, 2=completado

---

## Series (Lista de series/películas)
| id | imdbId | title | image | year | rating | type | status | createdAt |
|----|--------|-------|-------|------|--------|------|--------|-----------|
| 1 | tt0124298 | Blast from the Past | https://m.media-amazon.com/images/M/MV5BODQ0ZmNk... | 1999 | 6.7 | movie | 1 | 2025-01-12 18:30:15 |
| 2 | tt0944947 | Game of Thrones | https://m.media-amazon.com/images/M/MV5BYTRiNDQ... | 2011 | 9.2 | series | 2 | 2025-01-05 22:10:48 |

**Status:** 1=proximamente, 2=completado

---

## Genre (Catálogo de géneros)
| id | name |
|----|------|
| 1 | Action |
| 2 | Romance |
| 3 | Comedy |
| 4 | Drama |
| 5 | Sci-Fi |

---

## HentaiGenre (Relación Hentai-Género)
| hentaiId | genreId |
|----------|---------|
| 1 | 2 |
| 1 | 3 |
| 2 | 2 |

---

## GirlGalery (Galería de chicas)
| id | name | createdAt |
|----|------|-----------|
| 1 | Yui Hatano | 2025-01-10 11:25:30 |
| 2 | Maria Ozawa | 2025-01-15 15:40:12 |
| 3 | Sasha Grey | 2025-01-20 09:55:45 |

---

## Media (Imágenes de GirlGalery)
| id | type | refId | url | thumbnail | deleteUrl | orderIndex | createdAt |
|----|------|-------|-----|-----------|-----------|------------|-----------|
| 1 | 1 | 1 | https://i.ibb.co/xxx/yui1.jpg | https://i.ibb.co/xxx/thumb.jpg | https://ibb.co/xxx/delete | 0 | 2025-01-10 11:26:15 |
| 2 | 1 | 1 | https://i.ibb.co/yyy/yui2.jpg | https://i.ibb.co/yyy/thumb.jpg | https://ibb.co/yyy/delete | 1 | 2025-01-10 11:27:42 |
| 3 | 1 | 2 | https://i.ibb.co/zzz/maria1.jpg | https://i.ibb.co/zzz/thumb.jpg | https://ibb.co/zzz/delete | 0 | 2025-01-15 15:41:20 |

**Type 1 = GirlGalery**  
**Ejemplo:** Yui Hatano (id=1) tiene 2 imágenes, Maria Ozawa (id=2) tiene 1 imagen

---

## AnimeGalery (Galería de imágenes de anime)
| id | name | createdAt |
|----|------|-----------|
| 1 | Shigatsu | 2025-01-12 16:30:00 |
| 2 | Konosuba | 2025-01-15 13:45:18 |
| 3 | Steins;Gate | 2025-01-18 19:20:55 |

---

## Media (Imágenes de AnimeGalery)
| id | type | refId | url | thumbnail | deleteUrl | orderIndex | createdAt |
|----|------|-------|-----|-----------|-----------|------------|-----------|
| 4 | 2 | 1 | https://i.ibb.co/aaa/shigatsu1.jpg | https://i.ibb.co/aaa/thumb.jpg | https://ibb.co/aaa/delete | 0 | 2025-01-12 16:31:20 |
| 5 | 2 | 1 | https://i.ibb.co/bbb/shigatsu2.jpg | https://i.ibb.co/bbb/thumb.jpg | https://ibb.co/bbb/delete | 1 | 2025-01-12 16:32:10 |
| 6 | 2 | 2 | https://i.ibb.co/ccc/konosuba1.jpg | https://i.ibb.co/ccc/thumb.jpg | https://ibb.co/ccc/delete | 0 | 2025-01-15 13:46:05 |

**Type 2 = AnimeGalery**  
**Ejemplo:** Shigatsu (id=1) tiene 2 imágenes, Konosuba (id=2) tiene 1 imagen

---

## Proyect (Galería de proyectos)
| id | name | description | url | createdAt |
|----|------|-------------|-----|-----------|
| 1 | Sistema de Ventas | user: admin@gmail.com\npassword: 123\n\nNET 9 \| ANGULAR 18 \| SQL | https://ventas.perfisoft.com | 2025-01-08 14:20:35 |
| 2 | Sistema de Reservas Hotel | PHP \| MYSQL\n\nuser: admin@gmail.com\npassword: 123456 | https://reserva.lltechnologyservicepr.com | 2025-01-10 10:15:22 |

---

## Media (Imágenes de Project)
| id | type | refId | url | thumbnail | deleteUrl | orderIndex | createdAt |
|----|------|-------|-----|-----------|-----------|------------|-----------|
| 7 | 3 | 1 | https://scontent.ftcq1-1.fna.fbcdn.net/v/t39... | NULL | NULL | 0 | 2025-01-08 14:22:10 |
| 8 | 3 | 1 | https://scontent.ftcq1-1.fna.fbcdn.net/v/t39... | NULL | NULL | 1 | 2025-01-08 14:22:45 |
| 9 | 3 | 2 | https://i.ibb.co/ddd/hotel1.jpg | https://i.ibb.co/ddd/thumb.jpg | https://ibb.co/ddd/delete | 0 | 2025-01-10 10:16:30 |

**Type 3 = Project**  
**Ejemplo:** Sistema de Ventas (id=1) tiene 2 imágenes, Sistema de Reservas (id=2) tiene 1 imagen

---

## Link (Enlaces de Project - url_extra)
| id | type | refId | name | url | orderIndex | createdAt |
|----|------|-------|------|-----|------------|-----------|
| 1 | 1 | 1 | NULL | https://www.facebook.com/61555695754588/videos/... | 0 | 2025-01-08 14:25:40 |
| 2 | 1 | 2 | NULL | https://www.youtube.com/watch?v=demo123 | 0 | 2025-01-10 10:18:15 |

**Type 1 = Project (url_extra)**  
**Ejemplo:** Sistema de Ventas (id=1) tiene 1 video de Facebook, Sistema de Reservas (id=2) tiene 1 video de YouTube

---

## Actress (Actrices JAV)
| id | name | image | createdAt |
|----|------|-------|-----------|
| 1 | Yuria Yoshine | https://example.com/yuria.jpg | 2025-01-15 12:00:00 |
| 2 | Ai Sayama | https://example.com/ai.jpg | 2025-01-16 14:30:25 |

---

## Link (Enlaces de Actress)
| id | type | refId | name | url | orderIndex | createdAt |
|----|------|-------|------|-----|------------|-----------|
| 12 | 5 | 1 | NULL | https://missav123.com/dm121/en/actresses/Yuria%20Yoshine | 0 | 2025-01-15 12:05:00 |
| 13 | 5 | 1 | NULL | https://www.instagram.com/yuriayoshine | 1 | 2025-01-15 12:06:00 |
| 14 | 5 | 2 | NULL | https://missav123.com/dm121/en/actresses/Ai%20Sayama | 0 | 2025-01-16 14:35:00 |

**Type 5 = Actress**  
**Ejemplo:** Yuria Yoshine (id=1) tiene 2 links (missav, Instagram)

---

## Link (Enlaces de Post)
| id | type | refId | name | url | orderIndex | createdAt |
|----|------|-------|------|-----|------------|-----------|
| 15 | 6 | 1 | PDF | https://online.fliphtml5.com/uejlb/wnsd/#p=1 | 0 | 2025-11-21 10:10:00 |
| 16 | 6 | 1 | github | https://github.com/erikuus/good-ui/blob/main/SUMMARY.md | 1 | 2025-11-21 10:11:00 |

**Type 6 = Post**  
**Ejemplo:** Post "Refactoring UI" (id=1) tiene 2 links (PDF, github)

---

## Jav (Videos JAV)
| id | code | actressId | image | status | createdAt |
|----|------|-----------|-------|--------|-----------|
| 1 | NIMA-055 | 1 | https://fourhoi.com/nima-055-uncensored-leak/cover-n.jpg | 1 | 2025-01-15 18:25:40 |
| 2 | SSIS-123 | 2 | https://example.com/ssis123.jpg | 2 | 2025-01-16 21:10:15 |

**Status:** 1=proximamente, 2=completado

---

## Link (Enlaces de Jav - streaming)
| id | type | refId | name | url | orderIndex | createdAt |
|----|------|-------|------|-----|------------|-----------|
| 3 | 2 | 1 | NULL | https://missav123.com/en/nima-055-uncensored-leak | 0 | 2025-01-15 18:30:12 |
| 4 | 2 | 1 | NULL | https://es.eporner.com/video-KxEjAYhz2dx/... | 1 | 2025-01-15 18:31:45 |
| 5 | 2 | 1 | NULL | https://es.xsz-av.com/video/202931 | 2 | 2025-01-15 18:32:20 |

**Type 2 = Jav (streaming)**  
**Ejemplo:** NIMA-055 (id=1) tiene 3 enlaces de streaming

---

## Link (Helpers - páginas útiles)
| id | type | refId | name | url | orderIndex | createdAt |
|----|------|-------|------|-----|------------|-----------|
| 6 | 3 | NULL | JAVLibrary | https://www.javlibrary.com | NULL | 2025-01-05 10:00:00 |
| 7 | 3 | NULL | JAVDatabase | https://www.javdatabase.com | NULL | 2025-01-05 10:05:30 |
| 8 | 3 | NULL | buscador | https://www5.javmost.com/search/advance | NULL | 2025-01-05 10:10:15 |

## Link (Enlaces de GirlGalery)
| id | type | refId | name | url | orderIndex | createdAt |
|----|------|-------|------|-----|------------|-----------|
| 9 | 4 | 1 | NULL | https://www.instagram.com/yuihatano | 0 | 2025-01-10 11:30:00 |
| 10 | 4 | 1 | NULL | https://twitter.com/yuihatano | 1 | 2025-01-10 11:31:00 |
| 11 | 4 | 2 | NULL | https://www.instagram.com/mariaozawa | 0 | 2025-01-15 15:45:00 |

**Type 4 = GirlGalery**  
**Ejemplo:** Yui Hatano (id=1) tiene 2 links (Instagram, Twitter)

---

## YouTube (Videos de YouTube)
| id | url | title | authorName | thumbnailUrl | category | createdAt |
|----|-----|-------|------------|--------------|----------|-----------|
| 1 | https://www.youtube.com/watch?v=ekr2nIex040 | ROSÉ & Bruno Mars - APT. | ROSÉ | https://i.ytimg.com/vi/ekr2nIex040/hqdefault.jpg | 1 | 2024-11-22 15:30:00 |
| 2 | https://www.youtube.com/watch?v=dQw4w9WgXcQ | Never Gonna Give You Up | Rick Astley | https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg | 4 | 2024-12-01 20:45:30 |

**Category:** 1=anime, 2=serie, 3=pelicula, 4=shorts

---

## Tag (Tags genéricos)
| id | name | type |
|----|------|------|
| 1 | Creampie | 1 |
| 2 | Big Tits | 1 |
| 3 | React | 2 |
| 4 | Angular | 2 |
| 5 | SQL Server | 2 |
| 6 | ui | 3 |
| 7 | diseño | 3 |
| 8 | hooks | 3 |

**Type:** 1=Jav, 2=Project, 3=Post

---

## TagRelation (Relación Tag-Entidad)
| tagId | refId | type |
|-------|-------|------|
| 1 | 1 | 1 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 1 | 2 |
| 5 | 1 | 2 |
| 6 | 1 | 3 |
| 7 | 1 | 3 |
| 8 | 2 | 3 |

**Type:** 1=Jav, 2=Project, 3=Post

**Ejemplo:** 
- El Jav con id=1 tiene los tags 1 y 2 (Creampie, Big Tits)  
- El Project con id=1 tiene los tags 3, 4 y 5 (React, Angular, SQL Server)
- El Post con id=1 tiene los tags 6 y 7 (ui, diseño)
- El Post con id=2 tiene el tag 8 (hooks)


---

## Seller (Vendedores)
| id | name | whatsapp | products | createdAt |
|----|------|----------|----------|-----------|
| 1 | Juan Pérez | +50912345678 | Laptops, Teclados, Mouse, Monitores, Cables HDMI, Webcams | 2025-01-10 10:00:00 |
| 2 | María García | +50987654321 | Celulares, Fundas, Protectores de pantalla, Audífonos, Cargadores | 2025-01-12 14:30:00 |
| 3 | Carlos López | +50911223344 | Componentes PC, RAM, SSD, Tarjetas gráficas, Fuentes de poder | 2025-01-15 09:15:00 |

**Ejemplo:** Juan Pérez vende laptops, teclados, mouse, etc. Su WhatsApp es +50912345678


---

## DotaHero (Héroes de Dota 2)
| id | name | image | createdAt |
|----|------|-------|-----------|
| 1 | Phantom Assassin | https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/phantom_assassin_full.png | 2025-01-10 10:00:00 |
| 2 | Invoker | https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/invoker_full.png | 2025-01-10 10:01:00 |
| 3 | Pudge | https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/pudge_full.png | 2025-01-10 10:02:00 |

---

## DotaTreasure (Cofres de Dota 2)
| id | name | image | imagePresentation | year | type | createdAt |
|----|------|-------|-------------------|------|------|-----------|
| 1 | Collector's Cache 2024 | https://example.com/cache2024.jpg | https://example.com/cache2024_pres.jpg | 2024 | NULL | 2025-01-10 11:00:00 |
| 2 | Collector's Cache 2024 I | https://example.com/cache2024_1.jpg | https://example.com/cache2024_1_pres.jpg | 2024 | 1 | 2025-01-10 11:05:00 |
| 3 | Collector's Cache 2024 II | https://example.com/cache2024_2.jpg | https://example.com/cache2024_2_pres.jpg | 2024 | 2 | 2025-01-10 11:10:00 |

**Type:** 1=Treasure I, 2=Treasure II, NULL=sin número

---

## DotaCache (Sets de cache)
| id | treasureId | heroId | name | photo | price | quantity | total | owner | createdAt |
|----|------------|--------|------|-------|-------|----------|-------|-------|-----------|
| 1 | 1 | 1 | Crimson Witness | https://example.com/set1.jpg | 15.50 | 2 | 31.00 | Juan | 2025-01-10 12:00:00 |
| 2 | 1 | 2 | Dark Artistry | https://example.com/set2.jpg | 25.00 | 1 | 25.00 | Maria | 2025-01-10 12:05:00 |
| 3 | 2 | 3 | Feast of Abscession | https://example.com/set3.jpg | 10.00 | 3 | 30.00 | Carlos | 2025-01-10 12:10:00 |

---

## DotaMedia (Fotos adicionales para cofres y cache)
| id | type | refId | url | orderIndex | createdAt |
|----|------|-------|-----|------------|-----------|
| 1 | 1 | 1 | https://example.com/treasure1_extra1.jpg | 0 | 2025-01-10 11:01:00 |
| 2 | 1 | 1 | https://example.com/treasure1_extra2.jpg | 1 | 2025-01-10 11:02:00 |
| 3 | 2 | 1 | https://example.com/set1_pub1.jpg | 0 | 2025-01-10 12:01:00 |
| 4 | 2 | 1 | https://example.com/set1_pub2.jpg | 1 | 2025-01-10 12:02:00 |
| 5 | 2 | 2 | https://example.com/set2_pub1.jpg | 0 | 2025-01-10 12:06:00 |

**Type:** 1=DotaTreasure, 2=DotaCache  
**Ejemplo:** 
- Cofre id=1 tiene 2 fotos adicionales en DotaMedia
- Cache id=1 (Crimson Witness) tiene 2 fotos publicadas en DotaMedia
- Cache id=2 (Dark Artistry) tiene 1 foto publicada en DotaMedia


---

## SteamItem (Catálogo de items de Steam - del buscador)
| id | name | image | price | game | marketUrl | status | createdAt |
|----|------|-------|-------|------|-----------|--------|-----------|
| 1 | Snakebite Case | https://community.cloudflare.steamstatic.com/economy/image/... | $0.64 | 2 | https://steamcommunity.com/market/listings/730/Snakebite%20Case | 1 | 2025-01-10 14:00:00 |
| 2 | Gallery Case | https://community.cloudflare.steamstatic.com/economy/image/... | $1.40 | 2 | https://steamcommunity.com/market/listings/730/Gallery%20Case | 2 | 2025-01-10 14:05:00 |
| 3 | Caja Croma 2 | https://community.fastly.steamstatic.com/economy/image/... | $17.40 | 2 | https://steamcommunity.com/market/listings/730/Chroma%202%20Case | 1 | 2025-01-10 14:10:00 |

**Game:** 1=dota2, 2=cs2  
**Status:** 1=historial (ya buscado), 2=por_comprar

---

## SteamItemDrop (Drops semanales - items que tengo)
| id | steamItemId | quantity | price | salePrice | total | createdAt |
|----|-------------|----------|-------|-----------|-------|-----------|
| 1 | 3 | 2 | 17.40 | 15.13 | 30.26 | 2025-01-10 15:00:00 |
| 2 | 1 | 5 | 0.64 | 0.55 | 2.75 | 2025-01-10 15:05:00 |
| 3 | 2 | 3 | 1.40 | 1.20 | 3.60 | 2025-01-10 15:10:00 |

**Ejemplo:** 
- Drop id=1 usa SteamItem id=3 (Caja Croma 2)
- Tengo 2 unidades, precio $17.40 c/u, venta $15.13 c/u
- Total: 2 × $15.13 = $30.26
- Para obtener nombre, image, url: JOIN con SteamItem

---

## SteamItemPurchase (Compras de items de Steam)
| id | steamItemId | purchasePrice | salePrice | profit | status | purchaseDate | saleDate | createdAt |
|----|-------------|---------------|-----------|--------|--------|--------------|----------|-----------|
| 1 | 4 | 72.82 | 0.00 | -72.82 | 1 | 2025-11-30 10:00:00 | NULL | 2025-11-30 10:00:00 |
| 2 | 5 | 50.00 | 65.00 | 15.00 | 2 | 2025-12-01 14:00:00 | 2025-12-15 16:30:00 | 2025-12-01 14:00:00 |
| 3 | 6 | 30.00 | 0.00 | -30.00 | 1 | 2025-12-10 09:00:00 | NULL | 2025-12-10 09:00:00 |

**Status:** 1=comprado, 2=vendido  
**Ejemplo:** 
- Compra id=1: Feast of Abscession comprado a $72.82, aún no vendido (ganancia -$72.82)
- Compra id=2: Item comprado a $50.00, vendido a $65.00 (ganancia +$15.00)
- Para obtener nombre, foto, link: JOIN con SteamItem


---

## Account (Cuentas genéricas - gestor de contraseñas)
| id | type | name | username | password | profileUrl | phoneNumber | recoveryEmail | lastConnection | createdAt |
|----|------|------|----------|----------|------------|-------------|---------------|----------------|-----------|
| 1 | 1 | Principal | juan@gmail.com | gmailpass123 | NULL | +50912345678 | juan.recovery@gmail.com | NULL | 2025-01-10 10:00:00 |
| 2 | 2 | Main | juangamer | steampass456 | https://steamcommunity.com/id/juangamer | +50912345678 | NULL | 2025-01-15 10:00:00 | 2025-01-10 10:30:00 |
| 3 | 3 | Personal | juan@gmail.com | fbpass789 | https://facebook.com/juanprofile | NULL | NULL | 2025-01-14 18:30:00 | 2025-01-10 11:00:00 |
| 4 | 4 | Main | @juanig | igpass111 | https://instagram.com/juanig | NULL | NULL | 2025-01-16 09:15:00 | 2025-01-10 11:30:00 |
| 5 | 1 | Secundario | juan2@gmail.com | gmail2pass | NULL | +50987654321 | juan@gmail.com | NULL | 2025-01-11 09:00:00 |
| 6 | 2 | Segunda | juanalt | steamalt222 | https://steamcommunity.com/id/juanalt | NULL | NULL | 2025-01-20 14:30:00 | 2025-01-11 09:30:00 |
| 7 | 5 | Main | JuanLOL | lolpass333 | https://lol.com/profile/juanlol | NULL | NULL | 2025-01-18 20:00:00 | 2025-01-11 10:00:00 |

**Type:** 1=Email, 2=Steam, 3=Facebook, 4=Instagram, 5=Game, 6=Other  
**Name:** Main, Segunda, Tercera, Principal, Secundario, etc.  
**profileUrl:** URL del perfil (Steam, Facebook, Instagram, LOL, etc.)  
**lastConnection:** Para cualquier tipo de cuenta, se actualiza al conectarse

---

## AccountRelation (Relaciones entre cuentas)
| id | parentAccountId | childAccountId | createdAt |
|----|-----------------|----------------|-----------|
| 1 | 1 | 2 | 2025-01-10 10:31:00 |
| 2 | 1 | 3 | 2025-01-10 11:01:00 |
| 3 | 1 | 4 | 2025-01-10 11:31:00 |
| 4 | 5 | 6 | 2025-01-11 09:31:00 |
| 5 | 1 | 7 | 2025-01-11 10:01:00 |

**Ejemplo:** 
- Email Principal (id=1) es padre de: Steam Main, Facebook, Instagram, LOL
- Email Secundario (id=5) es padre de: Steam Segunda

---

## AccountProperty (Propiedades adicionales - solo booleanos para Steam)
| id | accountId | key | value | createdAt |
|----|-----------|-----|-------|-----------|
| 1 | 2 | 1 | 1 | 2025-01-10 10:33:00 |
| 2 | 2 | 2 | 1 | 2025-01-10 10:34:00 |
| 3 | 2 | 3 | 1 | 2025-01-10 10:35:00 |
| 4 | 2 | 4 | 0 | 2025-01-10 10:36:00 |
| 5 | 6 | 1 | 1 | 2025-01-11 09:33:00 |
| 6 | 6 | 2 | 0 | 2025-01-11 09:34:00 |
| 7 | 6 | 4 | 0 | 2025-01-11 09:35:00 |

**Key (CHAR):** 1=hasDota2, 2=hasCS2, 3=hasSteamMobile, 4=vacBanned  
**Value (BIT):** 0=false, 1=true

---

## Estructura de relaciones:

```
Account (Email Principal - juan@gmail.com)
├── Account (Steam Main - juangamer)
│   │   profileUrl: https://steamcommunity.com/id/juangamer
│   │   lastConnection: 2025-01-15 10:00:00
│   ├── AccountProperty (key=1 hasDota2: 1)
│   ├── AccountProperty (key=2 hasCS2: 1)
│   ├── AccountProperty (key=3 hasSteamMobile: 1)
│   └── AccountProperty (key=4 vacBanned: 0)
├── Account (Facebook Personal)
│   │   profileUrl: https://facebook.com/juanprofile
│   │   lastConnection: 2025-01-14 18:30:00
├── Account (Instagram Main)
│   │   profileUrl: https://instagram.com/juanig
│   │   lastConnection: 2025-01-16 09:15:00
└── Account (LOL Main)
    │   profileUrl: https://lol.com/profile/juanlol
    │   lastConnection: 2025-01-18 20:00:00

Account (Email Secundario - juan2@gmail.com)
└── Account (Steam Segunda - juanalt)
    │   profileUrl: https://steamcommunity.com/id/juanalt
    │   lastConnection: 2025-01-20 14:30:00
    ├── AccountProperty (key=1 hasDota2: 1)
    ├── AccountProperty (key=2 hasCS2: 0)
    └── AccountProperty (key=4 vacBanned: 0)
```

**Actualizar última conexión:**
```sql
UPDATE Account SET lastConnection = GETDATE() WHERE id = 2
```


---

## Person (Personas para control de dinero)
| id | name | createdAt |
|----|------|-----------|
| 1 | Rosa | 2025-01-10 10:00:00 |
| 2 | Juan | 2025-01-12 14:00:00 |
| 3 | María | 2025-01-15 09:00:00 |

---

## Transaction (Transacciones de dinero)
| id | personId | type | amount | description | date | createdAt |
|----|----------|------|--------|-------------|------|-----------|
| 1 | 1 | 1 | 1170.00 | total | 2025-11-23 | 2025-11-23 10:00:00 |
| 2 | 1 | 2 | 570.00 | | 2025-11-23 | 2025-11-23 15:00:00 |
| 3 | 1 | 2 | 50.00 | | 2025-12-19 | 2025-12-19 12:00:00 |
| 4 | 1 | 2 | 50.00 | | 2026-01-17 | 2026-01-17 14:00:00 |
| 5 | 2 | 1 | 500.00 | préstamo | 2025-12-01 | 2025-12-01 10:00:00 |
| 6 | 2 | 3 | 25.00 | interés 5% | 2025-12-15 | 2025-12-15 10:00:00 |

**Type:** 1=deuda, 2=pago, 3=interes_deuda, 4=interes_pago

**Ejemplo:** 
- Rosa (id=1) tiene deuda de 1170, ha pagado 570 + 50 + 50 = 670, debe 500
- Juan (id=2) tiene deuda de 500 + interés de 25 = 525

---

## Salary (Configuración de sueldo)
| id | currentMoney | grossSalary | afpDiscount | firstFortnightNet | secondFortnightNet | cts | bonus | createdAt |
|----|--------------|-------------|-------------|-------------------|--------------------|----|-------|-----------|
| 1 | 5000.00 | 3000.00 | 390.00 | 1200.00 | 1410.00 | 1500.00 | 1500.00 | 2025-01-01 10:00:00 |

**Registras una sola vez y calculas:**

**Cálculos automáticos:**
```sql
-- Sueldo mensual neto
SELECT (firstFortnightNet + secondFortnightNet) as sueldoMensual FROM Salary

-- Cuánto ganaré en X meses (sin CTS ni bonus)
SELECT (firstFortnightNet + secondFortnightNet) * 3 as ganancia3Meses FROM Salary
SELECT (firstFortnightNet + secondFortnightNet) * 6 as ganancia6Meses FROM Salary
SELECT (firstFortnightNet + secondFortnightNet) * 12 as ganancia12Meses FROM Salary

-- Cuánto ganaré en 1 año (con CTS y bonus)
SELECT 
    (firstFortnightNet + secondFortnightNet) * 12 as sueldoAnual,
    cts * 2 as ctsAnual,
    bonus * 2 as bonusAnual,
    ((firstFortnightNet + secondFortnightNet) * 12) + (cts * 2) + (bonus * 2) as totalAnual
FROM Salary

-- Cuánto ganaré en 16 meses (con CTS y bonus proporcional)
SELECT 
    (firstFortnightNet + secondFortnightNet) * 16 as sueldo16Meses,
    cts * FLOOR(16/6.0) as ctsProporcional,  -- CTS cada 6 meses
    bonus * FLOOR(16/6.0) as bonusProporcional,  -- Bonus cada 6 meses
    ((firstFortnightNet + secondFortnightNet) * 16) + 
    (cts * FLOOR(16/6.0)) + 
    (bonus * FLOOR(16/6.0)) as total16Meses
FROM Salary
```

**Ejemplo con tus datos:**
- Sueldo mensual: 1200 + 1410 = **2,610**
- 3 meses: 2,610 × 3 = **7,830**
- 6 meses: 2,610 × 6 = **15,660** + CTS (1,500) + Bonus (1,500) = **18,660**
- 12 meses: 2,610 × 12 = **31,320** + CTS×2 (3,000) + Bonus×2 (3,000) = **37,320**
- 16 meses: 2,610 × 16 = **41,760** + CTS×2 (3,000) + Bonus×2 (3,000) = **47,760**

**Solo actualizas Salary cuando:**
- Cambia tu sueldo
- Cambia el descuento AFP
- Actualizas tu dinero actual (currentMoney)


---

## Post (Publicaciones/Manuales)
| id | title | description | category | subcategory | slug | date | createdAt |
|----|-------|-------------|----------|-------------|------|------|-----------|
| 1 | Refactoring UI | Manual de diseño UI | 4 | UIUX | refactoring-ui | 2025-11-21 | 2025-11-21 10:00:00 |
| 2 | React Hooks Guide | Guía completa de hooks | 1 | React | react-hooks-guide | 2025-12-01 | 2025-12-01 14:00:00 |

**Category:** 1=Frontend, 2=Backend, 3=Mobile, 4=Diseño, 5=Base de Datos, 6=Utilidades, 7=ORM, 8=Fullstack

**Tags:** Se usan Tag (type=3) y TagRelation (type=3)

---

## PostContent (Bloques de contenido)
| id | postId | type | text | language | url | alt | orderIndex | createdAt |
|----|--------|------|------|----------|-----|-----|------------|-----------|
| 1 | 1 | 4 | NULL | NULL | https://example.com/ui-image.jpg | UI Design | 0 | 2025-11-21 10:05:00 |
| 2 | 1 | 1 | Introducción al diseño UI | NULL | NULL | NULL | 1 | 2025-11-21 10:06:00 |
| 3 | 1 | 2 | El diseño UI es fundamental... | NULL | NULL | NULL | 2 | 2025-11-21 10:07:00 |
| 4 | 1 | 3 | const theme = { colors: {...} } | javascript | NULL | NULL | 3 | 2025-11-21 10:08:00 |
| 5 | 1 | 5 | NULL | NULL | NULL | NULL | 4 | 2025-11-21 10:09:00 |

**Type:** 1=titulo, 2=parrafo, 3=codigo, 4=imagen, 5=lista

---

## PostContentItem (Items de lista)
| id | postContentId | text | orderIndex |
|----|---------------|------|------------|
| 1 | 5 | Usar colores consistentes | 0 |
| 2 | 5 | Mantener espaciado uniforme | 1 |
| 3 | 5 | Jerarquía visual clara | 2 |

**Ejemplo:** PostContent id=5 (tipo lista) tiene 3 items

---

## PostLink (Enlaces externos)
| id | postId | name | url | orderIndex | createdAt |
|----|--------|------|-----|------------|-----------|
| 1 | 1 | PDF | https://online.fliphtml5.com/uejlb/wnsd/#p=1 | 0 | 2025-11-21 10:10:00 |
| 2 | 1 | github | https://github.com/erikuus/good-ui/blob/main/SUMMARY.md | 1 | 2025-11-21 10:11:00 |

---

## Estructura de una publicación:

```
Post (Refactoring UI)
├── TagRelation → Tag (ui)
├── TagRelation → Tag (diseño)
├── PostContent (type=4 imagen)
├── PostContent (type=1 titulo: "Introducción al diseño UI")
├── PostContent (type=2 parrafo: "El diseño UI es fundamental...")
├── PostContent (type=3 codigo: "const theme = {...}")
├── PostContent (type=5 lista)
│   ├── PostContentItem ("Usar colores consistentes")
│   ├── PostContentItem ("Mantener espaciado uniforme")
│   └── PostContentItem ("Jerarquía visual clara")
├── Link (type=6 PDF)
└── Link (type=6 github)
```

**Consultas útiles:**
```sql
-- Obtener publicación completa
SELECT * FROM Post WHERE slug = 'refactoring-ui'

-- Obtener tags de una publicación
SELECT t.name FROM Tag t
JOIN TagRelation tr ON t.id = tr.tagId
WHERE tr.refId = 1 AND tr.type = '3'

-- Obtener contenido ordenado
SELECT * FROM PostContent WHERE postId = 1 ORDER BY orderIndex

-- Obtener items de una lista
SELECT text FROM PostContentItem WHERE postContentId = 5 ORDER BY orderIndex

-- Obtener enlaces
SELECT name, url FROM Link WHERE refId = 1 AND type = '6' ORDER BY orderIndex

-- Buscar por categoría
SELECT * FROM Post WHERE category = '4' ORDER BY date DESC

-- Buscar por tag
SELECT DISTINCT p.* FROM Post p
JOIN TagRelation tr ON p.id = tr.refId AND tr.type = '3'
JOIN Tag t ON tr.tagId = t.id
WHERE t.name = 'ui' AND t.type = '3'
```
