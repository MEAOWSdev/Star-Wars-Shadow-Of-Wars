<script>
    import { onMount, onDestroy } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { trackInfo, mockPlayers } from "./podData";

    export let isOpen = true; // Controlled by parent
    export let onClose;

    let timeLeft = 30; // 30 seconds to start
    let timerInterval;

    onMount(() => {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) timeLeft--;
            else clearInterval(timerInterval); // Start Race Trigger?
        }, 1000);
    });

    onDestroy(() => {
        if (timerInterval) clearInterval(timerInterval);
    });

    // Formatting Time
    $: formattedTime = `00:${timeLeft < 10 ? "0" + timeLeft : timeLeft}`;

    // Financials
    const entryPrice = 5000;
    let totalPool = 0;
    let prize1 = 0;
    let prize2 = 0;
    let prize3 = 0;

    $: {
        if (mockPlayers) {
            totalPool = entryPrice * mockPlayers.length;
            prize1 = Math.floor(totalPool * 0.6);
            prize2 = Math.floor(totalPool * 0.25);
            prize3 = Math.floor(totalPool * 0.15);
        }
    }

    function close() {
        if (onClose) onClose();
        else isOpen = false;
    }

    // --- DECODING / GLITCH FX ---
    let isDecoding = false;
    let isGlitching = false;
    let glitchInterval;

    function startDecodingSequence() {
        if (!isOpen) return;

        isDecoding = true;
        isGlitching = false;
        if (glitchInterval) clearInterval(glitchInterval);

        // Phase 1: Pure Aurebesh (600ms)
        setTimeout(() => {
            // Phase 2: Glitching (300ms)
            isDecoding = false;
            isGlitching = true;

            let toggle = true;
            glitchInterval = setInterval(() => {
                isDecoding = toggle;
                toggle = !toggle;
            }, 50);

            // Phase 3: Stabilize
            setTimeout(() => {
                clearInterval(glitchInterval);
                isDecoding = false;
                isGlitching = false;
            }, 300);
        }, 600);
    }

    $: if (isOpen) {
        startDecodingSequence();
    }

    function portal(node) {
        document.body.appendChild(node);
        return {
            destroy() {
                if (node.parentNode) node.parentNode.removeChild(node);
            },
        };
    }
</script>

