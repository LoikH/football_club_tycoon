/* --- COLLECTIBLE PLAYER CARDS DICTIONARY --- */

const CARDS_DATA = [
    // --- COMMON CARDS (Boost: +2% per level) ---
    {
        id: "maignan",
        name: "M. Maignan",
        portrait: "images/maignan.webp",
        position: "Gardiens",
        rarity: "common",
        baseBoost: 0.02,
        fr: { desc: "Un gardien de but impérial aux réflexes de chat." },
        en: { desc: "An imperial goalkeeper with feline reflexes." }
    },
    {
        id: "vandijk",
        name: "V. van Dijk",
        portrait: "images/vandijk.png",
        position: "Défenseurs",
        rarity: "common",
        baseBoost: 0.02,
        fr: { desc: "Un stoppeur physique infranchissable." },
        en: { desc: "A physical centerback who cannot be bypassed." }
    },
    {
        id: "saliba",
        name: "W. Saliba",
        portrait: "images/saliba.png",
        position: "Défenseurs",
        rarity: "common",
        baseBoost: 0.02,
        fr: { desc: "La muraille infranchissable de Londres, calme, rapide et souverain." },
        en: { desc: "The unpassable wall of London, calm, fast and commanding." }
    },
    {
        id: "hakimi",
        name: "A. Hakimi",
        portrait: "images/hakimi.png",
        position: "Défenseurs",
        rarity: "common",
        baseBoost: 0.02,
        fr: { desc: "Un piston latéral droit ultra-rapide." },
        en: { desc: "An ultra-fast right full-back." }
    },
    {
        id: "dejong",
        name: "F. de Jong",
        portrait: "images/dejong.png",
        position: "Milieux",
        rarity: "common",
        baseBoost: 0.02,
        fr: { desc: "Le maestro néerlandais, fluide balle au pied et visionnaire." },
        en: { desc: "The Dutch maestro, fluid on the ball with amazing vision." }
    },
    {
        id: "fernandes",
        name: "B. Fernandes",
        portrait: "images/fernandes.png",
        position: "Milieux",
        rarity: "common",
        baseBoost: 0.02,
        fr: { desc: "Un meneur de jeu créatif et redoutable passeur." },
        en: { desc: "A creative playmaker and formidable passer." }
    },

    // --- RARE CARDS (Boost: +6% per level) ---
    {
        id: "courtois",
        name: "T. Courtois",
        portrait: "images/courtois.png",
        position: "Gardiens",
        rarity: "rare",
        baseBoost: 0.06,
        fr: { desc: "Un mur géant d'un mètre nonante-neuf." },
        en: { desc: "A giant wall measuring 1 meter 99." }
    },
    {
        id: "dias",
        name: "R. Dias",
        portrait: "images/dias.png",
        position: "Défenseurs",
        rarity: "rare",
        baseBoost: 0.06,
        fr: { desc: "Le roc inébranlable de Manchester." },
        en: { desc: "The unshakeable rock of Manchester." }
    },
    {
        id: "modric",
        name: "L. Modrić",
        portrait: "images/modric.png",
        position: "Milieux",
        rarity: "rare",
        baseBoost: 0.06,
        fr: { desc: "Le maestro croate, virtuose éternel." },
        en: { desc: "The Croatian maestro, eternal virtuoso." }
    },
    {
        id: "griezmann",
        name: "A. Griezmann",
        portrait: "images/griezmann.png",
        position: "Milieux",
        rarity: "rare",
        baseBoost: 0.06,
        fr: { desc: "Le cerveau tactique de l'équipe tricolore." },
        en: { desc: "The tactical brain of the French squad." }
    },
    {
        id: "son",
        name: "Son H.M.",
        portrait: "images/son.png",
        position: "Attaquants",
        rarity: "rare",
        baseBoost: 0.06,
        fr: { desc: "L'artilleur coréen, vif et chirurgical." },
        en: { desc: "The Korean winger, fast and surgical." }
    },
    {
        id: "saka",
        name: "B. Saka",
        portrait: "images/saka.png",
        position: "Attaquants",
        rarity: "rare",
        baseBoost: 0.06,
        fr: { desc: "Le piment anglais, percutant et imprévisible." },
        en: { desc: "The English chili, high-impact and unpredictable." }
    },

    // --- EPIC CARDS (Boost: +15% per level) ---
    {
        id: "alisson",
        name: "Alisson B.",
        portrait: "images/becker.png",
        position: "Gardiens",
        rarity: "epic",
        baseBoost: 0.15,
        fr: { desc: "La classe et la sérénité brésilienne au but." },
        en: { desc: "Brazilian class and serenity in goal." }
    },
    {
        id: "debruyne",
        name: "K. De Bruyne",
        portrait: "images/debruyne.png",
        position: "Milieux",
        rarity: "epic",
        baseBoost: 0.15,
        fr: { desc: "La précision chirurgicale, l'ordinateur du milieu." },
        en: { desc: "Surgical precision, the computer of the pitch." }
    },
    {
        id: "bellingham",
        name: "J. Bellingham",
        portrait: "images/bellingham.png",
        position: "Milieux",
        rarity: "epic",
        baseBoost: 0.15,
        fr: { desc: "Le prodige d'or du football anglais." },
        en: { desc: "The golden prodigy of English football." }
    },
    {
        id: "vinicius",
        name: "Vini Jr.",
        portrait: "images/vini.png",
        position: "Attaquants",
        rarity: "epic",
        baseBoost: 0.15,
        fr: { desc: "Le danseur fou des ailes madrilènes." },
        en: { desc: "The crazy dancer of madrid wings." }
    },
    {
        id: "kane",
        name: "H. Kane",
        portrait: "images/kane.png",
        position: "Attaquants",
        rarity: "epic",
        baseBoost: 0.15,
        fr: { desc: "L'attaquant d'élite par excellence." },
        en: { desc: "The elite striker par excellence." }
    },
    {
        id: "salah",
        name: "M. Salah",
        portrait: "images/salah.png",
        position: "Attaquants",
        rarity: "epic",
        baseBoost: 0.15,
        fr: { desc: "Le pharaon d'Égypte et roi de la Mersey." },
        en: { desc: "The Egyptian pharaoh and king of Mersey." }
    },

    // --- LEGENDARY CARDS (Boost: +45% per level) ---
    {
        id: "haaland",
        name: "E. Haaland",
        portrait: "images/haaland.png",
        position: "Attaquants",
        rarity: "legendary",
        baseBoost: 0.45,
        fr: { desc: "Le cyborg scandinave programmé pour détruire les cages." },
        en: { desc: "The Scandinavian cyborg programmed to crush goals." }
    },
    {
        id: "mbappe",
        name: "K. Mbappé",
        portrait: "images/mbappe.png",
        position: "Attaquants",
        rarity: "legendary",
        baseBoost: 0.45,
        fr: { desc: "La comète de Bondy, vitesse lumière et finition clinique." },
        en: { desc: "The Bondy comet, lightspeed velocity and clinical finish." }
    },
    {
        id: "messi",
        name: "L. Messi",
        portrait: "images/messi.png",
        position: "Attaquants",
        rarity: "legendary",
        baseBoost: 0.60, // Premium Legendary
        fr: { desc: "L'extraterrestre du football, octuple Ballon d'Or." },
        en: { desc: "The alien of football, octuple Ballon d'Or." }
    },
    {
        id: "ronaldo",
        name: "C. Ronaldo",
        portrait: "images/ronaldo.png",
        position: "Attaquants",
        rarity: "legendary",
        baseBoost: 0.60, // Premium Legendary
        fr: { desc: "L'athlète ultime, la légende suprême des records." },
        en: { desc: "The ultimate athlete, supreme records legend." }
    },
    {
        id: "zidane",
        name: "Z. Zidane",
        portrait: "images/zidane.png",
        position: "Milieux",
        rarity: "legendary",
        baseBoost: 0.80, // Icon
        fr: { desc: "Le divin chauve, l'élégance absolue à la française." },
        en: { desc: "The divine playmaker, absolute French elegance." }
    },
    {
        id: "pele",
        name: "Pelé",
        portrait: "images/pele.png",
        position: "Attaquants",
        rarity: "legendary",
        baseBoost: 1.00, // Mythic Icon
        fr: { desc: "Le Roi éternel du football mondial, triple champion." },
        en: { desc: "The eternal King of world football, triple champion." }
    },
    {
        id: "ronaldinho",
        name: "Ronaldinho",
        portrait: "images/ronaldinho.png", // Supports custom images!
        position: "Milieux",
        rarity: "mythic", // Special Secret Mythic Rarity!
        baseBoost: 1.20, // Huge +120% global passive income boost per level!
        isSecret: true, // Cannot be opened in packs, completely hidden initially!
        fr: { desc: "🤙 Le génie absolu du Joga Bonito, souriant, magique et insaisissable." },
        en: { desc: "The absolute genius of Joga Bonito, smiling, magical and elusive." }
    }
];

// Pack opening probability tables (Inflation-adjusted progression funnel)
const PACKS_CONFIG = {
    bronze: {
        cost: 50000, // $50.00k
        rates: { common: 0.80, rare: 0.15, epic: 0.05, legendary: 0.00 }
    },
    silver: {
        cost: 1000000, // $1.00M
        rates: { common: 0.20, rare: 0.55, epic: 0.22, legendary: 0.03 }
    },
    gold: {
        cost: 500000000, // $500.00M
        rates: { common: 0.00, rare: 0.20, epic: 0.55, legendary: 0.25 }
    }
};
