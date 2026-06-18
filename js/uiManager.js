/* --- DOM RENDERING AND GRAPHICAL EFFECTS MANAGER --- */

class UiManager {
    constructor() {
        this.moneyDisplay = document.getElementById("money-display");
        this.incomeSecHud = document.getElementById("income-sec-hud");
        this.clubName = document.getElementById("club-name");
        this.clubLeague = document.getElementById("club-league");
        this.clubEmoji = document.getElementById("club-emoji");
        this.collectedCount = document.getElementById("collected-cards-count");
        this.globalMultText = document.getElementById("global-cards-mult");
        this.clickValueTxt = document.getElementById("click-value-txt");
        
        this.upgradesList = document.getElementById("upgrades-list");
        this.cardsGrid = document.getElementById("cards-grid");
        
        // Modals
        this.unboxingModal = document.getElementById("unboxing-modal");
        this.statsModal = document.getElementById("stats-modal");
    }

    // --- SCIENTIFIC-SHORTHAND NUMBER FORMATTING ---
    // Beautifully formats numbers ($1,245.50 ➔ $1.25k ➔ $14.50M ➔ $2.00B ➔ $1.50T)
    formatMoney(val) {
        if (typeof val !== 'number' || isNaN(val)) return "$0.00";
        if (val < 1000) {
            return `$${val.toFixed(2)}`;
        }
        
        const suffixes = [
            { limit: 1e6, scale: 1e3, suffix: "k" },
            { limit: 1e9, scale: 1e6, suffix: "M" },
            { limit: 1e12, scale: 1e9, suffix: "B" },
            { limit: 1e15, scale: 1e12, suffix: "T" },
            { limit: Infinity, scale: 1e15, suffix: "Qa" }
        ];

        for (let i = 0; i < suffixes.length; i++) {
            const item = suffixes[i];
            if (val < item.limit) {
                return `$${(val / item.scale).toFixed(2)}${item.suffix}`;
            }
        }
        return `$${val.toFixed(2)}`;
    }

    formatPercent(val) {
        return `+${(val * 100).toFixed(0)}%`;
    }

    // --- CORE RENDERING ---
    updateHUD(state) {
        const dict = TRANSLATIONS[state.lang];
        this.moneyDisplay.innerText = this.formatMoney(state.money);
        this.incomeSecHud.innerText = `+${this.formatMoney(state.incomePerSec)} / sec`;
        this.clubLeague.innerText = state.getLeagueName();
        this.clubEmoji.innerText = `${state.getLeagueEmoji()} ${state.prestigeCups > 0 ? ` x${state.prestigeCups} 🏆` : ""}`;
        this.clickValueTxt.innerText = `${dict.click_value_label}${this.formatMoney(state.clickValue)}`;
        
        // Update pack button disabling states based on current money
        const bronzeBtn = document.getElementById("btn-pack-bronze");
        const silverBtn = document.getElementById("btn-pack-silver");
        const goldBtn = document.getElementById("btn-pack-gold");
        
        if (bronzeBtn) bronzeBtn.disabled = state.money < PACKS_CONFIG.bronze.cost;
        if (silverBtn) silverBtn.disabled = state.money < PACKS_CONFIG.silver.cost;
        if (goldBtn) goldBtn.disabled = state.money < PACKS_CONFIG.gold.cost;

        // Update Rebirth / Prestige button state
        const prestigeBtn = document.getElementById("btn-prestige");
        if (prestigeBtn) {
            const isEligible = state.money >= 1000000000; // $1.00B minimum (increased to 1B!)
            
            if (isEligible) {
                prestigeBtn.classList.add("pulse-glow");
                prestigeBtn.style.animation = "glow-anim 1s infinite alternate";
                prestigeBtn.style.borderColor = "var(--neon-gold)";
                prestigeBtn.style.opacity = "1";
                prestigeBtn.style.cursor = "pointer";
            } else {
                prestigeBtn.classList.remove("pulse-glow");
                prestigeBtn.style.animation = "none";
                prestigeBtn.style.borderColor = "rgba(255,255,255,0.08)";
                prestigeBtn.style.opacity = "0.4";
                prestigeBtn.style.cursor = "pointer"; // Keep pointer so they can click to read info!
            }
        }
    }

