/* --- TYCOON MAIN CONTROL LOOP AND AUDIO SYNTHESIZER --- */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false; // Mute state
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playNote(freq, delay, duration, type = 'sine', volume = 0.25) {
        if (this.isMuted) return; // Completely silent if muted!
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

            gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + delay);
            osc.stop(this.ctx.currentTime + delay + duration);
        } catch (e) {
            console.warn("Audio Context blocked or failed:", e);
        }
    }

    playClickBeep() {
        // Satisfying cash tick sound
        this.playNote(1200, 0, 0.05, 'sine', 0.12);
    }

    playPurchaseSound() {
        // Double tone register ring: Ka-Ching!
        this.playNote(987.77, 0, 0.08, 'sine', 0.22); // B5
        this.playNote(1318.51, 0.07, 0.25, 'sine', 0.22); // E6
    }

    playPackRipSound() {
        // Winding low sawtooth tear sound followed by a crisp high tone
        this.playNote(180, 0, 0.12, 'sawtooth', 0.15);
        this.playNote(300, 0.05, 0.15, 'sawtooth', 0.15);
        this.playNote(1000, 0.18, 0.22, 'sine', 0.25);
    }

    playUnboxFanfare(rarity) {
        // Distinct fanfares based on player card rarity!
        const base = 523.25; // C5
        if (rarity === "common") {
            this.playNote(base, 0, 0.1, 'triangle', 0.25);
            this.playNote(base * 1.25, 0.1, 0.25, 'triangle', 0.25); // E5
        } else if (rarity === "rare") {
            this.playNote(base, 0, 0.08, 'triangle', 0.25);
            this.playNote(base * 1.25, 0.08, 0.08, 'triangle', 0.25);
            this.playNote(base * 1.5, 0.16, 0.3, 'triangle', 0.25); // G5
        } else if (rarity === "epic") {
            this.playNote(base, 0, 0.08, 'triangle', 0.25);
            this.playNote(base * 1.25, 0.08, 0.08, 'triangle', 0.25);
            this.playNote(base * 1.5, 0.16, 0.08, 'triangle', 0.25);
            this.playNote(base * 2.0, 0.24, 0.4, 'triangle', 0.3); // C6
        } else if (rarity === "legendary") {
            // Massive glorious gold arpeggio!
            this.playNote(base, 0, 0.1, 'sawtooth', 0.25);
            this.playNote(base * 1.25, 0.08, 0.1, 'sawtooth', 0.25);
            this.playNote(base * 1.5, 0.16, 0.1, 'sawtooth', 0.25);
            this.playNote(base * 2.0, 0.24, 0.12, 'sawtooth', 0.25);
            this.playNote(base * 2.5, 0.32, 0.12, 'sawtooth', 0.25);
            this.playNote(base * 3.0, 0.40, 0.8, 'sine', 0.35); // G6 peak glow
        }
    }
}

// Global controllers initialization
const state = new GameState();
const ui = new UiManager();
const audio = new AudioManager();

const showCardDetailHandler = (cardId) => {
    const card = CARDS_DATA.find(c => c.id === cardId);
    const level = state.cards[cardId] || 0;
    
    // Play card flip slide/fanfare
    audio.playNote(440, 0, 0.08, 'triangle', 0.15);
    audio.playNote(554.37, 0.04, 0.15, 'sine', 0.15);
    
    ui.showCardDetail(card, level, state);
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Load Save Game
    state.load();
    
    // 2. Initial render
    ui.translateUI(state); // Load active language!
    ui.updateHUD(state);
    ui.renderUpgrades(state, buyUpgradeHandler);
    ui.renderDeck(state, showCardDetailHandler);

    // 3. Bind UI click event listeners
    setupEventListeners();

    // Show tutorial modal automatically if never completed before
    if (!state.isTutorialCompleted) {
        document.getElementById("tutorial-modal").style.display = "flex";
    }

    // Start active random event timer at startup
    startRandomEventTimer();

    // 4. Start main loop (10 ticks per second)
    let autoSaveTimer = 0;
    let buffTickCount = 0;
    
    setInterval(() => {
        if (state.incomePerSec > 0) {
            // Divide passive income per sec by 10 for the 100ms ticker
            state.addMoney(state.incomePerSec / 10);
            ui.updateHUD(state);
        }

        // Periodically update upgrades visual affordability state (without DOM reconstruction)
        ui.updateUpgradesAffordability(state);

        // Track and decrement session active buffs once per second (every 10 ticks)
        buffTickCount++;
        if (buffTickCount >= 10) {
            buffTickCount = 0;
            
            // Check for Ronaldinho secret unboxing golden ball trigger automatically (idle-friendly!)
            if (checkRosterComplete() && (state.cards["ronaldinho"] || 0) === 0 && !isJongleActive) {
                if (Math.random() < 0.015) { // 1.5% chance per second once roster is complete!
                    spawnGoldenBall();
                }
            }
            
            if (state.activeBuffTime > 0) {
                state.activeBuffTime--;
                
                // Update HUD buff indicator
                const indicator = document.getElementById("buff-indicator");
                if (indicator) {
                    indicator.innerText = `${state.activeBuffName} (${state.activeBuffTime}s)`;
                    indicator.style.display = "inline-block";
                    
                    if (state.activeBuffName.includes("-") || state.activeBuffName.includes("🚨")) {
                        indicator.className = "buff-text text-red";
                    } else {
                        indicator.className = "buff-text text-green";
                    }
                }
                
                if (state.activeBuffTime === 0) {
                    // Buff expired! Reset and recalculate rates
                    state.passiveMultBonus = 1.0;
                    state.clickMultBonus = 1.0;
                    state.activeBuffName = "";
                    state.recalculateRates();
                    
                    const indicator = document.getElementById("buff-indicator");
                    if (indicator) indicator.style.display = "none";
                    
                    // Play expired sound
                    audio.playNote(440, 0, 0.12, 'sine', 0.1);
                    ui.updateHUD(state);
                }
            }
        }

        // Auto save every 15 seconds (150 ticks)
        autoSaveTimer++;
        if (autoSaveTimer >= 150) {
            autoSaveTimer = 0;
            state.save();
        }
    }, 100);
});

