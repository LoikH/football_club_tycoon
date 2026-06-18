/* --- GAME STATE AND ECONOMY MANAGER (PRESTIGE & BOOSTER ओवरहॉल) --- */

class GameState {
    constructor() {
        this.money = 0;
        this.totalEarned = 0;
        this.totalClicks = 0;
        this.packsBronzeOpened = 0;
        this.packsSilverOpened = 0; // tracked for Pro pack!
        this.packsGoldOpened = 0;
        this.prestigeCups = 0; // each cup multiplies overall earnings by +100%
        
        this.upgrades = {}; // { upgradeId: level }
        this.cards = {};    // { cardId: level } (0 means locked/not found yet)
        
        this.incomePerSec = 0;
        this.clickValue = 1;
        this.globalCardsMult = 0; // Cumulative multiplier from owned cards
        this.isTutorialCompleted = false;
        this.lang = "fr"; // Bilingual state: "fr" or "en"

        // Session active buffs / debuffs from mini-games
        this.passiveMultBonus = 1.0;
        this.clickMultBonus = 1.0;
        this.activeBuffName = "";
        this.activeBuffTime = 0;

        this.initDefaults();
    }

    initDefaults() {
        // Initialize upgrades at level 0
        UPGRADES_DATA.forEach(up => {
            this.upgrades[up.id] = 0;
        });

        // Initialize cards at level 0 (locked)
        CARDS_DATA.forEach(c => {
            this.cards[c.id] = 0;
        });
    }

    // --- LOCAL STORAGE PERSISTENCE ---
    load() {
        try {
            const raw = localStorage.getItem("fc_tycoon_save");
            if (!raw) {
                this.recalculateRates();
                return false;
            }
            
            const data = JSON.parse(raw);
            
            // Safe copy of primary metrics
            this.money = typeof data.money === 'number' ? data.money : 0;
            this.totalEarned = typeof data.totalEarned === 'number' ? data.totalEarned : 0;
            this.totalClicks = typeof data.totalClicks === 'number' ? data.totalClicks : 0;
            this.packsBronzeOpened = typeof data.packsBronzeOpened === 'number' ? data.packsBronzeOpened : 0;
            this.packsSilverOpened = typeof data.packsSilverOpened === 'number' ? data.packsSilverOpened : 0;
            this.packsGoldOpened = typeof data.packsGoldOpened === 'number' ? data.packsGoldOpened : 0;
            this.prestigeCups = typeof data.prestigeCups === 'number' ? data.prestigeCups : 0;
            this.isTutorialCompleted = typeof data.isTutorialCompleted === 'boolean' ? data.isTutorialCompleted : false;
            this.lang = typeof data.lang === 'string' ? data.lang : "fr";

            // Safe copy of upgrade levels
            if (data.upgrades) {
                for (const id in this.upgrades) {
                    if (typeof data.upgrades[id] === 'number') {
                        this.upgrades[id] = data.upgrades[id];
                    }
                }
            }

            // Safe copy of card levels
            if (data.cards) {
                for (const id in this.cards) {
                    if (typeof data.cards[id] === 'number') {
                        this.cards[id] = data.cards[id];
                    }
                }
            }

            this.recalculateRates();
            return true;
        } catch (e) {
            console.error("Error loading game state:", e);
            this.recalculateRates();
            return false;
        }
    }

    save() {
        try {
            const data = {
                money: this.money,
                totalEarned: this.totalEarned,
                totalClicks: this.totalClicks,
                packsBronzeOpened: this.packsBronzeOpened,
                packsSilverOpened: this.packsSilverOpened,
                packsGoldOpened: this.packsGoldOpened,
                prestigeCups: this.prestigeCups,
                upgrades: this.upgrades,
                cards: this.cards,
                isTutorialCompleted: this.isTutorialCompleted,
                lang: this.lang
            };
            localStorage.setItem("fc_tycoon_save", JSON.stringify(data));
        } catch (e) {
            console.error("Error saving game state:", e);
        }
    }

    reset() {
        localStorage.removeItem("fc_tycoon_save");
        window.location.reload();
    }