    renderUpgrades(state, onBuyCallback) {
        this.upgradesList.innerHTML = "";
        const dict = TRANSLATIONS[state.lang];
        const suffixLevel = state.lang === 'fr' ? 'par niveau' : 'per level';

        UPGRADES_DATA.forEach(up => {
            const level = state.upgrades[up.id] || 0;
            const cost = state.getUpgradeCost(up.id);
            const currentYield = state.getUpgradeYield(up.id);
            const isAffordable = state.money >= cost;
            
            const upgradeEl = document.createElement("div");
            upgradeEl.className = `upgrade-item ${isAffordable ? "" : "disabled"}`;
            upgradeEl.dataset.id = up.id;

            const upName = dict[`up_${up.id}`] || up.name;
            const upDesc = up[state.lang].desc;

            upgradeEl.innerHTML = `
                <div class="upgrade-icon">${up.icon}</div>
                <div class="upgrade-info">
                    <div class="upgrade-name-row">
                        <span class="upgrade-name" title="${upDesc}">${upName}</span>
                        <span class="upgrade-level">Lv. ${level}</span>
                    </div>
                    <span class="upgrade-yield">+${this.formatMoney(up.baseYield * (1 + state.globalCardsMult))} / sec ${suffixLevel}</span>
                    <div class="upgrade-cost-row">
                        <span class="upgrade-cost-label">${dict.invest_label}</span>
                        <span class="upgrade-cost">${this.formatMoney(cost)}</span>
                    </div>
                </div>
            `;

            // On click handle
            upgradeEl.addEventListener("click", () => {
                if (state.money >= cost) {
                    onBuyCallback(up.id);
                }
            });

            this.upgradesList.appendChild(upgradeEl);
        });
    }

    updateUpgradesAffordability(state) {
        const items = this.upgradesList.querySelectorAll(".upgrade-item");
        items.forEach(item => {
            const id = item.dataset.id;
            const cost = state.getUpgradeCost(id);
            const isAffordable = state.money >= cost;
            if (isAffordable) {
                item.classList.remove("disabled");
            } else {
                item.classList.add("disabled");
            }
        });
    }