function setupEventListeners() {
    const stadium = document.getElementById("stadium-clicker");
    const bronzePackBtn = document.getElementById("btn-pack-bronze");
    const silverPackBtn = document.getElementById("btn-pack-silver");
    const goldPackBtn = document.getElementById("btn-pack-gold");
    const unboxingCloseBtn = document.getElementById("unboxing-close-btn");
    const statsBtn = document.getElementById("btn-stats");
    const statsCloseBtn = document.getElementById("stats-close-btn");
    const tutoBtn = document.getElementById("btn-tuto");
    const tutoCloseBtn = document.getElementById("tutorial-close-btn");
    const infoBtn = document.getElementById("btn-info");
    const infoCloseBtn = document.getElementById("info-close-btn");
    const prestigeBtn = document.getElementById("btn-prestige");
    const rebirthLockedCloseBtn = document.getElementById("rebirth-locked-close-btn");
    const rebirthConfirmYesBtn = document.getElementById("rebirth-confirm-yes-btn");
    const rebirthConfirmNoBtn = document.getElementById("rebirth-confirm-no-btn");
    const resetBtn = document.getElementById("btn-reset");
    const soundToggleBtn = document.getElementById("btn-sound-toggle");
    const langToggleBtn = document.getElementById("btn-lang-toggle");

    // --- STADIUM CLICKER ---
    stadium.addEventListener("click", (e) => {
        audio.playClickBeep();
        
        state.totalClicks++;
        state.addMoney(state.clickValue);
        
        ui.updateHUD(state);
        ui.showFloatingText(state.clickValue, e.clientX, e.clientY);
    });

    // --- GOLDEN JONGLE BALL CLICK ---
    const jongleBallBtn = document.getElementById("jongle-ball");
    if (jongleBallBtn) {
        jongleBallBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent triggering background stadium click!
            handleJongleClick(e);
        });
    }

    // --- PACK OPENINGS ---
    const openPackHandler = (packId) => {
        const packConfig = PACKS_CONFIG[packId];
        if (!packConfig || state.money < packConfig.cost) return;

        audio.playPackRipSound();

        // Spend money
        state.spendMoney(packConfig.cost);
        ui.updateHUD(state);

        // Update stats
        if (packId === "bronze") state.packsBronzeOpened++;
        else if (packId === "silver") state.packsSilverOpened++;
        else state.packsGoldOpened++;

        // 1. Roll rarity based on rates
        const roll = Math.random();
        let rolledRarity = "common";
        let accumulator = 0;

        for (const rarity in packConfig.rates) {
            accumulator += packConfig.rates[rarity];
            if (roll <= accumulator) {
                rolledRarity = rarity;
                break;
            }
        }

        // 2. Select a random card of that rarity (excluding secret cards!)
        const availableCards = CARDS_DATA.filter(c => c.rarity === rolledRarity && !c.isSecret);
        const selectedCard = availableCards[Math.floor(Math.random() * availableCards.length)];

        // 3. Add to state
        const isNew = state.addCard(selectedCard.id);

        // 4. Update displays
        ui.renderDeck(state, showCardDetailHandler);
        ui.renderUpgrades(state, buyUpgradeHandler); // Cards multiplier updates passive displays

        // 5. Trigger unboxing modal reveal with premium fanfares
        setTimeout(() => {
            audio.playUnboxFanfare(rolledRarity);
            ui.showUnboxing(selectedCard, isNew);
        }, 300);
    };

    bronzePackBtn.addEventListener("click", () => openPackHandler("bronze"));
    silverPackBtn.addEventListener("click", () => openPackHandler("silver"));
    goldPackBtn.addEventListener("click", () => openPackHandler("gold"));

    unboxingCloseBtn.addEventListener("click", () => {
        document.getElementById("unboxing-modal").style.display = "none";
        audio.playClickBeep();
    });

    document.getElementById("outcome-close-btn").addEventListener("click", () => {
        document.getElementById("outcome-modal").style.display = "none";
        audio.playClickBeep();

        // Start golden keepy-uppy ball game if modal closed was the start announcement modal!
        if (shouldStartJongleOnClose) {
            shouldStartJongleOnClose = false;
            isJongleActive = true;
            lastJongleTime = performance.now(); // Reset time on start!
            jongleAnimId = requestAnimationFrame(updatePhysics);
        }
    });

    // --- STATS MODAL ---
    statsBtn.addEventListener("click", () => {
        audio.playClickBeep();
        
        // Populate stats modal values
        document.getElementById("stat-total-earned").innerText = ui.formatMoney(state.totalEarned);
        document.getElementById("stat-total-clicks").innerText = state.totalClicks;
        document.getElementById("stat-packs-bronze").innerText = state.packsBronzeOpened;
        document.getElementById("stat-packs-silver").innerText = state.packsSilverOpened;
        document.getElementById("stat-packs-gold").innerText = state.packsGoldOpened;
        document.getElementById("stat-prestige").innerText = state.prestigeCups;

        document.getElementById("stats-modal").style.display = "flex";
    });

    statsCloseBtn.addEventListener("click", () => {
        document.getElementById("stats-modal").style.display = "none";
        audio.playClickBeep();
    });

    // --- REBIRTH PRESTIGE ACTION ---
    prestigeBtn.addEventListener("click", () => {
        if (state.money >= 1000000000) { // $1.00B minimum (increased!)
            audio.playClickBeep();
            document.getElementById("rebirth-confirm-modal").style.display = "flex";
        } else {
            // Rebirth is locked! Show custom styled modal popup instead of browser alert
            audio.playNote(150, 0, 0.15, 'sawtooth', 0.2); // short buzz error sound
            
            const missingMoney = 1000000000 - state.money;
            const formattedMissing = ui.formatMoney(missingMoney);
            
            document.getElementById("rebirth-missing-value").innerText = formattedMissing;
            document.getElementById("rebirth-locked-modal").style.display = "flex";
        }
    });

    rebirthConfirmYesBtn.addEventListener("click", () => {
        document.getElementById("rebirth-confirm-modal").style.display = "none";
        
        if (state.prestige()) {
            // Triumph fanfare!
            audio.playNote(523.25, 0, 0.15, 'triangle');
            audio.playNote(659.25, 0.15, 0.15, 'triangle');
            audio.playNote(783.99, 0.3, 0.15, 'triangle');
            audio.playNote(1046.50, 0.45, 0.8, 'sine');
            
            ui.updateHUD(state);
            ui.renderUpgrades(state, buyUpgradeHandler);
            ui.renderDeck(state, showCardDetailHandler);
            showOutcomeModal("🏆", "REBIRTH ACCOMPLI !", "Saison Réinitialisée !", "🏆 Félicitations ! Votre club redémarre avec une Coupe de Prestige ! Tous vos gains (clics et passifs) sont maintenant multipliés par " + (1 + state.prestigeCups) + " !", true);
        }
    });

    rebirthConfirmNoBtn.addEventListener("click", () => {
        audio.playClickBeep();
        document.getElementById("rebirth-confirm-modal").style.display = "none";
    });

    rebirthLockedCloseBtn.addEventListener("click", () => {
        audio.playClickBeep();
        document.getElementById("rebirth-locked-modal").style.display = "none";
    });

    // --- TUTORIAL MODAL ---
    tutoBtn.addEventListener("click", () => {
        audio.playClickBeep();
        document.getElementById("tutorial-modal").style.display = "flex";
    });

    tutoCloseBtn.addEventListener("click", () => {
        audio.playClickBeep();
        state.isTutorialCompleted = true;
        state.save();
        document.getElementById("tutorial-modal").style.display = "none";
    });

    // --- INFO / ENCYCLOPEDIA MODAL ---
    infoBtn.addEventListener("click", () => {
        audio.playClickBeep();
        document.getElementById("info-modal").style.display = "flex";
    });

    infoCloseBtn.addEventListener("click", () => {
        audio.playClickBeep();
        document.getElementById("info-modal").style.display = "none";
    });

    // --- CARD DETAIL VIEWER CLOSE ---
    const cardDetailCloseBtn = document.getElementById("card-detail-close-btn");
    if (cardDetailCloseBtn) {
        cardDetailCloseBtn.addEventListener("click", () => {
            audio.playClickBeep();
            document.getElementById("card-detail-modal").style.display = "none";
        });
    }

    // --- ACTIVE RANDOM EVENTS SPOOKY CLICK ---
    const eventBtn = document.getElementById("random-event-btn");
    eventBtn.addEventListener("click", () => {
        clearTimeout(eventTimeoutId);
        eventBtn.style.display = "none";
        
        audio.playClickBeep();
        
        if (currentEvent === "penalty") {
            startPenaltyGame();
        } else if (currentEvent === "press") {
            startPressGame();
        } else {
            startAuditGame();
        }
    });

    // --- PENALTY SHOOTOUT ACTION ---
    document.getElementById("btn-shoot-penalty").addEventListener("click", () => {
        shootPenalty();
    });

    // --- PRESS CONFERENCE ACTION ---
    document.getElementById("btn-press-choice-a").addEventListener("click", () => {
        choosePressOption('a');
    });
    document.getElementById("btn-press-choice-b").addEventListener("click", () => {
        choosePressOption('b');
    });

    // --- FFP AUDIT ACTION ---
    document.getElementById("btn-start-audit").addEventListener("click", () => {
        beginFalsification();
    });

    // --- SOUND MUTE TOGGLE ---
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            audio.isMuted = !audio.isMuted;
            audio.playClickBeep(); // won't play if muted, will play if unmuted!
            
            if (audio.isMuted) {
                soundToggleBtn.innerText = "🔇 SON";
                soundToggleBtn.style.borderColor = "var(--neon-red)";
                soundToggleBtn.style.color = "var(--neon-red)";
            } else {
                soundToggleBtn.innerText = "🔊 SON";
                soundToggleBtn.style.borderColor = "var(--neon-cyan)";
                soundToggleBtn.style.color = "var(--neon-cyan)";
            }
        });
    }

    // --- LANGUAGE BILINGUAL TOGGLE ---
    if (langToggleBtn) {
        langToggleBtn.addEventListener("click", () => {
            state.lang = state.lang === "fr" ? "en" : "fr";
            audio.playClickBeep();
            
            // Apply language update instantly across the entire game
            ui.translateUI(state);
            ui.updateHUD(state);
            ui.renderUpgrades(state, buyUpgradeHandler);
            ui.renderDeck(state, showCardDetailHandler);
            
            state.save();
        });
    }

    // --- WIPE SAVE BUTTON ---
    resetBtn.addEventListener("click", () => {
        audio.playNote(250, 0, 0.1, 'sawtooth', 0.25);
        audio.playNote(150, 0.1, 0.25, 'sawtooth', 0.25);
        
        const langConfirm = confirm("⚠️ ATTENTION : Êtes-vous sûr de vouloir réinitialiser entièrement votre club ? Toute votre trésorerie et vos cartes de joueurs holographes seront définitivement effacées !");
        if (langConfirm) {
            state.reset();
        }
    });

    // Global document interaction to unlock Web Audio API Context
    document.body.addEventListener("click", () => {
        audio.init();
    }, { once: true });
}

