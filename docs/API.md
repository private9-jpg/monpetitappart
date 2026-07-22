# API Documentation

Base URL: `http://localhost:3000/api`

## Authentification

Toutes les routes protégées nécessitent un cookie `auth_token` ou un header `Authorization: Bearer <token>`.

## Endpoints

### Articles

| Method | Path | Accès | Description |
|---|---|---|---|
| GET | `/api/articles` | Public | Liste des articles publiés |
| POST | `/api/articles` | ADMIN, EDITOR, WRITER | Créer un article |
| GET | `/api/articles/[slug]` | Public | Détail d'un article |
| PATCH | `/api/articles/[slug]` | ADMIN, EDITOR, WRITER | Modifier un article |
| DELETE | `/api/articles/[slug]` | ADMIN | Supprimer un article |

**Query params (GET /api/articles)**
- `status` (string) - Filtrer par statut
- `type` (string) - Filtrer par type (GUIDE, BLOG, etc.)
- `authorId` (string) - Filtrer par auteur
- `limit` (number, default: 20, max: 100)

### Catégories

| Method | Path | Accès | Description |
|---|---|---|---|
| GET | `/api/categories` | Public | Liste des catégories |
| POST | `/api/categories` | ADMIN, EDITOR | Créer une catégorie |
| GET | `/api/categories/[slug]` | Public | Détail d'une catégorie |
| PATCH | `/api/categories/[slug]` | ADMIN, EDITOR | Modifier une catégorie |
| DELETE | `/api/categories/[slug]` | ADMIN | Supprimer une catégorie |

### Produits

| Method | Path | Accès | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Liste des produits publiés |
| POST | `/api/products` | ADMIN, EDITOR, WRITER | Créer un produit |
| GET | `/api/products/[slug]` | Public | Détail d'un produit |
| PATCH | `/api/products/admin/[slug]` | ADMIN, EDITOR | Modifier/publier/archiver un produit |
| DELETE | `/api/products/admin/[slug]` | ADMIN | Supprimer un produit |
| GET | `/api/products/admin` | ADMIN, EDITOR | Liste admin de tous les produits |
| GET | `/api/products/count` | Public | Nombre total de produits |

### Recherche

| Method | Path | Accès | Description |
|---|---|---|---|
| GET | `/api/search?q=<query>` | Public | Recherche full-text articles + produits |

**Query params**
- `q` (string, required) - Terme de recherche
- `limit` (number, default: 20, max: 50)

### Commentaires

| Method | Path | Accès | Description |
|---|---|---|---|
| GET | `/api/comments` | ADMIN, EDITOR, MODERATOR | Liste des commentaires |
| POST | `/api/comments` | Public (rate-limited) | Créer un commentaire |
| PATCH | `/api/comments/[id]` | ADMIN, EDITOR, MODERATOR | Modérer un commentaire |
| DELETE | `/api/comments/[id]` | ADMIN | Supprimer un commentaire |
| POST | `/api/comments/[id]` | Authentifié | Signaler un commentaire |

### Newsletter

| Method | Path | Accès | Description |
|---|---|---|---|
| POST | `/api/newsletter` | Public (rate-limited) | S'abonner / se désabonner |

### Dashboard

| Method | Path | Accès | Description |
|---|---|---|---|
| GET | `/api/dashboard` | ADMIN, EDITOR, ANALYST | Statistiques et KPIs |

**Réponse**
```json
{
  "stats": { "users": 2, "products": { "total": 5, "published": 5 }, ... },
  "recentActivity": { "recentProducts": [], "recentArticles": [], ... },
  "topContent": { "topProducts": [], "topArticles": [] }
}
```

### Authentification

| Method | Path | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Connexion email/mot de passe + 2FA |
| POST | `/api/auth/register` | ADMIN | Créer un utilisateur |
| GET | `/api/auth/me` | Authentifié | Profil utilisateur courant |
| POST | `/api/auth/logout` | Authentifié | Déconnexion |
| POST | `/api/auth/2fa/setup` | Authentifié | Générer secret 2FA |
| POST | `/api/auth/2fa/verify` | Authentifié | Activer 2FA |
| POST | `/api/auth/2fa/disable` | Authentifié | Désactiver 2FA |

## Codes de réponse

- `200 OK` - Succès
- `201 Created` - Ressource créée
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Non authentifié
- `403 Forbidden` - Accès refusé
- `404 Not Found` - Ressource introuvable
- `409 Conflict` - Conflit (ex: slug existant)
- `429 Too Many Requests` - Rate limit dépassé
- `500 Internal Server Error` - Erreur serveur

## Sécurité

- HTTPS obligatoire en production
- Cookies `httpOnly`, `sameSite: "lax"`
- Rate limiting sur toutes les API publiques
- Validation et sanitization de toutes les entrées
- Audit log sur toutes les actions sensibles
- CSP, X-Frame-Options, X-XSS-Protection headers

## Affiliation

| Method | Path | Accès | Description |
|---|---|---|---|
| GET | `/api/go/[slug]` | Public | Redirection 302 avec tracking |
| POST | `/api/go/[slug]` | Public | JSON redirect avec tracking |
| GET | `/api/affiliates?product=<slug>&link=<id>` | Public | Redirection legacy (302) |
| GET | `/api/affiliates/clicks` | ADMIN, EDITOR | Top 20 liens par clics |
| GET | `/api/affiliates/health` | ADMIN, EDITOR | Vérification santé des liens |
| GET | `/api/conversions` | ADMIN, EDITOR, ANALYST | Stats revenus |
| POST | `/api/conversions` | ADMIN, EDITOR | Créer une conversion |
| PATCH | `/api/conversions/[id]` | ADMIN | Mettre à jour statut conversion |
| GET | `/api/prices` | ADMIN, EDITOR, ANALYST | Historique des prix |
| POST | `/api/prices` | ADMIN, EDITOR | Enregistrer un prix |

## Codes de réponse

- `200 OK` - Succès
- `201 Created` - Ressource créée
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Non authentifié
- `403 Forbidden` - Accès refusé
- `404 Not Found` - Ressource introuvable
- `409 Conflict` - Conflit (ex: slug existant)
- `429 Too Many Requests` - Rate limit dépassé
- `500 Internal Server Error` - Erreur serveur