    // --- REVENUE & MULTIPLIERS MATHEMATICS ---
    recalculateRates() {
        // 1. Calculate cumulative cards multiplier
        // Each owned card (level >= 1) adds (baseBoost * level) to the global multiplier
        let cardBonusSum = 0;
        CARDS_DATA.forEach(c => {
            const lv = this.cards[c.id] || 0;
            if (lv > 0) {
                cardBonusSum += c.baseBoost * lv;
            }
        });
        this.globalCardsMult = cardBonusSum;

        // 2. Calculate passive upgrades yield sum
        let rawPassiveSum = 0;
        UPGRADES_DATA.forEach(up => {
            const lv = this.upgrades[up.id] || 0;
            if (lv > 0) {
                rawPassiveSum += up.baseYield * lv;
            }
        });

        // Apply Card, Prestige, and Active Buff Multipliers to Passive Income: Income = RawSum * (1 + CardsMultiplier) * (1 + prestigeCups) * passiveMultBonus
        this.incomePerSec = rawPassiveSum * (1 + this.globalCardsMult) * (1 + this.prestigeCups) * this.passiveMultBonus;

        // 3. Calculate manual click value
        let totalUpgradeLevels = 0;
        for (const id in this.upgrades) {
            totalUpgradeLevels += this.upgrades[id] || 0;
        }
        
        const baseClick = 1.0 + totalUpgradeLevels * 0.25;
        // Prestige and Active click bonus multiply manual clicks
        this.clickValue = baseClick * (1 + this.globalCardsMult * 0.25) * (1 + this.prestigeCups) * this.clickMultBonus;
    }

    // --- ACTIONS ---
    addMoney(amount) {
        if (amount <= 0) return;
        this.money += amount;
        this.totalEarned += amount;
    }

    spendMoney(amount) {
        if (amount <= 0 || this.money < amount) return false;
        this.money -= amount;
        return true;
    }

    getUpgradeCost(id) {
        const up = UPGRADES_DATA.find(u => u.id === id);
        if (!up) return Infinity;
        const lv = this.upgrades[id] || 0;
        return Math.floor(up.baseCost * Math.pow(up.costMultiplier, lv));
    }

    getUpgradeYield(id) {
        const up = UPGRADES_DATA.find(u => u.id === id);
        if (!up) return 0;
        const lv = this.upgrades[id] || 0;
        // Display yield per second with Card AND Prestige Multipliers applied
        return up.baseYield * lv * (1 + this.globalCardsMult) * (1 + this.prestigeCups);
    }

    buyUpgrade(id) {
        const cost = this.getUpgradeCost(id);
        if (this.money >= cost) {
            this.spendMoney(cost);
            this.upgrades[id] = (this.upgrades[id] || 0) + 1;
            this.recalculateRates();
            this.save();
            return true;
        }
        return false;
    }

    // Add a card unboxed from a pack (Capped at Level 5 Maximum!)
    addCard(cardId) {
        const currentLv = this.cards[cardId] || 0;
        if (currentLv >= 5) {
            this.cards[cardId] = 5; // Enforce hard cap
            this.save();
            return false;
        }
        this.cards[cardId] = currentLv + 1; // Unlocking or leveling up duplicate
        this.recalculateRates();
        this.save();
        return currentLv === 0; // Returns true if newly unlocked
    }

    // --- PRESTIGE RESET ---
    prestige() {
        const costThreshold = 1000000000; // $1.00B minimum (increased to 1B!)
        if (this.money >= costThreshold) {
            this.prestigeCups++;
            
            // Reset money and upgrades
            this.money = 0;
            UPGRADES_DATA.forEach(up => {
                this.upgrades[up.id] = 0;
            });

            // Note: CARDS are preserved, isTutorialCompleted is preserved, prestigeCups are preserved!

            this.recalculateRates();
            this.save();
            return true;
        }
        return false;
    }

    getLeagueName() {
        const earned = this.totalEarned;
        if (this.lang === "en") {
            if (earned < 10000) return "4th Division - Amateur";
            if (earned < 100000) return "3rd Division - Semi-Pro";
            if (earned < 1000000) return "National - Regional";
            if (earned < 25000000) return "Ligue 2 - Professional";
            if (earned < 500000000) return "Ligue 1 - National Elite";
            return "World Super League - Billionaire";
        } else {
            if (earned < 10000) return "4ème Division - Amateur";
            if (earned < 100000) return "3ème Division - Semi-Pro";
            if (earned < 1000000) return "National - Régional";
            if (earned < 25000000) return "Ligue 2 - Professionnel";
            if (earned < 500000000) return "Ligue 1 - Élite Nationale";
            return "Super Ligue Mondiale - Milliardaire";
        }
    }

    getLeagueEmoji() {
        const earned = this.totalEarned;
        if (earned < 10000) return "🥉";
        if (earned < 100000) return "🥈";
        if (earned < 1000000) return "🥇";
        if (earned < 25000000) return "⚽";
        if (earned < 500000000) return "⭐";
        return "🏆";
    }
}