function buyUpgradeHandler(id) {
    if (state.buyUpgrade(id)) {
        audio.playPurchaseSound();
        ui.updateHUD(state);
        ui.renderUpgrades(state, buyUpgradeHandler);
    }
}

function showOutcomeModal(icon, title, subtitle, desc, isSuccess = true) {
    const iconEl = document.getElementById("outcome-icon");
    const titleEl = document.getElementById("outcome-title");
    const subEl = document.getElementById("outcome-subtitle");
    const descEl = document.getElementById("outcome-desc-text");
    const modal = document.getElementById("outcome-modal");
    
    if (!iconEl || !titleEl || !subEl || !descEl || !modal) return;
    
    iconEl.innerText = icon;
    titleEl.innerText = title.toUpperCase();
    titleEl.style.color = isSuccess ? "var(--neon-green)" : "var(--neon-red)";
    if (icon === "🏆") titleEl.style.color = "var(--neon-gold)";
    
    subEl.innerText = subtitle.toUpperCase();
    descEl.innerText = desc;
    
    modal.style.display = "flex";
}

/* --- ACTIVE RANDOM EVENTS & MINI-GAMES CORE ENGINE --- */

let currentEvent = ""; // "penalty", "press", "audit"
let eventTimeoutId = null;
let nextEventTime = 40 + Math.random() * 30; // 40 to 70 seconds randomly
let eventTimer = 0;

