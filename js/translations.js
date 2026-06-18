/* --- LOCALIZATION DICTIONARY (FRENCH / ENGLISH) --- */

const TRANSLATIONS = {
    fr: {
        // --- TOP status bar HUD ---
        club_league_amateur: "4ème Division - Amateur",
        club_league_pro: "3ème Division - Pro",
        club_league_elite: "2ème Division - Élite",
        club_league_champions: "1ère Division - Ligue des Champions",
        treasury_title: "TRÉSORERIE DU CLUB",
        btn_tuto: "❓ TUTO",
        btn_info: "ℹ️ INFO",
        btn_stats: "📊 PROGRES",
        btn_prestige: "🏆 REBIRTH",
        btn_sound_on: "🔊 SON",
        btn_sound_off: "🔇 SON",
        btn_wipe: "WIPE 🗑️",
        btn_lang: "🌐 FR",

        // --- Column 1: Active stadium clicker ---
        active_stadium_header: "STADE & INVESTISSEMENT ACTIFS",
        click_instructions: "CLIQUEZ SUR LE STADE POUR INJECTER DES FONDS",
        click_value_label: "Valeur du clic : +",

        // --- Column 2: Mercato shop & deck ---
        transfer_market_header: "MARCHÉ DES TRANSFERTS (MERCATO)",
        booster_purchase_title: "ACHAT DE PACKS DE JOUEURS",
        pack_recrue_title: "Pack Recrue",
        pack_pro_title: "Pack Pro",
        pack_legende_title: "Pack Légende",
        your_squad_title: "VOTRE EFFECTIF",
        global_boost_label: "Boost Global : ",

        // --- Column 3: Upgrades ---
        upgrades_header: "INFRASTRUCTURES & COMMERCES",

        // --- UPGRADE NAMES ---
        up_hotdog_stand: "Stand de Hot-Dogs",
        up_parking_lot: "Parking du Stade",
        up_club_shop: "Boutique Officielle",
        up_ticket_office: "Guichets Billetterie",
        up_vip_boxes: "Loges VIP Privées",
        up_stadium_naming: "Naming du Stade",
        up_tv_rights: "Droits de Télédiffusion",
        up_crypto_sponsor: "Sponsor Crypto Majeur",

        // --- UPGRADE CARD LABELS ---
        invest_label: "INVESTIR :",
        per_second: "par seconde",

        // --- TUTORIAL MODAL ---
        tuto_title: "BIENVENUE AU BILLIONAIRE FC ! 🏟️",
        tuto_subtitle: "GUIDE DE DÉMARRAGE RAPIDE",
        tuto_step1_title: "Injetez des fonds actifs ⚽",
        tuto_step1_text: "Cliquez de manière répétée sur le Stade à gauche pour générer activement de l'argent de départ.",
        tuto_step2_title: "Automatisez vos revenus 🌭",
        tuto_step2_text: "Achetez des infrastructures à droite (stands, boutiques, billetterie) pour générer automatiquement du cash par seconde ($ / sec).",
        tuto_step3_title: "Recrutez des Superstars 📦",
        tuto_step3_text: "Achetez des Packs dans le Mercato pour collectionner des cartes holographiques 3D. Chaque joueur ou doublon augmente de manière colossale et permanente tous vos revenus !",
        tuto_step4_title: "Devenez Milliardaire 🏆",
        tuto_step4_text: "Grimpez les divisions mondiales jusqu'à posséder un empire et régner sur la planète foot !",
        tuto_close_btn: "C'EST PARTI, ENTRER SUR LE TERRAIN ! 🚀",

        // --- INFO / ENCYCLOPEDIA MODAL ---
        info_title: "ℹ️ ENCYCLOPÉDIE ET PROBABILITÉS",
        info_subtitle: "DÉTAILS DES INFRASTRUCTURES ET DES PACKS",
        info_rates_title: "📊 PROBABILITÉS DE TIRAGE DES BOOSTER PACKS :",
        info_rates_th1: "Pack",
        info_rates_th2: "Commun",
        info_rates_th3: "Rare",
        info_rates_th4: "Épique",
        info_rates_th5: "Légendaire",
        info_rates_recrue: "📦 Recrue ($50.00k)",
        info_rates_pro: "🥈 Pro ($1.00M)",
        info_rates_legende: "⭐ Légende ($500.00M)",
        info_album_title: "📋 ALBUM & BONUS DES JOUEURS (24)",
        info_album_text: "Chaque doublon augmente le niveau du joueur et cumule son boost global de revenus.",
        info_legendary_title: "👑 LÉGENDAIRE (+45% à +100% / niveau)",
        info_legendary_pele: "Pelé (AT, +100% / nv) - Le Roi du football mondial.",
        info_legendary_zidane: "Z. Zidane (MD, +80% / nv) - Maestro de l'élégance suprême.",
        info_legendary_messi: "L. Messi (AT, +60% / nv) - L'extraterrestre, octuple Ballon d'Or.",
        info_legendary_ronaldo: "C. Ronaldo (AT, +60% / nv) - Athlète ultime des records.",
        info_legendary_haaland: "E. Haaland (AT, +45% / nv) - Cyborg scandinave.",
        info_legendary_mbappe: "K. Mbappé (AT, +45% / nv) - Comète fulgurante de Bondy.",
        info_epic_title: "💜 ÉPIQUE (+15% à +30% / niveau)",
        info_epic_text: "De Bruyne (MD, +30%), Salah (AT, +30%), Kane (AT, +30%), Courtois (GB, +25%), Dias (DC, +20%), Saka (AT, +15%).",
        info_rare_title: "💙 RARE (+8% à +12% / niveau)",
        info_rare_text: "Bellingham (MD, +12%), Modric (MD, +12%), Griezmann (AT, +10%), Vinicius Jr (AT, +10%), Son (AT, +8%), Ronaldinho (Carte Secrète, +120%).",
        info_common_title: "💚 COMMUN (+2% à +5% / niveau)",
        info_common_text: "6 autres joueurs professionnels fidèles assurant l'ossature solide de votre effectif.",
        info_close_btn: "RETOURNER AU STADE",

        // --- STATS MODAL ---
        stats_title: "CONTRÔLEUR DE PROGRÈS",
        stats_subtitle: "STATISTIQUES DU CLUB",
        stats_earned: "Argent total accumulé",
        stats_clicks: "Nombre total de clics",
        stats_packs_bronze: "Packs Recrue ouverts",
        stats_packs_silver: "Packs Pro ouverts",
        stats_packs_gold: "Packs Légende ouverts",
        stats_seasons: "Saisons Rebirth (🏆)",
        stats_close_btn: "RETOURNER AU STADE",

        // --- REBIRTH LOCKED MODAL ---
        rl_title: "🏆 REBIRTH DE SAISON INDISPONIBLE",
        rl_subtitle: "IL VOUS MANQUE ENCORE DES FONDS",
        rl_p1: "Pour réinitialiser la saison, obtenir une Coupe de Prestige et doubler de manière permanente tous vos gains, vous devez disposer d'au moins <strong>$1.00B</strong> de trésorerie.",
        rl_missing_label: "Trésorerie manquante :",
        rl_benefits_title: "🎁 AVANTAGES DU REBIRTH :",
        rl_benefit1: "🏆 <strong>Multiplicateur de Prestige :</strong> Chaque Rebirth vous confère +100% de revenus globaux cumulables à vie !",
        rl_benefit2: "🃏 <strong>Effectif sécurisé :</strong> Vous conservez TOUTES vos cartes de joueurs holographiques durement gagnées et leurs niveaux.",
        rl_benefit3: "📈 <strong>Croissance démultipliée :</strong> Repartez sur une nouvelle saison et pulvérisez tous vos records à vitesse grand V.",
        rl_close_btn: "RETOURNER AU STADE 🚀",

        // --- REBIRTH CONFIRMATION MODAL ---
        rc_title: "🏆 REBIRTH DE SAISON !",
        rc_subtitle: "ÊTES-VOUS PRÊT À TOUT RECOMMENCER ?",
        rc_p1: "Êtes-vous prêt à réinitialiser votre trésorerie et vos infrastructures de club pour obtenir une Coupe de Prestige permanente ?",
        rc_benefits_title: "🎁 AVANTAGES ET CONSÉQUENCES :",
        rc_benefit1: "🏆 <strong>Multiplicateur de Prestige :</strong> Vous gagnerez +100% de bonus permanent cumulable sur TOUTES vos rentrées d'argent (clics et passifs).",
        rc_benefit2: "🃏 <strong>Effectif sécurisé :</strong> Vous conservez l'intégralité de vos cartes de joueurs holographiques et leurs niveaux !",
        rc_benefit3: "📉 <strong>Réinitialisation :</strong> Votre trésorerie et les niveaux de vos infrastructures repassent à 0.",
        rc_yes_btn: "OUI, REBORN ! 🏆",
        rc_no_btn: "ANNULER ❌",

        // --- GAME OVER / OUTCOME MODALS ---
        outcome_close_btn: "RETOURNER AU STADE 🚀",

        // --- CARD DETAIL VIEWER ---
        card_position: "Poste :",
        card_level: "Niveau de carte :",
        card_boost: "Apport au Club :",
        card_bio_title: "BIOGRAPHIE DU JOUEUR",
        card_detail_close_btn: "RETOURNER AU STADE",

        // --- PENALTY MODAL ---
        penalty_title: "⚽ PENALTY DÉCISIF !",
        penalty_shoot_btn: "FRAPPER LE BALLON ! ⚡",

        // --- PRESS MODAL ---
        press_title: "🎤 CONFÉRENCE DE PRESSE PIÉGÉE",
        press_subtitle: "RÉPONDEZ AUX JOURNALISTES",
        press_choice_a_tag: "Option A (Diplomate) 🤝",
        press_choice_b_tag: "Option B (Arrogante) 💰",

        // --- AUDIT MODAL ---
        audit_title: "💼 CONTRÔLE DU FAIR-PLAY FINANCIER",
        audit_start_btn: "LANCER LA FALSIFICATION ! ✍️"
    },
    en: {
        // --- TOP status bar HUD ---
        club_league_amateur: "4th Division - Amateur",
        club_league_pro: "3rd Division - Pro",
        club_league_elite: "2nd Division - Elite",
        club_league_champions: "1st Division - Champions League",
        treasury_title: "CLUB TREASURY",
        btn_tuto: "❓ TUTO",
        btn_info: "ℹ️ INFO",
        btn_stats: "📊 STATS",
        btn_prestige: "🏆 REBIRTH",
        btn_sound_on: "🔊 SOUND",
        btn_sound_off: "🔇 SOUND",
        btn_wipe: "WIPE 🗑️",
        btn_lang: "🌐 EN",

        // --- Column 1: Active stadium clicker ---
        active_stadium_header: "ACTIVE STADIUM & INVESTMENTS",
        click_instructions: "CLICK THE STADIUM TO GENERATE FUNDS",
        click_value_label: "Click Value: +",

        // --- Column 2: Mercato shop & deck ---
        transfer_market_header: "TRANSFER MARKET (MERCATO)",
        booster_purchase_title: "BUY PLAYER BOOSTER PACKS",
        pack_recrue_title: "Recruit Pack",
        pack_pro_title: "Pro Pack",
        pack_legende_title: "Legend Pack",
        your_squad_title: "YOUR ROSTER",
        global_boost_label: "Global Boost: ",

        // --- Column 3: Upgrades ---
        upgrades_header: "INFRASTRUCTURES & COMMERCE",

        // --- UPGRADE NAMES ---
        up_hotdog_stand: "Hot-Dog Stand",
        up_parking_lot: "Stadium Parking",
        up_club_shop: "Official Club Shop",
        up_ticket_office: "Ticket Windows",
        up_vip_boxes: "Private VIP Boxes",
        up_stadium_naming: "Stadium Naming",
        up_tv_rights: "Broadcasting Rights",
        up_crypto_sponsor: "Crypto Shirt Sponsor",

        // --- UPGRADE CARD LABELS ---
        invest_label: "INVEST:",
        per_second: "per second",

        // --- TUTORIAL MODAL ---
        tuto_title: "WELCOME TO BILLIONAIRE FC! 🏟️",
        tuto_subtitle: "QUICK START GUIDE",
        tuto_step1_title: "Inject active funds ⚽",
        tuto_step1_text: "Click repeatedly on the Stadium on the left to actively generate your starting cash.",
        tuto_step2_title: "Automate your income 🌭",
        tuto_step2_text: "Buy facilities on the right (stands, shops, tickets) to automatically generate cash per second ($ / sec).",
        tuto_step3_title: "Recruit Superstars 📦",
        tuto_step3_text: "Buy Packs in the Mercato to collect 3D holographic cards. Each player or duplicate increases all income colossally and permanently!",
        tuto_step4_title: "Become a Billionaire 🏆",
        tuto_step4_text: "Climb the global divisions until you own a massive empire and reign over the football world!",
        tuto_close_btn: "LET'S PLAY, KICK OFF! 🚀",

        // --- INFO / ENCYCLOPEDIA MODAL ---
        info_title: "ℹ️ ENCYCLOPEDIA & PROBABILITIES",
        info_subtitle: "INFRASTRUCTURES AND PACK RATES IN DETAIL",
        info_rates_title: "📊 BOOSTER PACK DROP PROBABILITIES:",
        info_rates_th1: "Pack",
        info_rates_th2: "Common",
        info_rates_th3: "Rare",
        info_rates_th4: "Epic",
        info_rates_th5: "Legendary",
        info_rates_recrue: "📦 Recruit ($50.00k)",
        info_rates_pro: "🥈 Pro ($1.00M)",
        info_rates_legende: "⭐ Legend ($500.00M)",
        info_album_title: "📋 ALBUM & PLAYER BOOSTS (24)",
        info_album_text: "Each duplicate player increases his level and stacks his global passive income multiplier.",
        info_legendary_title: "👑 LEGENDARY (+45% to +100% / level)",
        info_legendary_pele: "Pelé (FW, +100% / lvl) - The eternal King of football.",
        info_legendary_zidane: "Z. Zidane (MF, +80% / lvl) - Maestro of ultimate elegance.",
        info_legendary_messi: "L. Messi (FW, +60% / lvl) - The alien, 8-time Ballon d'Or.",
        info_legendary_ronaldo: "C. Ronaldo (FW, +60% / lvl) - Ultimate athlete of records.",
        info_legendary_haaland: "E. Haaland (FW, +45% / lvl) - Cyborg programmed to score.",
        info_legendary_mbappe: "K. Mbappé (FW, +45% / lvl) - Bondy's lightning-fast comet.",
        info_epic_title: "💜 EPIC (+15% to +30% / level)",
        info_epic_text: "De Bruyne (MF, +30%), Salah (FW, +30%), Kane (FW, +30%), Courtois (GK, +25%), Dias (DF, +20%), Saka (FW, +15%).",
        info_rare_title: "💙 RARE (+8% to +12% / level)",
        info_rare_text: "Bellingham (MF, +12%), Modric (MF, +12%), Griezmann (FW, +10%), Vinicius Jr (FW, +10%), Son (FW, +8%), Ronaldinho (Secret Card, +120%).",
        info_common_title: "💚 COMMON (+2% to +5% / level)",
        info_common_text: "6 other professional loyal squad players forming the solid spine of your roster.",
        info_close_btn: "RETURN TO STADIUM",

        // --- STATS MODAL ---
        stats_title: "PROGRESS CONTROLLER",
        stats_subtitle: "CLUB STATISTICS REPORT",
        stats_earned: "Total lifetime cash earned",
        stats_clicks: "Total active clicks made",
        stats_packs_bronze: "Recruit packs opened",
        stats_packs_silver: "Pro packs opened",
        stats_packs_gold: "Legend packs opened",
        stats_seasons: "Rebirth seasons (🏆)",
        stats_close_btn: "RETURN TO STADIUM",

        // --- REBIRTH LOCKED MODAL ---
        rl_title: "🏆 SEASON REBIRTH UNAVAILABLE",
        rl_subtitle: "ADDITIONAL CAPITAL REQUIRED",
        rl_p1: "To reset the current season, obtain a permanent Prestige Cup, and double your lifetime earnings, you must reach at least <strong>$1.00B</strong> in treasury.",
        rl_missing_label: "Missing capital:",
        rl_benefits_title: "🎁 REBIRTH BENEFITS:",
        rl_benefit1: "🏆 <strong>Prestige Multiplier:</strong> Each Rebirth gives you a permanent, lifetime cumulative +100% global multiplier!",
        rl_benefit2: "🃏  <strong>Secured Roster:</strong> You keep ALL your hard-earned player cards and their card levels.",
        rl_benefit3: "📈 <strong>Accelerated Growth:</strong> Start a brand new season and smash all your past records at lightning speed.",
        rl_close_btn: "RETURN TO STADIUM 🚀",

        // --- REBIRTH CONFIRMATION MODAL ---
        rc_title: "🏆 SEASON REBIRTH!",
        rc_subtitle: "ARE YOU READY TO RESET THE SEASON?",
        rc_p1: "Are you ready to reset your treasury and club facilities to obtain a permanent Prestige Cup?",
        rc_benefits_title: "🎁 REBIRTH BENEFITS & CONSEQUENCES:",
        rc_benefit1: "🏆 <strong>Prestige Multiplier:</strong> Gain a permanent, cumulative lifetime +100% boost to ALL earnings (clicks & passive).",
        rc_benefit2: "🃏 <strong>Secured Roster:</strong> Keep your entire squad of holographic player cards and their levels!",
        rc_benefit3: "📉 <strong>Full Reset:</strong> Your club treasury and building levels will reset back to 0.",
        rc_yes_btn: "YES, REBORN! 🏆",
        rc_no_btn: "CANCEL ❌",

        // --- GAME OVER / OUTCOME MODALS ---
        outcome_close_btn: "RETURN TO STADIUM 🚀",

        // --- CARD DETAIL VIEWER ---
        card_position: "Position:",
        card_level: "Card Level:",
        card_boost: "Contribution:",
        card_bio_title: "PLAYER BIOGRAPHY",
        card_detail_close_btn: "RETURN TO STADIUM",

        // --- PENALTY MODAL ---
        penalty_title: "⚽ DECISIVE PENALTY!",
        penalty_shoot_btn: "STRIKE THE BALL! ⚡",

        // --- PRESS MODAL ---
        press_title: "🎤 TRAPPED PRESS CONFERENCE",
        press_subtitle: "ANSWER THE JOURNALISTS",
        press_choice_a_tag: "Option A (Diplomatic) 🤝",
        press_choice_b_tag: "Option B (Arrogant) 💰",

        // --- AUDIT MODAL ---
        audit_title: "💼 FINANCIAL FAIR PLAY CONTROL",
        audit_start_btn: "START FALSIFICATION! ✍️"
    }
};
