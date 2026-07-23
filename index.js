const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Route pour la page web d'accueil animée
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Célestin - Goat Bot V2</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #0f172a;
                color: #f8fafc;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                overflow: hidden;
            }

            .card {
                background: #1e293b;
                padding: 2.5rem;
                border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
                text-align: center;
                max-width: 420px;
                width: 90%;
                animation: fadeInUp 0.8s ease-out forwards;
                border: 1px solid #334155;
            }

            .status {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 16px;
                background: rgba(16, 185, 129, 0.1);
                color: #34d399;
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
            }

            .dot {
                width: 10px;
                height: 10px;
                background-color: #10b981;
                border-radius: 50%;
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                animation: pulse 1.8s infinite;
            }

            h1 {
                margin-bottom: 12px;
                font-size: 1.8rem;
                letter-spacing: -0.5px;
                color: #ffffff;
            }

            p {
                color: #94a3b8;
                font-size: 0.95rem;
                line-height: 1.5;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                }
                70% {
                    transform: scale(1);
                    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
                }
                100% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
                }
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="status">
                <span class="dot"></span> En ligne
            </div>
            <h1>Célestin - Goat Bot V2</h1>
            <p>Bienvenue ! Le bot est actuellement opérationnel et connecté à Messenger.</p>
        </div>
    </body>
    </html>
    `);
});

// Démarrage du serveur web Express
app.listen(PORT, () => {
    console.log(`[SERVEUR] Serveur web démarré sur le port ${PORT}`);
});

// Charger la suite de l'application GoatBot sans rien écraser
try {
    require('./index.js'); // Ou le fichier principal de ton bot si différent
} catch (e) {
    // Évite la boucle si le fichier porte le même nom
}