function startRandomEventTimer() {
    setInterval(() => {
        // Only spawn events if the tutorial is completed, and we aren't currently inside a modal
        const unboxingOpen = document.getElementById("unboxing-modal").style.display === "flex";
        const penaltyOpen = document.getElementById("penalty-modal").style.display === "flex";
        const pressOpen = document.getElementById("press-modal").style.display === "flex";
        const auditOpen = document.getElementById("audit-modal").style.display === "flex";
        
        if (state.isTutorialCompleted && !unboxingOpen && !penaltyOpen && !pressOpen && !auditOpen) {
            eventTimer++;
            if (eventTimer >= nextEventTime) {
                eventTimer = 0;
                nextEventTime = 40 + Math.random() * 30; // random interval
                spawnRandomEvent();
            }
        }
    }, 1000);
}

function spawnRandomEvent() {
    const btn = document.getElementById("random-event-btn");
    if (!btn || btn.style.display === "flex") return;

    const eventTypes = ["penalty", "press", "audit"];
    currentEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    // Render corresponding icon on floating balloon
    if (currentEvent === "penalty") btn.innerText = "⚽";
    else if (currentEvent === "press") btn.innerText = "🎤";
    else btn.innerText = "💼";

    // Absolute position coords inside app boundaries
    const paddingX = 70;
    const paddingY = 130;
    const x = paddingX + Math.random() * (window.innerWidth - paddingX * 2);
    const y = paddingY + Math.random() * (window.innerHeight - paddingY * 2 - 80);

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.style.display = "flex";

    // Play high notification beep
    audio.playNote(880, 0, 0.08, 'sine', 0.2);
    audio.playNote(1100, 0.05, 0.15, 'sine', 0.2);

    // 12 second lifespan, then fades away
    eventTimeoutId = setTimeout(() => {
        btn.style.display = "none";
    }, 12000);
}

// --- MINI-GAME 1: PENALTY SHOOTOUT ---

let penaltySliderPos = 0;
let penaltyDirection = 1;
let penaltyAnimId = null;
let isPenaltyActive = false;
let lastTime = 0; // Framerate independence tracker

function startPenaltyGame() {
    isPenaltyActive = true;
    penaltySliderPos = 0;
    penaltyDirection = 1;
    lastTime = performance.now(); // Reset time on start!

    // Plongeon initial aléatoire du gardien (visuel)
    const keeper = document.getElementById("keeper-emoji");
    if (keeper) keeper.style.left = Math.random() < 0.5 ? "10%" : "80%";

    const instruction = document.getElementById("penalty-instruction");
    if (instruction) {
        instruction.innerText = state.lang === "en" ? "AIM YOUR SHOT IN THE GREEN ZONE" : "CADREZ VOTRE TIR DANS LA ZONE VERTE";
    }

    document.getElementById("penalty-modal").style.display = "flex";

    function animate(timestamp) {
        if (!isPenaltyActive) return;

        if (!timestamp) timestamp = performance.now();
        const dt = (timestamp - lastTime) / 16.666; // Normalize to 60fps
        lastTime = timestamp;

        // Oscillation linéaire ralentie pour plus de précision et indépendante du taux de rafraîchissement d'écran !
        penaltySliderPos += 2.4 * penaltyDirection * Math.min(dt, 3);
        if (penaltySliderPos >= 100) {
            penaltySliderPos = 100;
            penaltyDirection = -1;
        } else if (penaltySliderPos <= 0) {
            penaltySliderPos = 0;
            penaltyDirection = 1;
        }

        const slider = document.getElementById("timing-slider");
        if (slider) slider.style.left = `${penaltySliderPos}%`;

        penaltyAnimId = requestAnimationFrame(animate);
    }
    penaltyAnimId = requestAnimationFrame(animate);
}

