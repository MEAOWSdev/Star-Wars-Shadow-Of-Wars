<script>
    import { createEventDispatcher, onMount } from "svelte";

    // Assets
    /* Use same icons or create new via SVG if needed */

    export let isOpen = false;

    const dispatch = createEventDispatcher();

    // --- MOCK DATA ---
    const currentLocation = {
        planet: "TATOOINE",
        city: "MOS EISLEY",
    };

    const bounties = [
        { target: "SITH VANDAR", reward: 25000, status: "ACTIVE" },
        { target: "JEDI KORRA", reward: 18000, status: "TRACKING" },
        { target: "SMUGGLER JAX", reward: 5000, status: "OPEN" },
        { target: "DROID R-99", reward: 3500, status: "OPEN" },
    ];

    let volume = 75;

    // --- DRAG LOGIC (DESKTOP) ---
    let w = 0;
    let h = 0;
    let x = 120; // Offset from profile
    let y = 120;
    let isDragging = false;
    let startX, startY;

    function startDrag(e) {
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

    // --- AUDIO VISUALIZER ---
    const audioBars = Array.from({ length: 48 }, () => ({
        duration: (0.5 + Math.random() * 0.9).toFixed(2) + "s",
    }));

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
            class="radio-window"
            style="transform: translate({x}px, {y}px);"
            class:dragging={isDragging}
            class:decoding={isDecoding}
            class:glitching={isGlitching}
        >
            <!-- HEADER -->
            <div
                class="window-header"
                on:mousedown={startDrag}
                role="toolbar"
                tabindex="0"
                aria-label="Radio Header"
            >
                <div class="header-title">
                    <span class="icon">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
                        </svg>
                    </span>
                    <span class="text">GALACTIC COMMS // FREQ-99.5</span>
                </div>
                <!-- CLOSE BUTTON (Matches UserProfile style) -->
                <button
                    class="close-btn"
                    on:click={close}
                    aria-label="Close Radio"
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
                <!-- LOCATION & RADIO PLAYER -->
                <div class="radio-section">
                    <div class="location-info">
                        <div class="planet">{currentLocation.planet}</div>
                        <div class="city">{currentLocation.city}</div>
                    </div>

                    <!-- SPECTROGRAM VISUALIZER -->
                    <div class="spectrogram">
                        {#each audioBars as bar}
                            <div
                                class="bar"
                                style="--duration: {bar.duration}"
                            ></div>
                        {/each}
                    </div>

                    <!-- VOLUME CONTROL -->
                    <div class="volume-control">
                        <span class="vol-icon">VOL</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            bind:value={volume}
                            class="volume-slider"
                        />
                        <span class="vol-val">{volume}%</span>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- BOUNTY HUNTER SECTION -->
                <div class="bounty-section">
                    <div class="section-title">
                        ACTIVE CONTRACTS // BOUNTY BOARD
                    </div>
                    <div class="bounty-list">
                        {#each bounties as bounty}
                            <div class="bounty-item">
                                <div class="bounty-target">
                                    <span class="target-name"
                                        >{bounty.target}</span
                                    >
                                    <span
                                        class="status {bounty.status.toLowerCase()}"
                                        >{bounty.status}</span
                                    >
                                </div>
                                <div class="reward">
                                    <span class="aurebesh-curr">$</span>
                                    {bounty.reward.toLocaleString()}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<svelte:window on:mouseup={stopDrag} on:mousemove={onMove} />

<style>
    /* GLOBAL RESET */
    * {
        box-sizing: border-box;
    }

    /* AUREBESH FONT (Assumed loaded globally or via @font-face in this component too) */
    @font-face {
        font-family: "Aurebesh";
        src: url("../../assets/fonts/Aurebesh-BoldItalic.otf")
            format("opentype");
        font-weight: bold;
        font-style: italic;
    }

    /* OVERLAY */
    .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 2000;
        pointer-events: none;
    }

    /* WINDOW */
    .radio-window {
        position: absolute;
        width: 340px;
        /* Estetica "Preto Noite Vidro Fosco" - Consistent with Profile */
        background: rgba(0, 0, 0, 0.92);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(20, 30, 50, 0.8);
        box-shadow:
            0 0 50px rgba(0, 0, 0, 0.9),
            inset 0 0 20px rgba(10, 20, 40, 0.5);
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        overflow: hidden;
        border-radius: 2px;
        color: #fff;
        top: 0;
        left: 0;
        max-height: 80vh;
    }

    .radio-window.dragging {
        transition: none;
        opacity: 0.95;
        border-color: rgba(77, 184, 255, 0.3);
    }

    /* HEADER */
    .window-header {
        height: 32px;
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
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 1px;
        color: #e2e8f0; /* Light Text */
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    }
    .header-title .icon svg {
        width: 14px;
        height: 14px;
        color: #4db8ff; /* Cyan Blue */
        filter: drop-shadow(0 0 4px rgba(77, 184, 255, 0.6));
    }

    .close-btn {
        background: transparent;
        border: none;
        color: #cbd5e1;
        cursor: pointer;
        padding: 4px;
        border-radius: 2px;
        transition: 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
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
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
    }

    /* RADIO SECTION */
    .radio-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }
    .location-info {
        text-align: center;
    }
    .planet {
        font-family: "Orbitron", sans-serif;
        font-size: 18px;
        font-weight: 900;
        letter-spacing: 2px;
        color: #fff;
        text-transform: uppercase;
        text-shadow: 0 0 10px rgba(77, 184, 255, 0.5); /* Blue glow */
    }
    .city {
        font-size: 12px;
        color: #4db8ff; /* Cyan */
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    /* SPECTROGRAM VISUALIZER */
    .spectrogram {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 1px; /* Tighter gap */
        height: 60px; /* Taller */
        width: 100%;
        margin: 12px 0;
        padding: 0 2px;
        background: rgba(77, 184, 255, 0.05); /* Subtle bg */
        border-radius: 4px;
        border: 1px solid rgba(77, 184, 255, 0.1);
        overflow: hidden;
    }
    .bar {
        flex: 1; /* Grow to fill */
        background: #4db8ff; /* Cyan */
        animation: equalizer var(--duration, 1s) ease-in-out infinite;
        border-radius: 1px 1px 0 0;
        box-shadow: 0 0 5px rgba(77, 184, 255, 0.6);
        min-width: 2px;
    }
    /* Remove nth-child overrides if we use inline --duration */
    /* But for now, if I haven't updated HTML, I must keep them or update HTML in same step. */

    @keyframes equalizer {
        0% {
            height: 20%;
            opacity: 0.5;
        }
        50% {
            height: 100%;
            opacity: 1;
        }
        100% {
            height: 20%;
            opacity: 0.5;
        }
    }

    /* VOLUME CONTROL */
    .volume-control {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(0, 0, 0, 0.3);
        padding: 8px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .vol-icon {
        font-size: 10px;
        font-weight: 700;
        color: #4db8ff; /* Cyan */
    }
    .volume-slider {
        flex: 1;
        accent-color: #4db8ff; /* Cyan */
        height: 4px;
        cursor: pointer;
    }
    .vol-val {
        font-size: 11px;
        min-width: 30px;
        text-align: right;
        font-family: monospace;
    }

    .divider {
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(77, 184, 255, 0.5),
            /* Blue gradient */ transparent
        );
        width: 100%;
    }

    /* BOUNTY SECTION */
    .bounty-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .section-title {
        font-size: 10px;
        color: #94a3b8;
        letter-spacing: 1px;
        font-weight: 700;
        text-transform: uppercase;
        border-bottom: 2px solid #334155;
        padding-bottom: 4px;
    }

    .bounty-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: 150px;
        overflow-y: auto;
    }

    .bounty-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.03);
        padding: 8px;
        border-left: 2px solid #ef4444; /* Red for bounty */
        transition: 0.2s;
    }
    .bounty-item:hover {
        background: rgba(239, 68, 68, 0.1);
    }

    .target-name {
        font-size: 12px;
        font-weight: 700;
        color: #fff;
    }
    .status {
        font-size: 9px;
        padding: 1px 4px;
        border-radius: 2px;
        margin-left: 6px;
    }
    .status.active {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }
    .status.tracking {
        background: rgba(234, 179, 8, 0.2);
        color: #eab308;
    }
    .status.open {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
    }

    .reward {
        font-size: 12px;
        font-weight: 700;
        color: #fbbf24; /* Gold */
        display: flex;
        align-items: center;
    }
    .aurebesh-curr {
        font-family: "Aurebesh", sans-serif;
        font-weight: normal;
        margin-right: 2px;
        font-size: 13px;
    }

    /* DECODING/GLITCH CLASSES */
    /* DECODING EFFECT (Force Aurebesh Global) */
    .radio-window.decoding :global(*) {
        font-family: "Aurebesh", sans-serif !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
    }

    /* GLITCH EFFECT (Transition Global) */
    .radio-window.glitching :global(*) {
        text-shadow:
            2px 0 #0ff,
            -2px 0 #f00 !important; /* Cyan/Red glitch */
        opacity: 0.9;
    }

    /* MOBILE OPTIMIZATIONS */
    @media (max-width: 768px) {
        .radio-window {
            position: fixed;
            top: 60px; /* Below header */
            left: 50%;
            transform: translateX(-50%) !important;
            width: 90%;
            max-width: 360px;
        }
    }
</style>