    renderDeck(state, onCardClickCallback) {
        this.cardsGrid.innerHTML = "";
        
        let ownedCount = 0;
        CARDS_DATA.forEach(c => {
            const level = state.cards[c.id] || 0;
            const isUnlocked = level > 0;
            
            // If the card is secret and NOT unlocked, keep it completely hidden!
            if (c.isSecret && !isUnlocked) {
                return;
            }
            
            // Exclude secret cards from the total standard roster count (out of 24)
            if (isUnlocked && !c.isSecret) ownedCount++;

            const cardWrapper = document.createElement("div");
            cardWrapper.className = "card-wrapper";

            const cardEl = document.createElement("div");
            cardEl.className = `card-item ${c.rarity} ${isUnlocked ? "" : "locked"}`;
            cardEl.dataset.id = c.id;

            // Inside content
            if (isUnlocked) {
                cardEl.style.cursor = "pointer"; // Add pointer cursor
                cardEl.addEventListener("click", () => {
                    if (onCardClickCallback) onCardClickCallback(c.id);
                });

                const isImage = c.portrait.includes(".") || c.portrait.startsWith("http") || c.portrait.startsWith("data:image");
                const levelText = level === 5 ? "Lv. 5 (MAX)" : `Lv. ${level}`;
                
                if (isImage) {
                    cardEl.innerHTML = `
                        <img src="${c.portrait}" class="card-portrait-full">
                        <div class="card-inner full-art">
                            <div class="card-top">
                                <span class="card-rarity-tag">${c.rarity}</span>
                                <span class="card-level">${levelText}</span>
                            </div>
                            <div class="card-details">
                                <div class="card-name">${c.name}</div>
                                <div class="card-boost-text">+${(c.baseBoost * level * 100).toFixed(0)}% Boost</div>
                            </div>
                        </div>
                    `;
                } else {
                    cardEl.innerHTML = `
                        <div class="card-inner">
                            <div class="card-top">
                                <span class="card-rarity-tag">${c.rarity}</span>
                                <span class="card-level">${levelText}</span>
                            </div>
                            <div class="card-portrait">${c.portrait}</div>
                            <div class="card-details">
                                <div class="card-name">${c.name}</div>
                                <div class="card-boost-text">+${(c.baseBoost * level * 100).toFixed(0)}% Boost</div>
                            </div>
                        </div>
                    `;
                }
                
                // Add interactive 3D tilt effects
                this.bind3DTiltEvents(cardEl);
            } else {
                // Locked card layout (bilingual mystery)
                const lockedTag = state.lang === 'fr' ? '🔒 mystère' : '🔒 mystery';
                const lockedName = state.lang === 'fr' ? 'Verrouillé' : 'Locked';

                cardEl.innerHTML = `
                    <div class="card-inner">
                        <div class="card-top">
                            <span class="card-rarity-tag">${lockedTag}</span>
                        </div>
                        <div class="card-portrait" style="filter: brightness(0.1);">👤</div>
                        <div class="card-details" style="opacity: 0.4;">
                            <div class="card-name">${lockedName}</div>
                            <div class="card-boost-text">???</div>
                        </div>
                    </div>
                `;
            }

            cardWrapper.appendChild(cardEl);
            this.cardsGrid.appendChild(cardWrapper);
        });

        const dict = TRANSLATIONS[state.lang];
        const squadTitle = document.querySelector(".deck-title-container h3");
        if (squadTitle) {
            squadTitle.innerHTML = `${dict.your_squad_title} (<span id="collected-cards-count">${ownedCount}</span>/24)`;
            this.collectedCount = document.getElementById("collected-cards-count");
        }
        const globalBoostLabel = document.querySelector(".deck-title-container .global-mult-text");
        if (globalBoostLabel) {
            globalBoostLabel.innerHTML = `${dict.global_boost_label}<span id="global-cards-mult" class="text-green">+${(state.globalCardsMult * 100).toFixed(0)}%</span>`;
            this.globalMultText = document.getElementById("global-cards-mult");
        }
    }