function shootPenalty() {
    if (!isPenaltyActive) return;
    isPenaltyActive = false;
    cancelAnimationFrame(penaltyAnimId);

    // Zone verte gagnante élargie entre 35% et 65% pour simplifier le jeu !
    const isSuccess = penaltySliderPos >= 35 && penaltySliderPos <= 65;
    const instruction = document.getElementById("penalty-instruction");
    const keeper = document.getElementById("keeper-emoji");

    if (isSuccess) {
        // Goal scored!
        if (keeper) keeper.style.left = "calc(50% - 14px)"; // dive center
        instruction.innerText = state.lang === "en" ? "⚽ GOAL !!! BONUS GRANTED!" : "⚽ BUT !!! BONUS ACCORDÉ !";
        instruction.style.color = "var(--neon-green)";

        // Success sound
        audio.playNote(523.25, 0, 0.1, 'sine');
        audio.playNote(659.25, 0.08, 0.1, 'sine');
        audio.playNote(783.99, 0.16, 0.45, 'sine');

        // Gagne l'équivalent de 5 minutes de passif !
        const reward = state.incomePerSec * 300;
        state.addMoney(reward);
        ui.updateHUD(state);

        if (state.lang === "en") {
            showOutcomeModal("⚽", "DECISIVE GOAL!", "BONUS GRANTED!", `Your star forward drills the ball right into the top corner! The stadium erupts!\n\nImmediate fan reward: +${ui.formatMoney(reward)}!`, true);
        } else {
            showOutcomeModal("⚽", "BUT DÉCISIF !", "MALUS ÉVITÉ & BONUS ACCORDÉ !", `Votre attaquant star loge le ballon en pleine lucarne d'un tir dévastateur ! Le stade s'embrase !\n\nRécompense de ferveur immédiate : +${ui.formatMoney(reward)} !`, true);
        }
    } else {
        // Goal saved!
        if (keeper) keeper.style.left = penaltySliderPos < 40 ? "20%" : "70%";
        instruction.innerText = state.lang === "en" ? "🧤 SAVED! PUBLIC DISAPPOINTMENT..." : "🧤 ARRÊTÉ ! LE STADE COULE SOUS LES SIFFLETS...";
        instruction.style.color = "var(--neon-red)";

        // Fail sound
        audio.playNote(220, 0, 0.28, 'sawtooth', 0.2);

        // Malus de ferveur : -20% de revenus passifs pendant 60s
        state.passiveMultBonus = 0.8;
        state.activeBuffName = state.lang === "fr" ? "🚨 SANS FERVEUR (Penalty Manqué)" : "🚨 LOW ENTHUSIASM (Missed Penalty)";
        state.activeBuffTime = 60;
        state.recalculateRates();
        ui.updateHUD(state);

        if (state.lang === "en") {
            showOutcomeModal("🧤", "SHOT SAVED!", "THE STADIUM COVERS IN BOOS...", `The opposing goalkeeper brillianty saves your shot with a magnificent dive!\n\nYour fans are disappointed: -20% passive income for 60 seconds!`, false);
        } else {
            showOutcomeModal("🧤", "TENTATIVE ARRÊTÉE !", "LE STADE COULE SOUS LES SIFFLETS...", `Le gardien de but adverse intercepte brillamment votre ballon d'une claquette impériale !\n\nVos supporters boudent : -20% de revenus passifs pendant 60 secondes !`, false);
        }
    }

    setTimeout(() => {
        document.getElementById("penalty-modal").style.display = "none";
        instruction.innerText = state.lang === "en" ? "AIM YOUR SHOT IN THE GREEN ZONE" : "CADREZ VOTRE TIR DANS LA ZONE VERTE";
        instruction.style.color = "var(--neon-green)";
    }, 1800);
}

// --- MINI-GAME 2: PRESS CONFERENCE ---

const PRESS_QUESTIONS = [
    {
        fr: {
            q: "« Vos transferts astronomiques frôlent la provocation. Comment réagissez-vous face à l'indignation générale ? »",
            a: {
                text: "« Nous investissons massivement pour l'économie locale et créons des emplois de supporters. »",
                success: "🤝 OPINION PUBLIQUE SÉDUITE !\n\nVotre diplomatie convainc la presse et apaise les tensions.\n\nBonus : +15% de revenus passifs pendant 120 secondes !",
                fail: "🧱 PASSE D'ARMES FROIDE...\n\nLes journalistes boudent votre langue de bois politique.\n\nMalus : -5% de valeur de clic pendant 60 secondes !",
                buff_success: "🤝 PRESSE POSITIVE (+15% passif)",
                buff_fail: "🧱 LANGUE DE BOIS (-5% clics)"
            },
            b: {
                text: "« Je suis milliardaire, je dépense mon argent comme bon me semble ! Ce club m'appartient ! »",
                success: "🔥 BUZZ MONDIAL EXTRÊME !\n\nVotre arrogance fait le tour du globe et propulse l'image marketing du club au sommet de la Hype !\n\nBonus : +50% de revenus passifs pendant 120 secondes !",
                fail: "🚨 BAD BUZZ MASSIF !\n\nBoycott immédiat de la boutique et colère noire des associations de supporters !\n\nMalus : -30% de revenus passifs pendant 90 secondes !",
                buff_success: "🔥 ULTRA HYPE MONDIALE (+50% passif)",
                buff_fail: "🚨 BOYCOTT PUBLIC (-30% passif)"
            }
        },
        en: {
            q: "« Your astronomical transfers border on provocation. How do you respond to the general public outrage? »",
            a: {
                text: "« We invest heavily in the local economy and create supporter jobs. »",
                success: "🤝 PUBLIC OPINION SEDUCED!\n\nYour diplomacy convinces the press and defuses tension.\n\nBonus: +15% passive income for 120 seconds!",
                fail: "🧱 COLD STANDOFF...\n\nJournalists are unimpressed by your political jargon.\n\nMalus: -5% click value for 60 seconds!",
                buff_success: "🤝 POSITIVE PRESS (+15% passive)",
                buff_fail: "🧱 POLITICAL JARGON (-5% clicks)"
            },
            b: {
                text: "« I am a billionaire, I spend my money as I please! This club belongs to me! »",
                success: "🔥 EXTREME GLOBAL BUZZ!\n\nYour arrogance travels around the world and propels the club's marketing image to the top of the Hype!\n\nBonus: +50% passive income for 120 seconds!",
                fail: "🚨 MASSIVE OUTCRY!\n\nImmediate club shop boycott and angry supporter associations!\n\nMalus: -30% passive income for 90 seconds!",
                buff_success: "🔥 GLOBAL ULTRA HYPE (+50% passive)",
                buff_fail: "🚨 PUBLIC BOYCOTT (-30% passive)"
            }
        },
        a: {
            successChance: 0.75,
            apply: (rolled) => {
                if (rolled) {
                    state.passiveMultBonus = 1.15;
                    state.activeBuffTime = 120;
                } else {
                    state.clickMultBonus = 0.95;
                    state.activeBuffTime = 60;
                }
            }
        },
        b: {
            successChance: 0.35,
            apply: (rolled) => {
                if (rolled) {
                    state.passiveMultBonus = 1.50;
                    state.activeBuffTime = 120;
                } else {
                    state.passiveMultBonus = 0.70;
                    state.activeBuffTime = 90;
                }
            }
        }
    },
    {
        fr: {
            q: "« Certains disent que vous soudoyez secrètement l'arbitrage. Que répondez-vous à ces graves accusations ? »",
            a: {
                text: "« C'est absurde. L'éthique sportive et la transparence sont gravées au cœur de Billionaire FC ! »",
                success: "🤝 ÉTHIQUE RECONNUE !\n\nLa commission vous blanchit publiquement. Les sponsors saluent votre intégrité.\n\nBonus : +15% de revenus passifs pendant 120 secondes !",
                fail: "🧱 SUSPICION PERSISTANTE...\n\nVotre déni n'a convaincu personne à l'antenne.\n\nMalus : -5% de valeur de clic pendant 60 secondes !",
                buff_success: "🤝 INTÉGRITÉ APPRÉCIÉE (+15% passif)",
                buff_fail: "🧱 SUSPICION (-5% clics)"
            },
            b: {
                text: "« S'ils font de bons arbitrages, ils méritent bien des petites enveloppes de temps en temps... »",
                success: "🔥 MAFIA CHIC VIRALE !\n\nVotre provocation cynique amuse les milieux branchés et devient un meme viral ! Le marketing explose !\n\nBonus : +50% de revenus passifs pendant 120 secondes !",
                fail: "🚨 INVESTIGATION INTERNATIONALE !\n\nL'UEFA ouvre une enquête formelle de corruption. Gel immédiat de sponsors !\n\nMalus : -30% de revenus passifs pendant 90 secondes !",
                buff_success: "🔥 CORRUPTION MEME (+50% passif)",
                buff_fail: "🚨 ENQUÊTE UEFA (-30% passif)"
            }
        },
        en: {
            q: "« Some say you secretly bribe referees. What is your response to these serious accusations? »",
            a: {
                text: "« That's absurd. Sporting ethics and transparency are engraved in the heart of Billionaire FC! »",
                success: "🤝 ETHICS RECOGNIZED!\n\nThe commission publicly clears your name. Sponsors praise your integrity.\n\nBonus: +15% passive income for 120 seconds!",
                fail: "🧱 PERSISTENT SUSPICION...\n\nYour denial convinced no one on air.\n\nMalus: -5% click value for 60 seconds!",
                buff_success: "🤝 INTEGRITY APPRECIATED (+15% passive)",
                buff_fail: "🧱 SUSPICION (-5% clicks)"
            },
            b: {
                text: "« If they referee well, they deserve small envelopes from time to time... »",
                success: "🔥 VIRAL MAFIA STYLE!\n\nYour cynical provocation amuses trendy circles and becomes a viral meme! Marketing explodes!\n\nBonus: +50% passive income for 120 seconds!",
                fail: "🚨 INTERNATIONAL AUDIT!\n\nUEFA opens a formal bribery investigation. Immediate sponsor freezing!\n\nMalus: -30% passive income for 90 seconds!",
                buff_success: "🔥 CORRUPTION MEME (+50% passive)",
                buff_fail: "🚨 UEFA AUDIT (-30% passive)"
            }
        },
        a: {
            successChance: 0.75,
            apply: (rolled) => {
                if (rolled) {
                    state.passiveMultBonus = 1.15;
                    state.activeBuffTime = 120;
                } else {
                    state.clickMultBonus = 0.95;
                    state.activeBuffTime = 60;
                }
            }
        },
        b: {
            successChance: 0.35,
            apply: (rolled) => {
                if (rolled) {
                    state.passiveMultBonus = 1.50;
                    state.activeBuffTime = 120;
                } else {
                    state.passiveMultBonus = 0.70;
                    state.activeBuffTime = 90;
                }
            }
        }
    }
];

