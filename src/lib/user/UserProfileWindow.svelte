<script>
    import { createEventDispatcher } from "svelte";
    import TabAttributes from "./TabAttributes.svelte";
    import ForceBalanceBar from "./ForceBalanceBar.svelte";
    import BuffsList from "./BuffsList.svelte";

    // Assets
    import sithIcon from "../../assets/sith.svg";
    import jediIcon from "../../assets/jedi.svg";
    import eternalIcon from "../../assets/eternalempire.svg";

    export let isOpen = false;

    const dispatch = createEventDispatcher();

    // Config
    const FACTIONS = {
        "Sith Order": {
            icon: sithIcon,
            color: "#ef4444",
            glow: "rgba(239, 68, 68, 0.5)",
            class: "sith",
        },
        "Jedi Order": {
            icon: jediIcon,
            color: "#3b82f6",
            glow: "rgba(59, 130, 246, 0.5)",
            class: "jedi",
        },
        "Eternal Empire": {
            icon: eternalIcon,
            color: "#eab308",
            glow: "rgba(234, 179, 8, 0.5)",
            class: "eternal",
        },
    };

    // --- MOCK DATA ---
    const player = {
        name: "Cmdr. Kaelen",
        role: "Shadow Op.",
        faction: "Sith Order",
        class: "Marauder",
        isForceUser: true,
        avatar: "https://i.pravatar.cc/150?u=kaelen",
        level: 42,
        xp: 7540,
        xpToNext: 10000,
        credits: 14500,
        diamonds: 320,
        forceBalance: -15,
        attributes: {
            strength: 18,
            intelligence: 14,
            resistance: 22,
            precision: 16,
        },
        buffs: [
            {
                name: "Adrenaline",
                desc: "+10% Speed",
                time: "4m",
                type: "buff",
            },
            {
                name: "Fatigue",
                desc: "-5% Stamina",
                time: "10m",
                type: "debuff",
            },
        ],
    };

    $: currentFaction = FACTIONS[player.faction] || FACTIONS["Sith Order"];

    // --- TABS LOGIC ---
    let activeTab = "attributes";
    const tabs = [
        { id: "attributes", label: "STATUS" },
        { id: "inventory", label: "INVENTORY" },
        { id: "gear", label: "GEAR" },
        { id: "missions", label: "LOGS" },
    ];

    // --- DRAG LOGIC (DESKTOP) ---
    let w = 0;
    let h = 0;
    let x = 100;
    let y = 100;
    let isDragging = false;
    let startX, startY;

    function startDrag(e) {
        // Only allow drag on desktop
        if (window.innerWidth <= 768) return;

        isDragging = true;
        startX = e.clientX - x;
        startY = e.clientY - y;
    }

    function onMove(e) {
        if (!isDragging) return;
        x = e.clientX - startX;
        y = e.clientY - startY;
    }

    function stopDrag() {
        isDragging = false;
    }

    function close() {
        dispatch("close");
    }

    // --- DECODING / GLITCH FX ---
    let isDecoding = false;
    let isGlitching = false;
    let glitchInterval;

    function startDecodingSequence() {
        if (!isOpen) return;

        // Reset states
        isDecoding = true;
        isGlitching = false;
        if (glitchInterval) clearInterval(glitchInterval);

        // Phase 1: Pure Aurebesh (Shortened to 600ms)
        setTimeout(() => {
            // Phase 2: Glitching (Aurebesh <-> Normal rapid swap)
            isDecoding = false;
            isGlitching = true;

            let toggle = true;
            glitchInterval = setInterval(() => {
                isDecoding = toggle;
                toggle = !toggle;
            }, 50);

            // Phase 3: Stabilize (after 300ms of glitching = 900ms total)
            setTimeout(() => {
                clearInterval(glitchInterval);
                isDecoding = false;
                isGlitching = false;
            }, 300);
        }, 600);
    }

    // Trigger effect when window opens
    $: if (isOpen) {
        startDecodingSequence();
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="modal-overlay"
        on:click|self={close}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === "Escape" && close()}
    >
        <div
            class="profile-window"
            style="transform: translate({x}px, {y}px);"
            class:dragging={isDragging}
            class:decoding={isDecoding}
            class:glitching={isGlitching}
        >
            <!-- HEADER (Draggable) -->
            <div
                class="window-header"
                on:mousedown={startDrag}
                role="toolbar"
                tabindex="0"
                aria-label="Window Header (Drag to move)"
            >
                <div class="header-title">
                    <span class="icon">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                            ></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </span>
                    <span class="text"
                        >OPERATIVE PROFILE // <span class="sub-id"
                            >UID-8842</span
                        ></span
                    >
                </div>
                <!-- CLOSE BUTTON -->
                <button
                    class="close-btn"
                    on:click={close}
                    aria-label="Close Profile"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="window-content">
                <!-- TOP PROFILE CARD -->
                <div class="profile-card">
                    <div class="avatar-frame">
                        <img src={player.avatar} alt="Profile" />
                        <div class="level-badge">LV.{player.level}</div>
                    </div>
                    <div class="profile-info">
                        <div class="name-section">
                            <div class="name">{player.name}</div>

                            <!-- HIGH-TECH IDENTITY BAR -->
                            <!-- HIGH-TECH IDENTITY BAR -->
                            <div
                                class="identity-bar"
                                style="--theme-color: {currentFaction.color}; --theme-glow: {currentFaction.glow};"
                            >
                                <!-- LEFT: FACTION ICON (MASKED) -->
                                <div class="faction-icon-wrapper">
                                    <div
                                        class="faction-icon-mask"
                                        style="-webkit-mask-image: url({currentFaction.icon}); mask-image: url({currentFaction.icon});"
                                    ></div>
                                </div>

                                <!-- RIGHT: INFO STACK -->
                                <div class="identity-details">
                                    <div class="faction-name">
                                        {player.faction.toUpperCase()}
                                    </div>
                                    <div class="sub-details">
                                        <span class="detail-item class"
                                            >{player.class.toUpperCase()}</span
                                        >
                                        {#if player.isForceUser}
                                            <span class="separator">//</span>
                                            <span class="detail-item force"
                                                >FORCE SENSITIVE</span
                                            >
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- XP (Kept same) -->
                        <div class="xp-section">
                            <div class="xp-bar-bg">
                                <div
                                    class="xp-bar-fill"
                                    style="width: {(player.xp /
                                        player.xpToNext) *
                                        100}%"
                                ></div>
                            </div>
                            <div class="xp-text">
                                {player.xp} / {player.xpToNext} XP
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CURRENCIES ROW -->
                <div class="currencies-bar">
                    <div class="currency credits">
                        <span class="label">CREDITS:</span>
                        <span class="val">
                            <span class="aurebesh-curr">$</span>
                            {player.credits.toLocaleString()}
                        </span>
                    </div>
                    <div class="currency diamonds">
                        <span class="label">GEMS:</span>
                        <span class="val">
                            <span class="gem-icon">♦</span>
                            {player.diamonds.toLocaleString()}
                        </span>
                    </div>
                </div>

                <!-- TABS CONTAINER -->
                <div class="tabs-nav">
                    {#each tabs as tab}
                        <button
                            class="tab-btn {activeTab === tab.id
                                ? 'active'
                                : ''}"
                            on:click={() => (activeTab = tab.id)}
                        >
                            {tab.label}
                        </button>
                    {/each}
                </div>

                <!-- TAB CONTENT -->
                <div class="tab-pane-container">
                    {#if activeTab === "attributes"}
                        <!-- ATTRIBUTES TAB -->
                        <div class="tab-view">
                            <TabAttributes attributes={player.attributes} />

                            <div class="divider"></div>

                            <ForceBalanceBar balance={player.forceBalance} />

                            <div class="divider"></div>

                            <BuffsList buffs={player.buffs} />
                        </div>
                    {:else if activeTab === "inventory"}
                        <div class="placeholder-view">
                            INVENTORY MODULE OFFLINE
                        </div>
                    {:else if activeTab === "gear"}
                        <div class="placeholder-view">GEAR LOADOUT OFFLINE</div>
                    {:else}
                        <div class="placeholder-view">
                            MISSION LOGS ENCRYPTED
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- WINDOW LISTENERS FOR DRAG -->
<svelte:window on:mouseup={stopDrag} on:mousemove={onMove} />

<style>
    /* GLOBAL COMPONENT RESET */
    * {
        box-sizing: border-box;
    }

    /* AUREBESH FONT (Star Wars) */
    @font-face {
        font-family: "Aurebesh";
        src: url("../../assets/fonts/Aurebesh-BoldItalic.otf")
            format("opentype");
        font-weight: bold;
        font-style: italic;
    }

    /* DECODING EFFECT (Force Aurebesh Global) */
    .profile-window.decoding :global(*) {
        font-family: "Aurebesh", sans-serif !important;
        letter-spacing: 2px !important;
    }

    /* GLITCH EFFECT (Transition Global) */
    /* GLITCH EFFECT (Transition Global) */
    .profile-window.glitching :global(*) {
        text-shadow:
            2px 0 #0ff,
            -2px 0 #f00 !important;
        opacity: 0.9;
        /* Removed skew to prevent scroll */
    }

    /* GLOBAL OVERLAY */
    .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 2000;
        pointer-events: none;
    }

    /* WINDOW CONTAINER */
    .profile-window {
        position: absolute;
        width: 360px; /* Mais compacto */
        max-height: 70vh;
        /* Estetica "Preto Noite Vidro Fosco" */
        background: rgba(0, 0, 0, 0.92);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(20, 30, 50, 0.8);
        box-shadow:
            0 0 50px rgba(0, 0, 0, 0.9),
            inset 0 0 20px rgba(10, 20, 40, 0.5);
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        overflow: hidden; /* Prevent ANY scrollbar on the window container itself */
        overflow-x: hidden;
        border-radius: 2px; /* Cantos mais retos, mais tatico */
        top: 0;
        left: 0;
    }

    .profile-window.dragging {
        transition: none;
        opacity: 0.95;
        border-color: rgba(77, 184, 255, 0.3);
    }

    /* HEADER */
    .window-header {
        height: 32px; /* Mais compacto */
        background: linear-gradient(90deg, #050505 0%, #0a0f18 100%);
        border-bottom: 1px solid rgba(77, 184, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        cursor: grab;
        user-select: none;
    }
    .window-header:active {
        cursor: grabbing;
    }

    .header-title {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #e2e8f0; /* Texto claro */
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 11px; /* Fonte ligeiramente maior */
        letter-spacing: 1px;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    }
    .header-title .icon svg {
        width: 12px;
        height: 12px;
        color: #4db8ff; /* Azul Ciano Brilhante */
        filter: drop-shadow(0 0 4px rgba(77, 184, 255, 0.6));
    }
    .sub-id {
        color: #94a3b8; /* Cinza claro */
        font-size: 9px;
        margin-left: 2px;
    }

    /* CLOSE BUTTON */
    .close-btn {
        background: transparent;
        border: none;
        color: #cbd5e1; /* Cinza claro */
        cursor: pointer;
        padding: 4px;
        border-radius: 2px;
        transition: 0.2s;
    }
    .close-btn:hover {
        background: rgba(255, 60, 60, 0.2);
        color: #ff5555;
    }
    .close-btn svg {
        width: 14px;
        height: 14px;
    }

    /* CONTENT */
    .window-content {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        color: #fff;
    }

    /* PROFILE CARD COMPACTO */
    .profile-card {
        display: flex;
        gap: 12px;
        align-items: flex-start; /* Alinhar topo */
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(77, 184, 255, 0.2);
    }

    .avatar-frame {
        position: relative;
        width: 48px; /* Menor */
        height: 48px;
        flex-shrink: 0;
    }
    .avatar-frame img {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        border: 1px solid #475569;
        object-fit: cover;
    }

    .level-badge {
        position: absolute;
        bottom: -4px;
        right: -4px;
        background: #000;
        color: #4db8ff;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 9px;
        padding: 1px 4px;
        border: 1px solid #1e3a8a;
        border-radius: 2px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    }

    .profile-info {
        flex: 1;
        min-width: 0;
    }

    /* Name styles */
    .name {
        font-family: "Orbitron", sans-serif;
        font-size: 15px; /* Maior */
        font-weight: 700;
        letter-spacing: 0.5px;
        color: #f8fafc; /* Branco total */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 0 10px rgba(77, 184, 255, 0.3);
    }

    .xp-section {
        width: 100%;
        margin-top: 4px;
    }
    .xp-bar-bg {
        height: 4px; /* Um pouco mais visivel */
        background: #0f172a;
        border-radius: 1px;
        overflow: hidden;
        margin-bottom: 2px;
        border: 1px solid #334155;
    }
    .xp-bar-fill {
        height: 100%;
        background: #3b82f6; /* Azul mais vivo */
        box-shadow: 0 0 6px rgba(59, 130, 246, 0.6);
    }
    .xp-text {
        font-size: 9px;
        font-family: "Rajdhani", monospace;
        color: #cbd5e1; /* Cinza bem claro */
        text-align: right;
        font-weight: 600;
    }

    /* CURRENCIES COMPACTO */
    .currencies-bar {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;
    }
    .currency {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: "Rajdhani", sans-serif;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(51, 65, 85, 0.5);
        padding: 4px 8px;
        border-radius: 2px;
    }
    .currency .label {
        font-size: 10px;
        font-weight: 700;
        color: #94a3b8;
    }

    .currency .val {
        font-size: 13px;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }
    .currency.credits .val {
        color: #facc15;
    }
    .currency.diamonds .val {
        color: #60a5fa;
    }
    .aurebesh-curr {
        font-family: "Aurebesh", sans-serif;
        font-weight: normal;
        margin-right: 2px;
        font-size: 14px;
        color: #fbbf24; /* Gold */
    }
    .gem-icon {
        font-family: Arial, sans-serif; /* Ensure standard symbol */
        margin-right: 2px;
        font-size: 12px;
        color: #60a5fa;
    }

    /* TABS CLEAN */
    .tabs-nav {
        display: flex;
        border-bottom: 1px solid rgba(77, 184, 255, 0.2);
        margin-bottom: 12px;
        gap: 2px;
    }
    .tab-btn {
        flex: 1;
        background: rgba(15, 23, 42, 0.4);
        border: none;
        color: #94a3b8; /* Cinza claro */
        font-family: "Rajdhani", sans-serif; /* Mudado para Rajdhani para caber melhor */
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
        padding: 8px 0;
        cursor: pointer;
        transition: 0.2s;
        border-top: 2px solid transparent;
    }
    .tab-btn:hover {
        background: rgba(30, 41, 59, 0.6);
        color: #fff;
    }
    .tab-btn.active {
        background: linear-gradient(
            180deg,
            rgba(59, 130, 246, 0.15) 0%,
            transparent 100%
        );
        color: #4db8ff; /* Azul Neon */
        border-top-color: #3b82f6;
        text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
    }

    /* UTILS */
    .divider {
        height: 1px;
        background: rgba(30, 40, 60, 0.5);
        margin: 12px 0;
    }
    .placeholder-view {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #334455;
        font-family: "Orbitron", serif; /* Mantido serif para estilo terminal */
        font-size: 10px;
        letter-spacing: 1px;
        border: 1px dashed #223344;
        background: rgba(0, 0, 0, 0.2);
    }

    /* SCROLLBAR CUSTOM */
    .window-content::-webkit-scrollbar {
        width: 4px;
    }
    .window-content::-webkit-scrollbar-track {
        background: #050505;
    }
    .window-content::-webkit-scrollbar-thumb {
        background: #223344;
        border-radius: 2px;
    }

    /* IDENTITY BAR STYLES */
    .identity-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.6) 0%,
            transparent 100%
        );
        padding: 6px 10px;
        margin-bottom: 8px;
        width: 100%;
        border-radius: 4px;
        /* create context but NO border/accent line */
    }

    /* Explicitly remove the vertical bar accent if it exists */
    .identity-bar::before {
        display: none;
    }

    .faction-icon-wrapper {
        width: 24px; /* Default Desktop Size */
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* CSS MASKING FOR PERFECT COLOR */
    /* If SVGs are broken, it might be the URL resolution.
       Using mask-image requires the image to be loaded.
       We will add a fallback img tag just in case in the HTML if this fails,
       but for now let's fix the CSS. */
    .faction-icon-mask {
        width: 100%;
        height: 100%;
        background-color: var(--theme-color); /* The fill color */
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-position: center;
        mask-position: center;
        /* Apply the mask image from inline style or class */
        /* Note: The inline style in HTML handles the url() */
        filter: drop-shadow(0 0 5px var(--theme-glow));
    }

    .identity-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .faction-name {
        font-family: "Orbitron", sans-serif;
        font-size: 13px; /* Slightly larger */
        font-weight: 800;
        color: var(--theme-color);
        letter-spacing: 1px;
        line-height: 1.2;
        text-shadow: 0 0 10px var(--theme-glow);
    }

    .sub-details {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: "Rajdhani", sans-serif;
        font-size: 10px;
        font-weight: 600;
        color: #94a3b8;
    }

    .detail-item.class {
        color: #e2e8f0;
        letter-spacing: 0.5px;
    }

    .detail-item.force {
        color: var(--theme-color);
        opacity: 0.9;
        font-size: 9px;
        letter-spacing: 0.5px;
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
        .profile-window {
            position: fixed;
            width: 100% !important;
            height: 100% !important;
            max-height: none !important;
            transform: none !important;
            border: none;
            background: #000000; /* Preto total */
            border-radius: 0;
            display: flex;
            flex-direction: column;
        }

        .window-header {
            padding: 0 20px;
            height: 64px; /* Header mais alto */
            background: #0a0f18;
            border-bottom: 1px solid rgba(77, 184, 255, 0.2);
        }

        .header-title {
            font-size: 14px; /* Fonte maior */
            letter-spacing: 2px;
        }
        .header-title .icon svg {
            width: 16px;
            height: 16px;
        }

        .close-btn {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.08); /* Fundo mais visivel */
            border-radius: 8px; /* Botao mais arredondado */
        }
        .close-btn svg {
            width: 28px; /* Icone maior */
            height: 28px;
        }

        .window-content {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px; /* Espacamento maior entre secoes */
        }

        /* Profile Card - Mobile Large */
        .profile-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
            padding: 24px;
            background: rgba(15, 23, 42, 0.3);
            border: 1px solid rgba(77, 184, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 0;
        }

        .avatar-frame {
            width: 96px; /* Avatar bem maior */
            height: 96px;
        }
        .avatar-frame img {
            border: 2px solid #475569;
        }

        .level-badge {
            font-size: 12px;
            padding: 2px 8px;
            bottom: -8px;
            right: -8px;
            border: 2px solid #1e3a8a;
        }

        .profile-info {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* ADJUST IDENTITY BAR FOR MOBILE */
        .identity-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
            border-left: none;
            border-bottom: 2px solid var(--theme-color);
            padding: 8px;
            background: linear-gradient(
                180deg,
                rgba(0, 0, 0, 0.4) 0%,
                transparent 100%
            );
            width: 100%;
            margin-bottom: 8px;
        }

        .identity-bar::before {
            display: none;
        }

        .faction-icon-wrapper {
            width: 28px; /* Bigger on mobile */
            height: 28px;
            margin-bottom: 2px;
        }

        .faction-name {
            font-size: 14px; /* Larger title */
            margin-bottom: 2px;
        }

        .sub-details {
            font-size: 10px;
            gap: 6px;
        }

        .name {
            font-size: 18px; /* Nome Grande */
            letter-spacing: 1px;
            white-space: normal;
            margin-bottom: 4px;
            text-align: center;
        }

        .xp-section {
            margin-top: 12px;
            width: 100%;
        }
        .xp-bar-bg {
            height: 8px;
            border-radius: 4px;
        } /* Barra mais grossa */
        .xp-text {
            font-size: 12px;
            margin-top: 4px;
            text-align: center;
        }

        /* Currencies Mobile */
        .currencies-bar {
            grid-template-columns: 1fr; /* Um por linha para ser bem grande */
            gap: 12px;
            margin-bottom: 0;
        }
        .currency {
            padding: 12px 16px;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(51, 65, 85, 0.6);
        }
        .currency .label {
            font-size: 12px;
        }
        .currency .val {
            font-size: 18px;
        }

        /* Tabs Mobile - Big Buttons */
        .tabs-nav {
            gap: 8px;
            margin-bottom: 16px;
            flex-wrap: wrap; /* Permitir quebra se precisar */
        }
        .tab-btn {
            font-size: 14px;
            padding: 16px 0;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(51, 65, 85, 0.4);
            border-radius: 6px;
            flex-basis: 48%; /* 2 por linha */
            border-top: 1px solid rgba(51, 65, 85, 0.4); /* Reset do estilo desktop */
        }
        .tab-btn.active {
            background: rgba(30, 58, 138, 0.6);
            border: 1px solid #3b82f6;
            color: #fff;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        .tab-pane-container {
            flex: 1; /* Ocupar espaco restante */
        }

        /* Ajustes nos componentes filhos via global ou pass-through se precisasse, 
           mas vamos editar os arquivos deles separadamente para limpeza */
    }
</style>