    // --- HOLO UNBOXING REVEAL MODAL ---
    showUnboxing(card, isNew) {
        const title = document.getElementById("unboxing-title");
        const subtitle = document.getElementById("unboxing-subtitle");
        const container = document.getElementById("holo-card-container");
        const nameEl = document.getElementById("unboxed-player-name");
        const descEl = document.getElementById("unboxed-player-desc");

        const lang = state.lang; // access global state lang
        if (lang === "en") {
            title.innerText = isNew ? "CONTRACT SIGNED! 🎉" : "CONTRACT EXTENDED! 📈";
            subtitle.innerText = isNew ? "NEW RECRUIT IN YOUR ROSTER" : "DUPLICATE CARD: THE PLAYER RISES IN LEVEL";
            descEl.innerText = card.rarity === "legendary" ? `[LEGENDARY] ${card.en.desc}` : card.en.desc;
        } else {
            title.innerText = isNew ? "NÉGOCIATION RÉUSSIE ! 🎉" : "CONTRAT RECONDUIT ! 📈";
            subtitle.innerText = isNew ? "NOUVELLE RECRUTE DANS L'EFFECTIF" : "DOUBLON OBTENU : LE JOUEUR MONTE EN NIVEAU";
            descEl.innerText = card.rarity === "legendary" ? `[LÉGENDAIRE] ${card.fr.desc}` : card.fr.desc;
        }
        title.style.color = isNew ? "var(--neon-green)" : "var(--neon-cyan)";

        nameEl.innerText = card.name.toUpperCase();
        nameEl.style.color = `var(--rarity-${card.rarity})`;

        const isImage = card.portrait.includes(".") || card.portrait.startsWith("http") || card.portrait.startsWith("data:image");

        if (isImage) {
            container.innerHTML = `
                <div class="card-item ${card.rarity}" style="width: 100%; aspect-ratio: 5/7; transform: rotateY(0deg);">
                    <img src="${card.portrait}" class="card-portrait-full">
                    <div class="card-inner full-art">
                        <div class="card-top">
                            <span class="card-rarity-tag">${card.rarity}</span>
                            <span class="card-level">STAR</span>
                        </div>
                        <div class="card-details">
                            <div class="card-name" style="font-size: 1rem; font-weight: 900;">${card.name}</div>
                            <div class="card-boost-text" style="font-size: 0.8rem;">+${(card.baseBoost * 100).toFixed(0)}% global boost</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="card-item ${card.rarity}" style="width: 100%; aspect-ratio: 5/7; transform: rotateY(0deg);">
                    <div class="card-inner">
                        <div class="card-top">
                            <span class="card-rarity-tag">${card.rarity}</span>
                            <span class="card-level">STAR</span>
                        </div>
                        <div class="card-portrait" style="font-size: 4rem; margin: 15px 0;">${card.portrait}</div>
                        <div class="card-details">
                            <div class="card-name" style="font-size: 1rem; font-weight: 900;">${card.name}</div>
                            <div class="card-boost-text" style="font-size: 0.8rem;">+${(card.baseBoost * 100).toFixed(0)}% global boost</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Bind tilt to the modal card
        this.bind3DTiltEvents(container.querySelector(".card-item"));

        this.unboxingModal.style.display = "flex";
    }

    // --- CARD DETAIL MODAL SHOWCASE ---
    showCardDetail(card, level, state) {
        const modal = document.getElementById("card-detail-modal");
        const showcase = document.getElementById("card-detail-showcase-container");
        const nameEl = document.getElementById("card-detail-name");
        const rarityEl = document.getElementById("card-detail-rarity");
        const positionVal = document.getElementById("card-detail-position");
        const levelVal = document.getElementById("card-detail-level");
        const boostVal = document.getElementById("card-detail-boost");
        const descEl = document.getElementById("card-detail-desc");

        const isImage = card.portrait.includes(".") || card.portrait.startsWith("http") || card.portrait.startsWith("data:image");
        const levelText = level === 5 ? "Lv. 5 (MAX)" : `Lv. ${level}`;

        // Render card preview in the showcase
        if (isImage) {
            showcase.innerHTML = `
                <div class="card-item ${card.rarity}" style="width: 100%; aspect-ratio: 5/7; transform: rotateY(0deg); cursor: default;">
                    <img src="${card.portrait}" class="card-portrait-full">
                    <div class="card-inner full-art">
                        <div class="card-top">
                            <span class="card-rarity-tag">${card.rarity}</span>
                            <span class="card-level">${levelText}</span>
                        </div>
                        <div class="card-details">
                            <div class="card-name">${card.name}</div>
                            <div class="card-boost-text">+${(card.baseBoost * level * 100).toFixed(0)}% Boost</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            showcase.innerHTML = `
                <div class="card-item ${card.rarity}" style="width: 100%; aspect-ratio: 5/7; transform: rotateY(0deg); cursor: default;">
                    <div class="card-inner">
                        <div class="card-top">
                            <span class="card-rarity-tag">${card.rarity}</span>
                            <span class="card-level">${levelText}</span>
                        </div>
                        <div class="card-portrait" style="font-size: 4rem; margin: 15px 0;">${card.portrait}</div>
                        <div class="card-details">
                            <div class="card-name">${card.name}</div>
                            <div class="card-boost-text">+${(card.baseBoost * level * 100).toFixed(0)}% Boost</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Set metadata
        nameEl.innerText = card.name.toUpperCase();
        nameEl.style.color = `var(--rarity-${card.rarity})`;

        // Capitalize rarity
        const rarityText = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);
        rarityEl.innerText = rarityText;
        rarityEl.style.color = `var(--rarity-${card.rarity})`;

        // Localize Position
        let posText = card.position;
        if (state.lang === "en") {
            if (card.position === "Gardiens") posText = "Goalkeepers";
            else if (card.position === "Défenseurs") posText = "Defenders";
            else if (card.position === "Milieux") posText = "Midfielders";
            else if (card.position === "Attaquants") posText = "Forwards";
        }
        positionVal.innerText = posText;

        levelVal.innerText = levelText;
        boostVal.innerText = `+${(card.baseBoost * level * 100).toFixed(0)}% global boost`;
        descEl.innerText = card[state.lang].desc;

        // Bind interactive 3D tilt
        this.bind3DTiltEvents(showcase.querySelector(".card-item"));

        modal.style.display = "flex";
    }

    // --- FLOATING ACTIVE CASH NUMBERS (FLOATIES) ---
    showFloatingText(text, clientX, clientY) {
        const floater = document.createElement("span");
        floater.className = "click-floater";
        
        if (typeof text === 'number') {
            floater.innerText = `+$${text.toFixed(2)}`;
        } else {
            floater.innerText = text;
            floater.style.color = "var(--neon-gold)"; // Gorgeous gold for juggling hits!
            floater.style.textShadow = "0 0 10px rgba(255, 214, 0, 0.8)";
        }

        // Set position with slight random variations
        const randX = (Math.random() - 0.5) * 20;
        const randY = (Math.random() - 0.5) * 10;
        floater.style.left = `${clientX + randX}px`;
        floater.style.top = `${clientY + randY}px`;

        document.body.appendChild(floater);

        // Remove element after animation completes
        setTimeout(() => {
            floater.remove();
        }, 800);
    }

    // --- CSS 3D HOLO TILT LOGIC ---
    // Compute 3D tilt angles and glare coordinates based on mouse position on cards
    bind3DTiltEvents(el) {
        if (!el) return;

        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const mouseX = e.clientX - rect.left; // x position inside element
            const mouseY = e.clientY - rect.top;  // y position inside element
            
            // Percentage of mouse coords inside card (0% to 100%)
            const percentX = (mouseX / rect.width) * 100;
            const percentY = (mouseY / rect.height) * 100;

            // Map percent to rotate angles (-15deg to +15deg)
            const rotateY = ((percentX - 50) / 50) * 18; 
            const rotateX = -(((percentY - 50) / 50) * 18);

            // Bind values to CSS Custom Variables for glare position
            el.style.setProperty("--mouse-x", `${percentX}%`);
            el.style.setProperty("--mouse-y", `${percentY}%`);

            // Apply 3D perspective rotation
            el.style.transform = `perspective(400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            el.style.zIndex = "50";
        });

        el.addEventListener("mouseleave", () => {
            // Clean reset
            el.style.transform = `perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)`;
            el.style.setProperty("--mouse-x", "50%");
            el.style.setProperty("--mouse-y", "50%");
            el.style.zIndex = "1";
        });
    }