let currentPressQuestion = null;

function startPressGame() {
    currentPressQuestion = PRESS_QUESTIONS[Math.floor(Math.random() * PRESS_QUESTIONS.length)];

    const lang = state.lang;
    const qBlock = currentPressQuestion[lang];

    document.getElementById("press-question-text").innerText = qBlock.q;
    document.getElementById("press-choice-a-text").innerText = qBlock.a.text;
    document.getElementById("press-choice-b-text").innerText = qBlock.b.text;

    document.getElementById("press-modal").style.display = "flex";
}

function choosePressOption(option) {
    const q = currentPressQuestion;
    const lang = state.lang;
    const qBlock = q[lang];
    const logicBlock = option === 'a' ? q.a : q.b;
    const textBlock = option === 'a' ? qBlock.a : qBlock.b;

    document.getElementById("press-modal").style.display = "none";

    const roll = Math.random();
    const isSuccess = roll <= logicBlock.successChance;

    // Apply state consequence
    logicBlock.apply(isSuccess);
    state.activeBuffName = isSuccess ? textBlock.buff_success : textBlock.buff_fail;
    
    state.recalculateRates();
    ui.updateHUD(state);

    const icon = option === 'a' ? "🤝" : "🔥";
    const title = isSuccess ? (lang === "en" ? "PRESS SUCCESS!" : "SUCCÈS PRESSE !") : (lang === "en" ? "PRESS DISASTER!" : "BAD BUZZ MÉDIATIQUE !");
    const outcomeText = isSuccess ? textBlock.success : textBlock.fail;

    // Play outcome chime
    if (isSuccess) {
        audio.playNote(523.25, 0, 0.1, 'sine');
        audio.playNote(783.99, 0.1, 0.3, 'sine');
    } else {
        audio.playNote(180, 0, 0.3, 'sawtooth', 0.2);
    }

    showOutcomeModal(icon, title, isSuccess ? (lang === "en" ? "PUBLIC ADMIRATION" : "OPINION PUBLIQUE SÉDUITE") : (lang === "en" ? "PUBLIC OUTCRY" : "BOYCOTT PUBLIC"), outcomeText, isSuccess);
}

// --- MINI-GAME 3: FINANCIAL FAIR PLAY AUDIT ---

let auditTimer = 0;
let auditInterval = null;
let auditTargetCount = 0;
let isAuditFalsifying = false;

