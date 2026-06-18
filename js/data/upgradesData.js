/* --- TYCOON INFRASTRUCTURE UPGRADES CONFIGURATION (BALANCED INFLATION V2) --- */

const UPGRADES_DATA = [
    {
        id: "hotdog_stand",
        name: "Stand de Hot-Dogs",
        icon: "🌭",
        baseCost: 150, // Tripled from 50
        baseYield: 1.5, // $1.50 per second
        costMultiplier: 1.15, // Exponential multiplier (increased from 1.14)
        fr: { desc: "Vendez de la nourriture aux supporters affamés." },
        en: { desc: "Sell warm snacks to hungry soccer fans." }
    },
    {
        id: "parking_lot",
        name: "Parking du Stade",
        icon: "🅿️",
        baseCost: 1050, // Tripled from 350
        baseYield: 8.0, // $8.00 per second
        costMultiplier: 1.16, // increased from 1.15
        fr: { desc: "Faites payer le stationnement les soirs de match." },
        en: { desc: "Charge parking tickets on match evenings." }
    },
    {
        id: "club_shop",
        name: "Boutique Officielle",
        icon: "👕",
        baseCost: 4500, // Tripled from 1500
        baseYield: 45.0, // $45.00 per second
        costMultiplier: 1.17, // increased from 1.16
        fr: { desc: "Équipez vos supporters de maillots et d'écharpes." },
        en: { desc: "Equip your fans with jerseys and scarves." }
    },
    {
        id: "ticket_office",
        name: "Guichets Billetterie",
        icon: "🎟️",
        baseCost: 24000, // Tripled from 8000
        baseYield: 260.0, // $260.00 per second
        costMultiplier: 1.18, // increased from 1.16
        fr: { desc: "Optimisez la vente des billets et abonnements." },
        en: { desc: "Optimize match tickets and season passes." }
    },
    {
        id: "vip_boxes",
        name: "Loges VIP Privées",
        icon: "🥂",
        baseCost: 165000, // Tripled from 55000
        baseYield: 1500.0, // $1,500.00 per second
        costMultiplier: 1.19, // increased from 1.17
        fr: { desc: "Accueillez des millionnaires pour lever des fonds massifs." },
        en: { desc: "Welcome millionaires to raise massive capital." }
    },
    {
        id: "stadium_naming",
        name: "Naming du Stade",
        icon: "🏟️",
        baseCost: 1050000, // Tripled from 350000
        baseYield: 9200.0, // $9,200.00 per second
        costMultiplier: 1.20, // increased from 1.18
        fr: { desc: "Louez le nom de votre arène à une multinationale." },
        en: { desc: "Lease your arena naming rights to a major brand." }
    },
    {
        id: "tv_rights",
        name: "Droits de Télédiffusion",
        icon: "📺",
        baseCost: 7200000, // Tripled from 2400000
        baseYield: 64000.0, // $64,000.00 per second
        costMultiplier: 1.22, // increased from 1.19
        fr: { desc: "Vendez vos diffusions à l'échelle internationale." },
        en: { desc: "Broadcast your games to international networks." }
    },
    {
        id: "crypto_sponsor",
        name: "Sponsor Crypto Majeur",
        icon: "🪙",
        baseCost: 54000000, // Tripled from 18000000
        baseYield: 450000.0, // $450,000.00 per second
        costMultiplier: 1.24, // increased from 1.20
        fr: { desc: "Sponsorisez le maillot avec de la monnaie virtuelle." },
        en: { desc: "Sponsor your jerseys with virtual currency." }
    }
];