    translateUI(state) {
        const lang = state.lang;
        const dict = TRANSLATIONS[lang];
        if (!dict) return;

        // --- HUD ---
        const treasuryLabel = document.querySelector("#treasury-hud .label");
        if (treasuryLabel) treasuryLabel.innerText = dict.treasury_title;

        const tutoBtn = document.getElementById("btn-tuto");
        if (tutoBtn) tutoBtn.innerText = dict.btn_tuto;

        const infoBtn = document.getElementById("btn-info");
        if (infoBtn) infoBtn.innerText = dict.btn_info;

        const statsBtn = document.getElementById("btn-stats");
        if (statsBtn) statsBtn.innerText = dict.btn_stats;

        const prestigeBtn = document.getElementById("btn-prestige");
        if (prestigeBtn) prestigeBtn.innerText = dict.btn_prestige;

        const soundBtn = document.getElementById("btn-sound-toggle");
        if (soundBtn) {
            soundBtn.innerText = audio.isMuted ? dict.btn_sound_off : dict.btn_sound_on;
        }

        const langBtn = document.getElementById("btn-lang-toggle");
        if (langBtn) langBtn.innerText = dict.btn_lang;

        const wipeBtn = document.getElementById("btn-reset");
        if (wipeBtn) wipeBtn.innerText = dict.btn_wipe;

        // --- Column 1 ---
        const activeHeader = document.querySelector("#clicker-section .column-header h2");
        if (activeHeader) activeHeader.innerText = dict.active_stadium_header;

        const clickInst = document.querySelector(".click-instructions");
        if (clickInst) clickInst.innerText = dict.click_instructions;

        // --- Column 2 ---
        const transferHeader = document.querySelector("#deck-section .column-header h2");
        if (transferHeader) transferHeader.innerText = dict.transfer_market_header;

        const boosterTitle = document.querySelector(".mercato-shop h3");
        if (boosterTitle) boosterTitle.innerText = dict.booster_purchase_title;

        const packBronze = document.querySelector("#btn-pack-bronze .pack-title");
        if (packBronze) packBronze.innerText = dict.pack_recrue_title;

        const packSilver = document.querySelector("#btn-pack-silver .pack-title");
        if (packSilver) packSilver.innerText = dict.pack_pro_title;

        const packGold = document.querySelector("#btn-pack-gold .pack-title");
        if (packGold) packGold.innerText = dict.pack_legende_title;

        // --- Column 3 ---
        const upgradesHeader = document.querySelector("#tycoon-section .column-header h2");
        if (upgradesHeader) upgradesHeader.innerText = dict.upgrades_header;

        // --- TUTORIAL MODAL ---
        const tutoH2 = document.querySelector(".tutorial-modal-content h2");
        if (tutoH2) tutoH2.innerText = dict.tuto_title;

        const tutoSubtitle = document.querySelector(".tutorial-modal-content .subtitle");
        if (tutoSubtitle) tutoSubtitle.innerText = dict.tuto_subtitle;

        const tutoP1 = document.querySelector(".tutorial-modal-content p");
        if (tutoP1) tutoP1.innerText = dict.tuto_p1;

        const tutoCards = document.querySelectorAll(".tuto-cards-grid .tuto-card");
        if (tutoCards.length >= 3) {
            tutoCards[0].querySelector("h4").innerText = dict.tuto_card1_title;
            tutoCards[0].querySelector("p").innerText = dict.tuto_card1_text;

            tutoCards[1].querySelector("h4").innerText = dict.tuto_card2_title;
            tutoCards[1].querySelector("p").innerText = dict.tuto_card2_text;

            tutoCards[2].querySelector("h4").innerText = dict.tuto_card3_title;
            tutoCards[2].querySelector("p").innerText = dict.tuto_card3_text;
        }

        const tutoClose = document.getElementById("tutorial-close-btn");
        if (tutoClose) tutoClose.innerText = dict.tuto_close_btn;

        // --- ENCYCLOPEDIA MODAL ---
        const infoH2 = document.querySelector(".info-modal-content h2");
        if (infoH2) infoH2.innerText = dict.info_title;

        const infoSubtitle = document.querySelector(".info-modal-content .subtitle");
        if (infoSubtitle) infoSubtitle.innerText = dict.info_subtitle;

        const infoRatesTitle = document.querySelector(".info-modal-content h3");
        if (infoRatesTitle) infoRatesTitle.innerText = dict.info_rates_title;

        const infoThs = document.querySelectorAll(".probabilities-table th");
        if (infoThs.length >= 5) {
            infoThs[0].innerText = dict.info_rates_th1;
            infoThs[1].innerText = dict.info_rates_th2;
            infoThs[2].innerText = dict.info_rates_th3;
            infoThs[3].innerText = dict.info_rates_th4;
            infoThs[4].innerText = dict.info_rates_th5;
        }

        const infoTds = document.querySelectorAll(".probabilities-table td");
        // Rows: Recrue, Pro, Légende
        if (infoTds.length >= 15) {
            infoTds[0].innerText = dict.info_rates_recrue;
            infoTds[5].innerText = dict.info_rates_pro;
            infoTds[10].innerText = dict.info_rates_legende;
        }

        const infoHeaders = document.querySelectorAll(".info-modal-content .info-section h3");
        if (infoHeaders.length >= 1) infoHeaders[0].innerText = dict.info_album_title;

        const infoPs = document.querySelectorAll(".info-modal-content .info-section .info-p");
        if (infoPs.length >= 1) infoPs[0].innerText = dict.info_album_text;

        const rarityGroups = document.querySelectorAll(".info-modal-content .rarity-group");
        if (rarityGroups.length >= 4) {
            rarityGroups[0].querySelector("h4").innerText = dict.info_legendary_title;
            const legendaryLis = rarityGroups[0].querySelectorAll("li");
            if (legendaryLis.length >= 6) {
                legendaryLis[0].innerText = dict.info_legendary_pele;
                legendaryLis[1].innerText = dict.info_legendary_zidane;
                legendaryLis[2].innerText = dict.info_legendary_messi;
                legendaryLis[3].innerText = dict.info_legendary_ronaldo;
                legendaryLis[4].innerText = dict.info_legendary_haaland;
                legendaryLis[5].innerText = dict.info_legendary_mbappe;
            }

            rarityGroups[1].querySelector("h4").innerText = dict.info_epic_title;
            const epicP = rarityGroups[1].querySelector("p");
            if (epicP) epicP.innerText = dict.info_epic_text;

            rarityGroups[2].querySelector("h4").innerText = dict.info_rare_title;
            const rareP = rarityGroups[2].querySelector("p");
            if (rareP) rareP.innerText = dict.info_rare_text;

            rarityGroups[3].querySelector("h4").innerText = dict.info_common_title;
            const commonP = rarityGroups[3].querySelector("p");
            if (commonP) commonP.innerText = dict.info_common_text;
        }

        const infoClose = document.getElementById("info-close-btn");
        if (infoClose) infoClose.innerText = dict.info_close_btn;

        // --- STATS MODAL ---
        const statsH2 = document.querySelector(".stats-modal-content h2");
        if (statsH2) statsH2.innerText = dict.stats_title;

        const statsSubtitle = document.querySelector(".stats-modal-content .subtitle");
        if (statsSubtitle) statsSubtitle.innerText = dict.stats_subtitle;

        const statLabels = document.querySelectorAll(".stats-modal-content .stat-label");
        if (statLabels.length >= 6) {
            statLabels[0].innerText = dict.stats_earned;
            statLabels[1].innerText = dict.stats_clicks;
            statLabels[2].innerText = dict.stats_packs_bronze;
            statLabels[3].innerText = dict.stats_packs_silver;
            statLabels[4].innerText = dict.stats_packs_gold;
            statLabels[5].innerText = dict.stats_seasons;
        }

        const statsClose = document.getElementById("stats-close-btn");
        if (statsClose) statsClose.innerText = dict.stats_close_btn;

        // --- REBIRTH LOCKED MODAL ---
        const rlH2 = document.querySelector("#rebirth-locked-modal h2");
        if (rlH2) rlH2.innerText = dict.rl_title;

        const rlSubtitle = document.querySelector("#rebirth-locked-modal .subtitle");
        if (rlSubtitle) rlSubtitle.innerText = dict.rl_subtitle;

        const rlP1 = document.querySelector("#rebirth-locked-modal .rebirth-locked-p");
        if (rlP1) rlP1.innerHTML = dict.rl_p1;

        const rlMissingLabel = document.querySelector("#rebirth-missing-box span:first-child");
        if (rlMissingLabel) rlMissingLabel.innerText = dict.rl_missing_label;

        const rlBenefitsTitle = document.querySelector("#rebirth-locked-modal .rebirth-benefits-box h4");
        if (rlBenefitsTitle) rlBenefitsTitle.innerText = dict.rl_benefits_title;

        const rlBenefitsLis = document.querySelectorAll("#rebirth-locked-modal .rebirth-benefits-box li");
        if (rlBenefitsLis.length >= 3) {
            rlBenefitsLis[0].innerHTML = dict.rl_benefit1;
            rlBenefitsLis[1].innerHTML = dict.rl_benefit2;
            rlBenefitsLis[2].innerHTML = dict.rl_benefit3;
        }

        const rlClose = document.getElementById("rebirth-locked-close-btn");
        if (rlClose) rlClose.innerText = dict.rl_close_btn;

        // --- REBIRTH CONFIRMATION MODAL ---
        const rcH2 = document.querySelector("#rebirth-confirm-modal h2");
        if (rcH2) rcH2.innerText = dict.rc_title;

        const rcSubtitle = document.querySelector("#rebirth-confirm-modal .subtitle");
        if (rcSubtitle) rcSubtitle.innerText = dict.rc_subtitle;

        const rcP1 = document.querySelector("#rebirth-confirm-modal .rebirth-locked-p");
        if (rcP1) rcP1.innerText = dict.rc_p1;

        const rcBenefitsTitle = document.querySelector("#rebirth-confirm-modal .rebirth-benefits-box h4");
        if (rcBenefitsTitle) rcBenefitsTitle.innerText = dict.rc_benefits_title;

        const rcBenefitsLis = document.querySelectorAll("#rebirth-confirm-modal .rebirth-benefits-box li");
        if (rcBenefitsLis.length >= 3) {
            rcBenefitsLis[0].innerHTML = dict.rc_benefit1;
            rcBenefitsLis[1].innerHTML = dict.rc_benefit2;
            rcBenefitsLis[2].innerHTML = dict.rc_benefit3;
        }

        const rcYes = document.getElementById("rebirth-confirm-yes-btn");
        if (rcYes) rcYes.innerText = dict.rc_yes_btn;

        const rcNo = document.getElementById("rebirth-confirm-no-btn");
        if (rcNo) rcNo.innerText = dict.rc_no_btn;

        // --- OUTCOME CLOSE BUTTON ---
        const outcomeClose = document.getElementById("outcome-close-btn");
        if (outcomeClose) outcomeClose.innerText = dict.outcome_close_btn;

        // --- CARD DETAIL VIEWER ---
        const lblPos = document.getElementById("lbl-detail-position");
        if (lblPos) lblPos.innerText = dict.card_position;

        const lblLvl = document.getElementById("lbl-detail-level");
        if (lblLvl) lblLvl.innerText = dict.card_level;

        const lblBoost = document.getElementById("lbl-detail-boost");
        if (lblBoost) lblBoost.innerText = dict.card_boost;

        const lblBio = document.getElementById("lbl-detail-bio");
        if (lblBio) lblBio.innerText = dict.card_bio_title;

        const detailClose = document.getElementById("card-detail-close-btn");
        if (detailClose) detailClose.innerText = dict.card_detail_close_btn;
    }
}