function startAuditGame() {
    auditTargetCount = 0;
    isAuditFalsifying = false;
    document.getElementById("btn-start-audit").style.display = "block";
    
    if (state.lang === "en") {
        document.getElementById("btn-start-audit").innerText = "START FALSIFICATION! ✍️";
        document.getElementById("audit-instructions").innerHTML = "The UEFA control commission is auditing your books! Urgently click on the <strong>5 confidential documents</strong> appearing on screen to falsify reports before the timer runs out (9s)!";
        document.getElementById("audit-timer-txt").innerText = "💼 FINANCIAL FAIR PLAY CONTROL";
    } else {
        document.getElementById("btn-start-audit").innerText = "LANCER LA FALSIFICATION ! ✍️";
        document.getElementById("audit-instructions").innerHTML = "La commission de contrôle de l'UEFA inspecte vos comptes ! Cliquez d'urgence sur les <strong>5 documents confidentiels</strong> à l'écran pour falsifier vos bilans avant la fin du temps imparti (9s) !";
        document.getElementById("audit-timer-txt").innerText = "💼 CONTRÔLE DU FAIR-PLAY FINANCIER";
    }

    document.getElementById("audit-modal").style.display = "flex";
}

function beginFalsification() {
    isAuditFalsifying = true;
    document.getElementById("btn-start-audit").style.display = "none";
    
    if (state.lang === "en") {
        document.getElementById("audit-instructions").innerText = "FALSIFICATION IN PROGRESS! FIND AND SIGN REPORT DOCUMENTS!";
        auditTimer = 9.0;
        document.getElementById("audit-timer-txt").innerText = `HURRY UP: AUDIT IN PROGRESS (${auditTimer.toFixed(1)}s)`;
    } else {
        document.getElementById("audit-instructions").innerText = "FALSIFICATION EN COURS ! TROUVEZ ET SIGNEZ LES RAPPORTS CONFIDENTIELS !";
        auditTimer = 9.0;
        document.getElementById("audit-timer-txt").innerText = `DÉPÊCHEZ-VOUS : AUDIT EN COURS (${auditTimer.toFixed(1)}s)`;
    }

    spawnAuditPaper();

    auditInterval = setInterval(() => {
        auditTimer -= 0.1;
        if (auditTimer <= 0) {
            auditTimer = 0;
            clearInterval(auditInterval);
            onAuditFailure();
        } else {
            const timerText = state.lang === "en" ? `HURRY UP: AUDIT IN PROGRESS (${auditTimer.toFixed(1)}s)` : `DÉPÊCHEZ-VOUS : AUDIT EN COURS (${auditTimer.toFixed(1)}s)`;
            document.getElementById("audit-timer-txt").innerText = timerText;
        }
    }, 100);
}

function spawnAuditPaper() {
    if (!isAuditFalsifying) return;

    // Supprimer d'anciennes feuilles confidentielles
    const old = document.querySelector(".audit-paper-target");
    if (old) old.remove();

    const paper = document.createElement("button");
    paper.className = "audit-paper-target";
    paper.innerText = "📄";

    // Coordonnées aléatoires au milieu de l'écran
    const paddingX = 100;
    const paddingY = 160;
    const x = paddingX + Math.random() * (window.innerWidth - paddingX * 2);
    const y = paddingY + Math.random() * (window.innerHeight - paddingY * 2 - 40);

    paper.style.left = `${x}px`;
    paper.style.top = `${y}px`;

    document.body.appendChild(paper);

    paper.addEventListener("click", () => {
        audio.playNote(600, 0, 0.05, 'triangle'); // cachet d'approbation

        auditTargetCount++;
        paper.remove();

        if (auditTargetCount >= 5) {
            clearInterval(auditInterval);
            onAuditSuccess();
        } else {
            spawnAuditPaper();
        }
    });
}

function onAuditSuccess() {
    isAuditFalsifying = false;
    document.getElementById("audit-modal").style.display = "none";

    audio.playNote(523.25, 0, 0.1, 'sine');
    audio.playNote(659.25, 0.08, 0.1, 'sine');
    audio.playNote(783.99, 0.16, 0.45, 'sine');

    // Gains de passif +30% pendant 180s (3 minutes) !
    state.passiveMultBonus = 1.30;
    state.activeBuffName = state.lang === "fr" ? "💼 AUDIT VALIDE (+30% passif)" : "💼 APPROVED REPORTS (+30% passive)";
    state.activeBuffTime = 180;
    state.recalculateRates();
    ui.updateHUD(state);

    if (state.lang === "en") {
        showOutcomeModal("💼", "AUDIT SUCCESSFUL!", "FORGERY WITHOUT DETECTION!", `Congratulations, you have skillfully falsified all expenditure reports! The commission is none the wiser!\n\nFinancial Immunity: +30% passive income for 3 minutes!`, true);
    } else {
        showOutcomeModal("💼", "AUDIT COMPTABLE CERTIFIÉ !", "CERTIFICATION SANS FRAUDE !", `Félicitations, vous avez habilement falsifié tous vos rapports de dépenses ! La commission n'y voit que du feu !\n\nImmunité financière : +30% de revenus passifs pendant 3 minutes !`, true);
    }
}

function onAuditFailure() {
    isAuditFalsifying = false;
    document.getElementById("audit-modal").style.display = "none";

    const old = document.querySelector(".audit-paper-target");
    if (old) old.remove();

    audio.playNote(220, 0, 0.3, 'sawtooth', 0.25);

    // Amende lourde de 15% du solde total !
    const fine = state.money * 0.15;
    state.spendMoney(fine);
    ui.updateHUD(state);

    if (state.lang === "en") {
        showOutcomeModal("💼", "FINANCIAL FRAUD DETECTED!", "ACCOUNTING VIOLATION!", `The audit commission exposed massive hidden transfer bribes!\n\nUEFA imposes an immediate fine on your club: -15% of your total treasury (Fine: ${ui.formatMoney(fine)})!`, false);
    } else {
        showOutcomeModal("💼", "FRAUDE FINANCIÈRE DÉTECTÉE !", "INFRACTION AUX COMPTES !", `La commission d'audit démasque d'importants pots-de-vins de transferts dissimulés !\n\nL'UEFA inflige une amende immédiate à votre club : -15% de votre trésorerie globale (Amende : ${ui.formatMoney(fine)}) !`, false);
    }
}