{#if isOpen}
    <!-- FULL SCREEN OVERLAY -->
    <div
        class="lobby-overlay"
        use:portal
        transition:fade={{ duration: 200 }}
        role="presentation"
    >
        <!-- MAIN MODAL CONTAINER -->
        <div
            class="lobby-modal"
            transition:scale={{ start: 0.95, duration: 300, opacity: 0 }}
            class:decoding={isDecoding}
            class:glitching={isGlitching}
        >
            <!-- HEADER -->
            <div class="lobby-header">
                <div class="h-title">
                    <span class="h-icon">🏁</span>
                    <span class="h-text" class:aurebesh={isDecoding}>LOBBY</span
                    >
                </div>
                <div class="h-status">
                    <span class="status-dot {timeLeft > 10 ? 'active' : 'crit'}"
                    ></span>
                    <span class="status-text"
                        >{timeLeft > 0
                            ? "WAITING FOR DRIVERS"
                            : "RACE STARTING"}</span
                    >
                </div>
                <!-- CLOSE BUTTON -->
                <button class="close-btn" on:click={close}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="lobby-content">
                <!-- LEFT COLUMN: TRACK INFO -->
                <div class="col-track">
                    <div class="track-visual">
                        <!-- Placeholder Image if no real img available, using gradient -->
                        <img
                            src={trackInfo.background}
                            class="track-bg-img"
                            alt="Track"
                        />
                        <div class="track-overlay">
                            <div class="track-name-large">
                                {trackInfo.name}
                            </div>
                            <div class="track-loc">
                                {trackInfo.location}
                            </div>
                        </div>
                    </div>

                    <div class="track-stats-grid">
                        <div class="stat-box">
                            <span class="s-label">DISTANCE</span>
                            <span class="s-val">{trackInfo.distance}</span>
                        </div>
                        <div class="stat-box">
                            <span class="s-label">LAPS</span>
                            <span class="s-val">{trackInfo.laps}</span>
                        </div>
                        <div class="stat-box warning">
                            <span class="s-label">WEATHER</span>
                            <span class="s-val">{trackInfo.weather}</span>
                        </div>
                        <div class="stat-box">
                            <span class="s-label">TEMP</span>
                            <span class="s-val">{trackInfo.temp}</span>
                        </div>
                    </div>

                    <div class="race-timer-box">
                        <span class="timer-label">RACE STARTS IN</span>
                        <span
                            class="timer-digits {timeLeft <= 10
                                ? 't-crit'
                                : ''}">{formattedTime}</span
                        >
                    </div>

                    <!-- FINANCE -->
                    <div class="finance-box">
                        <div class="f-header">PRIZE POOL BREAKDOWN</div>
                        <div class="f-grid">
                            <div class="f-item">
                                <span class="lbl">ENTRY</span>
                                <span class="val"
                                    >{entryPrice.toLocaleString()}</span
                                >
                            </div>
                            <div class="f-item total">
                                <span class="lbl">TOTAL</span>
                                <span class="val gold"
                                    >{totalPool.toLocaleString()}</span
                                >
                            </div>
                        </div>
                        <div class="f-ranks">
                            <div class="r-item gold">
                                1ST: {prize1.toLocaleString()}
                            </div>
                            <div class="r-item silver">
                                2ND: {prize2.toLocaleString()}
                            </div>
                            <div class="r-item bronze">
                                3RD: {prize3.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: PLAYERS LIST -->
                <div class="col-players">
                    <div class="p-header">
                        <span class="ph-title"
                            >DRIVERS ({mockPlayers.length}/8)</span
                        >
                        <div class="ph-line"></div>
                    </div>

                    <div class="players-list">
                        {#each mockPlayers as p}
                            <div
                                class="player-card faction-{p.faction.toLowerCase()}"
                            >
                                <!-- Faction Icon -->
                                <div class="p-faction">
                                    <img
                                        src={p.factionIcon}
                                        alt={p.faction}
                                        class="faction-img"
                                    />
                                </div>

                                <!-- Player Info -->
                                <div class="p-info">
                                    <div class="p-top">
                                        <span class="p-name">{p.name}</span>
                                        <span class="p-lvl">LVL {p.level}</span>
                                    </div>
                                    <div class="p-bot">
                                        <span class="p-stat"
                                            >W: {p.stats.win}</span
                                        >
                                        <span class="p-sep">/</span>
                                        <span class="p-stat"
                                            >L: {p.stats.loss}</span
                                        >
                                    </div>
                                </div>

                                <!-- Ship Icon -->
                                <div class="p-ship">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path d={p.shipIcon} />
                                    </svg>
                                </div>

                                <!-- Ready State -->
                                <div class="p-status">
                                    {#if p.ready}
                                        <span class="ready-badge">READY</span>
                                    {:else}
                                        <span class="pedning-badge">...</span>
                                    {/if}
                                </div>
                            </div>
                        {/each}

                        <!-- Empty Slots -->
                        {#each Array(8 - mockPlayers.length) as _, i}
                            <div class="player-card empty">
                                <span class="empty-text">SEARCHING...</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- FOOTER ACTION -->
            <div class="lobby-footer">
                <button class="action-btn cancel" on:click={close}
                    >LEAVE LOBBY</button
                >
                <button class="action-btn join">JOIN RACE</button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* AUREBESH FONT */
    @font-face {
        font-family: "Aurebesh";
        src: url("../../assets/fonts/Aurebesh-BoldItalic.otf")
            format("opentype");
        font-weight: bold;
        font-style: italic;
    }

    .aurebesh {
        font-family: "Aurebesh", sans-serif !important;
    }

    /* VARIABLES */
    :root {
        --lobby-bg: rgba(5, 8, 16, 0.95);
        --lobby-border: rgba(59, 130, 246, 0.3);
        --lobby-accent: #3b82f6; /* Jedi Blue */
        --lobby-sith: #ef4444; /* Sith Red */
        --lobby-eternal: #fbbf24; /* Eternal Gold */
        --lobby-text: #e2e8f0;
        --lobby-dim: #64748b;
    }

    /* OVERLAY */
    .lobby-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        z-index: 9999; /* Max level */
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    /* MODAL BOX */
    .lobby-modal {
        width: 1000px;
        max-width: 95vw;
        height: 700px;
        max-height: 90vh;
        background: var(--lobby-bg);
        border: 1px solid var(--lobby-border);
        box-shadow:
            0 0 40px rgba(0, 0, 0, 0.8),
            inset 0 0 20px rgba(59, 130, 246, 0.05);
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        overflow: hidden;
        /* Tech Corners */
        clip-path: polygon(
            0 0,
            100% 0,
            100% 100%,
            20px 100%,
            0 calc(100% - 20px)
        );
    }

    /* HEADER */
    .lobby-header {
        height: 60px;
        border-bottom: 1px solid var(--lobby-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        background: rgba(255, 255, 255, 0.02);
    }
    .h-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: "Orbitron", sans-serif;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 2px;
        color: #fff;
    }
    .h-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: "Rajdhani", monospace;
        font-weight: 600;
        color: var(--lobby-accent);
    }
    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--lobby-dim);
    }
    .status-dot.active {
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
        animation: pulse 2s infinite;
    }
    .status-dot.crit {
        background: #ef4444;
        box-shadow: 0 0 8px #ef4444;
        animation: blink 0.5s infinite;
    }

    .close-btn {
        background: none;
        border: none;
        color: var(--lobby-dim);
        cursor: pointer;
        transition: color 0.2s;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .close-btn:hover {
        color: #fff;
    }

    /* CONTENT GRID */
    .lobby-content {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden; /* Scrolled internally if needed */
    }

    /* LEFT COL - TRACK */
    .col-track {
        padding: 24px;
        border-right: 1px solid var(--lobby-border);
        display: flex;
        flex-direction: column;
        gap: 24px;
        overflow-y: auto;
    }

    .track-visual {
        width: 100%;
        height: 240px;
        background: #0f172a;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
    }
    .track-img-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(
            45deg,
            #1e1b4b,
            #4c1d95
        ); /* Deep Space / Tatooine Sky mockup */
        display: flex;
        align-items: flex-end;
    }
    /* Simple grid pattern overlay */
    .track-img-placeholder::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                rgba(255, 255, 255, 0.05) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.05) 1px,
                transparent 1px
            );
        background-size: 20px 20px;
        opacity: 0.3;
    }

    .track-overlay {
        width: 100%;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
        padding: 24px;
    }
    .track-name-large {
        font-family: "Orbitron", sans-serif;
        font-size: 24px;
        font-weight: 900;
        color: #fff;
        text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }
    .track-loc {
        font-family: "Rajdhani", sans-serif;
        font-size: 14px;
        color: var(--lobby-accent);
        font-weight: 600;
        letter-spacing: 1px;
    }

    .track-stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
    .stat-box {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 12px;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
    }
    .stat-box.warning {
        border-color: rgba(239, 68, 68, 0.3);
        background: rgba(239, 68, 68, 0.05);
    }
    .stat-box.warning .s-val {
        color: #fca5a5;
    }

    .s-label {
        font-size: 10px;
        color: var(--lobby-dim);
        letter-spacing: 1px;
        font-weight: 700;
    }
    .s-val {
        font-size: 16px;
        color: #fff;
        font-family: "Rajdhani", monospace;
        font-weight: 600;
        margin-top: 4px;
    }

    .race-timer-box {
        margin-top: auto;
        border: 1px solid var(--lobby-accent);
        background: rgba(59, 130, 246, 0.05);
        padding: 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .timer-label {
        font-size: 12px;
        letter-spacing: 2px;
        color: var(--lobby-accent);
        font-weight: 700;
    }
    .timer-digits {
        font-family: "Orbitron", monospace;
        font-size: 48px;
        color: #fff;
        line-height: 1;
        text-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    .timer-digits.t-crit {
        color: #ef4444;
        text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
        animation: pulse 0.5s infinite;
    }

    /* RIGHT COL - PLAYERS */
    .col-players {
        padding: 24px;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.2);
    }
    .p-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }
    .ph-title {
        font-family: "Rajdhani", sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: var(--lobby-dim);
        letter-spacing: 1px;
        white-space: nowrap;
    }
    .ph-line {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        width: 100%;
    }

    .players-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
        padding-right: 8px; /* Scrollbar space */
    }

    .player-card {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid transparent;
        border-left: 2px solid var(--lobby-dim);
        padding: 8px 12px;
        height: 56px;
        gap: 12px;
        transition: all 0.2s;
    }
    .player-card:hover {
        background: rgba(255, 255, 255, 0.06);
    }

    /* Faction Colors */
    .player-card.faction-sith {
        border-left-color: var(--lobby-sith);
    }
    .player-card.faction-jedi {
        border-left-color: var(--lobby-accent);
    }
    .player-card.faction-eternal {
        border-left-color: var(--lobby-eternal);
    }

    .p-faction {
        width: 24px;
        height: 24px;
        opacity: 0.8;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .faction-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .faction-sith .faction-img {
        filter: drop-shadow(0 0 2px var(--lobby-sith));
    }
    .faction-jedi .faction-img {
        filter: drop-shadow(0 0 2px var(--lobby-accent));
    }
    .faction-eternal .faction-img {
        filter: drop-shadow(0 0 2px var(--lobby-eternal));
    }
    .faction-sith .p-faction {
        color: var(--lobby-sith);
    }
    .faction-jedi .p-faction {
        color: var(--lobby-accent);
    }
    .faction-eternal .p-faction {
        color: var(--lobby-eternal);
    }

    .p-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .p-top {
        display: flex;
        align-items: baseline;
        gap: 8px;
    }
    .p-name {
        font-family: "Rajdhani", sans-serif;
        font-weight: 700;
        color: #fff;
        font-size: 14px;
        letter-spacing: 0.5px;
    }
    .p-lvl {
        font-size: 10px;
        color: var(--lobby-dim);
        font-weight: 600;
    }
    .p-bot {
        display: flex;
        font-size: 10px;
        color: #64748b;
        font-family: monospace;
    }
    .p-stat {
        color: #94a3b8;
    }
    .p-sep {
        margin: 0 4px;
        color: #334155;
    }

    .p-ship {
        width: 24px;
        height: 24px;
        color: #475569;
        transform: rotate(90deg);
        margin-right: 8px;
    }

    .ready-badge {
        font-size: 10px;
        font-weight: 700;
        color: #10b981;
        border: 1px solid #10b981;
        padding: 2px 6px;
        border-radius: 2px;
    }
    .pedning-badge {
        color: #475569;
        font-weight: 700;
        letter-spacing: 2px;
    }

    .player-card.empty {
        border-left-color: rgba(255, 255, 255, 0.05);
        background: transparent;
        border: 1px dashed rgba(255, 255, 255, 0.05);
        justify-content: center;
        opacity: 0.5;
    }
    .empty-text {
        font-size: 10px;
        color: #334155;
        letter-spacing: 2px;
        font-style: italic;
    }

    /* FOOTER */
    .lobby-footer {
        height: 70px;
        border-top: 1px solid var(--lobby-border);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 24px;
        gap: 16px;
        background: rgba(0, 0, 0, 0.3);
    }

    .action-btn {
        height: 40px;
        padding: 0 24px;
        font-family: "Rajdhani", sans-serif;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 1px;
        border: none;
        cursor: pointer;
        clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
        transition: all 0.2s;
    }
    .action-btn.cancel {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #94a3b8;
    }
    .action-btn.cancel:hover {
        border-color: #fff;
        color: #fff;
    }

    .action-btn.join {
        background: var(--lobby-accent);
        color: #000;
    }
    .action-btn.join:hover {
        background: #60a5fa;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 768px) {
        .lobby-overlay {
            padding: 0;
            align-items: flex-end;
            background: #000 !important;
            height: 100dvh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 2147483640 !important; /* Slightly below Max for Chat */
        }
        /* Modal takes full screen */
        .lobby-modal {
            width: 100%;
            height: 100%;
            max-height: 100% !important; /* Essential for full stretch */
            border-radius: 0;
            display: flex;
            flex-direction: column;
            clip-path: none;
        }

        .lobby-header {
            flex-shrink: 0;
        }
        .lobby-footer {
            flex-shrink: 0;
        }

        /* Content area needs to manage scroll */
        .lobby-content {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex: 1;
        }

        /* Top part (Track Info + Finance) fixed or limited height */
        .col-track {
            padding: 12px;
            gap: 12px;
            border-right: none;
            border-bottom: 1px solid var(--lobby-border);
            flex-shrink: 0;
            max-height: 50vh;
            overflow-y: auto;
        }
        .track-visual {
            height: 120px;
        }
        .track-name-large {
            font-size: 18px;
        }
        .race-timer-box {
            padding: 8px;
            margin-top: 0;
            flex-direction: row;
            justify-content: space-between;
        }
        .timer-digits {
            font-size: 24px;
        }

        /* Players list takes remaining space and scrolls */
        .col-players {
            padding: 16px;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
        }
        .track-bg-img {
            display: block;
        }

        /* Mobile Text Fixes */
        .h-text {
            font-size: 14px;
            white-space: nowrap;
        }
        .h-status {
            font-size: 10px;
        }
        .status-text {
            white-space: nowrap;
        }
        .race-timer-box {
            align-items: center;
        }
    }

    .track-bg-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        inset: 0;
        z-index: 0;
    }
    .track-overlay {
        position: relative;
        z-index: 1;
    }

    /* ANIMATIONS */
    @keyframes pulse {
        0% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.6;
        }
    }
    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    /* GLOBAL GLITCH FX */
    .lobby-modal.decoding :global(*) {
        font-family: "Aurebesh", sans-serif !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
    }
    .lobby-modal.glitching {
        animation: shake 0.05s infinite;
    }
    .lobby-modal.glitching :global(*) {
        text-shadow:
            2px 0 #0ff,
            -2px 0 #f00 !important;
        opacity: 0.9;
    }

    @keyframes shake {
        0% {
            transform: translate(1px, 1px) rotate(0deg);
        }
        10% {
            transform: translate(-1px, -2px) rotate(-1deg);
        }
        20% {
            transform: translate(-3px, 0px) rotate(1deg);
        }
        30% {
            transform: translate(3px, 2px) rotate(0deg);
        }
        40% {
            transform: translate(1px, -1px) rotate(1deg);
        }
        50% {
            transform: translate(-1px, 2px) rotate(-1deg);
        }
        60% {
            transform: translate(-3px, 1px) rotate(0deg);
        }
        70% {
            transform: translate(3px, 1px) rotate(-1deg);
        }
        80% {
            transform: translate(-1px, -1px) rotate(1deg);
        }
        90% {
            transform: translate(1px, 2px) rotate(0deg);
        }
        100% {
            transform: translate(1px, -2px) rotate(-1deg);
        }
    }

    /* FINANCE BOX */
    .finance-box {
        margin-top: 16px;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid var(--lobby-border);
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .f-header {
        font-size: 10px;
        color: var(--lobby-dim);
        letter-spacing: 2px;
        font-weight: 700;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 4px;
        margin-bottom: 4px;
    }
    .f-grid {
        display: flex;
        justify-content: space-between;
    }
    .f-item {
        display: flex;
        flex-direction: column;
    }
    .f-item .lbl {
        font-size: 9px;
        color: #94a3b8;
    }
    .f-item .val {
        font-family: "Rajdhani", monospace;
        font-size: 16px;
        color: #fff;
    }
    .f-item .val.gold {
        color: #fbbf24;
    }

    .f-ranks {
        display: flex;
        justify-content: space-between;
        font-family: "Rajdhani", monospace;
        font-size: 12px;
        margin-top: 4px;
        background: rgba(255, 255, 255, 0.02);
        padding: 4px;
    }
    .r-item.gold {
        color: #fbbf24;
    }
    .r-item.silver {
        color: #cbd5e1;
    }
    .r-item.bronze {
        color: #b45309;
    }
</style>