// --- SECRET UNBOXING GAME FOR MYTHIC RONALDINHO ---

let isJongleActive = false;
let shouldStartJongleOnClose = false; // Delayed start flag for custom modal support
let jongleClicks = 0;
let ballY = 0;
let ballX = 0;
let ballVelY = 0;
let ballVelX = 0;
let jongleAnimId = null;
let lastJongleTime = 0; // Framerate independence tracker

function checkRosterComplete() {
    // Loop through all standard cards (not secret) and check if they are unlocked (level >= 1)
    const standardCards = CARDS_DATA.filter(c => !c.isSecret);
    for (let i = 0; i < standardCards.length; i++) {
        const c = standardCards[i];
        if ((state.cards[c.id] || 0) === 0) {
            return false; // found a locked standard card!
        }
    }
    return true; // all standard cards are unlocked!
}

function spawnGoldenBall() {
    const ballBtn = document.getElementById("jongle-ball");
    if (!ballBtn || isJongleActive || shouldStartJongleOnClose) return;

    shouldStartJongleOnClose = true; // wait until user closes informative modal to start gravity physics!
    jongleClicks = 0;

    // Position ball at top center of screen (spawns visible near the top!)
    ballX = window.innerWidth / 2 - 45; // Adjusted to center a 90px wide ball!
    ballY = 20; // Starts visible at the top (avoiding off-screen acceleration!)

    ballVelY = 0.2; // Starts very slowly from rest, letting player react comfortably!
    ballVelX = (Math.random() - 0.5) * 1.5; // Very minor initial drift

    ballBtn.style.left = `${ballX}px`;
    ballBtn.style.top = `${ballY}px`;
    ballBtn.style.display = "none"; // hidden until game starts
    ballBtn.innerText = "⚽"; // show golden soccer ball

    // Play golden chime alert
    audio.playNote(523.25, 0, 0.1, 'sine');
    audio.playNote(659.25, 0.05, 0.1, 'sine');
    audio.playNote(783.99, 0.1, 0.1, 'sine');
    audio.playNote(1046.50, 0.15, 0.5, 'sine');

    // Show custom modal instead of clunky alert!
    showOutcomeModal(
        "⚽", 
        "BALLON DORÉ DÉTECTÉ !", 
        "L'ESPRIT DU JOGA BONITO SE RÉVEILLE !", 
        "Un ballon doré étincelant survole le stade ! Cliquez vite 3 fois d'affilée sur le ballon d'or pour jongler avec lui sans le laisser retomber au sol et débloquer une légende !", 
        true
    );
}

function updatePhysics(timestamp) {
    if (!isJongleActive) return;

    if (!timestamp) timestamp = performance.now();
    const dt = (timestamp - lastJongleTime) / 16.666; // Normalize to 60fps
    lastJongleTime = timestamp;

    const ballBtn = document.getElementById("jongle-ball");
    if (!ballBtn) return;
    
    // Display ball now that game is active!
    ballBtn.style.display = "flex";

    // Apply mock gravity (reduced from 0.22 to 0.15, now fully framerate-independent!)
    ballVelY += 0.15 * Math.min(dt, 3);

    ballX += ballVelX * Math.min(dt, 3);
    ballY += ballVelY * Math.min(dt, 3);

    // Wall collisions bounce left/right
    if (ballX <= 0) {
        ballX = 0;
        ballVelX *= -1;
    } else if (ballX >= window.innerWidth - 95) { // Adjusted to match 90px ball width plus borders!
        ballX = window.innerWidth - 95;
        ballVelX *= -1;
    }

    ballBtn.style.left = `${ballX}px`;
    ballBtn.style.top = `${ballY}px`;

    // Check if the ball fell past the bottom of the screen
    if (ballY > window.innerHeight) {
        onJongleFail();
    } else {
        jongleAnimId = requestAnimationFrame(updatePhysics);
    }
}

function handleJongleClick(e) {
    if (!isJongleActive) return;

    // Kick up! (reduced height from -8.5 to -6.8 to match slower gravity perfectly!)
    ballVelY = -6.8; // propel upwards
    ballVelX = (Math.random() - 0.5) * 4.5; // random side drift

    // Play bounce sfx
    audio.playNote(400 + jongleClicks * 100, 0, 0.08, 'triangle');

    jongleClicks++;

    // Floating "+1 JONGLE" text
    ui.showFloatingText(`JONGLE +${jongleClicks}`, e.clientX, e.clientY);

    // Required clicks reduced from 5 to 3 for simplified accessible success!
    if (jongleClicks >= 3) {
        onJongleSuccess();
    }
}

function onJongleSuccess() {
    isJongleActive = false;
    cancelAnimationFrame(jongleAnimId);

    const ballBtn = document.getElementById("jongle-ball");
    if (ballBtn) ballBtn.style.display = "none";

    // Unlock Ronaldinho!
    const isNew = state.addCard("ronaldinho");
    ui.renderDeck(state, showCardDetailHandler);

    // Play mythic chime fanfare!
    audio.playUnboxFanfare("legendary");

    // Show custom unboxing reveal modal for Ronaldinho
    const ronaldinhoCard = CARDS_DATA.find(c => c.id === "ronaldinho");
    ui.showUnboxing(ronaldinhoCard, isNew);
}

function onJongleFail() {
    isJongleActive = false;
    cancelAnimationFrame(jongleAnimId);

    const ballBtn = document.getElementById("jongle-ball");
    if (ballBtn) ballBtn.style.display = "none";

    // Play failure buzz
    audio.playNote(150, 0, 0.25, 'sawtooth', 0.2);

    showOutcomeModal("⚽", "BALLON RETOMBÉ !", "JOGA BONITO MANQUÉ", "Mince ! Le ballon doré a touché le sol ! Pas de panique, le ballon d'or réapparaîtra de manière automatique et aléatoire en tâche de fond pour vous offrir une nouvelle chance de débloquer la légende !", false);
}
