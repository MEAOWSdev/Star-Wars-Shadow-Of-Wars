<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";

    // Receive day/night icon from parent
    export let timeOfDayIcon =
        "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z";

    let time = "";
    let interval;
    const dispatch = createEventDispatcher();

    onMount(() => {
        const updateTime = () => {
            const now = new Date();
            time = now.toLocaleTimeString("en-US", { hour12: false });
        };
        updateTime();
        interval = setInterval(updateTime, 1000);
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<!-- DESKTOP SLIM TACTICAL BAR (PC ONLY) -->
<header class="desktop-slim-bar">
    <div class="bar-group">
        <div class="bar-item fixed-width-loc">
            <span class="bar-label">LOC:</span>
            <svg
                class="bar-icon-planet"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="12" cy="12" r="9" />
                <path d="M3.6 9h16.8" />
                <path d="M3.6 15h16.8" />
            </svg>
            <span class="bar-value">TATOOINE</span>
            <span class="bar-sub-sep">//</span>
            <svg
                class="bar-icon-city"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z" />
                <line x1="12" y1="11" x2="12" y2="21" />
                <path d="M9 11V7a3 3 0 0 1 6 0v4" />
            </svg>
            <span class="bar-value">SECTOR 7G</span>
        </div>
    </div>

    <div class="bar-center-title">
        <span class="title-main">STAR WARS</span>
        <span class="title-sub">: SHADOW OF WARS</span>
    </div>

    <div class="bar-group right">
        <!-- Telemetry Hidden on Mobile to save space -->
        <div class="bar-item desktop-only">
            <span class="bar-value warning">42°C</span>
            <span class="bar-label">WINDS.HIGH</span>
        </div>
        <div class="bar-sep desktop-only"></div>

        <div class="bar-item fixed-width-time">
            <!-- Adjusted Cycle Icon vertical alignment -->
            <svg
                class="bar-icon cycle-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={timeOfDayIcon}
                />
            </svg>
            <span class="bar-value time">{time}</span>
        </div>
    </div>
</header>

<!-- SIDEBAR -->
<div class="tactical-sidebar">
    <button
        class="sidebar-btn"
        aria-label="Profile"
        on:click={() => dispatch("openProfile")}
    >
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    </button>
    <button
        class="sidebar-btn"
        aria-label="Radio"
        on:click={() => dispatch("openRadio")}
    >
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
    </button>
</div>

<!-- MOBILE COCKPIT -->
<div class="mobile-cockpit">
    <div class="cockpit-group left">
        <div class="data-block-fixed-left">
            <span class="label">TARGET</span>
            <span class="value prime">TATOOINE</span>
        </div>
        <!-- FIXED SEPARATOR -->
        <div class="sep-line"></div>
        <div class="data-block-fixed-left">
            <span class="label">LOC</span>
            <!-- ADDED: whitespace-nowrap to prevent 2 lines -->
            <span class="value nowrap-fix">MOS EISLEY</span>
        </div>
    </div>

    <div class="cockpit-group right">
        <!-- Re-added environment readout for mobile consistency -->
        <div class="env-readout">
            <span class="value warning">42°C</span>
            <svg
                class="icon-small"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={timeOfDayIcon}
                />
            </svg>
        </div>
        <div class="sep-line"></div>
        <div class="time-readout-fixed">
            <span class="value time">{time}</span>
        </div>
    </div>
</div>

<style>
    /* ... existing styles ... */
    .desktop-slim-bar {
        display: none;
        width: 100%;
        height: 36px;
        /* background: #050505; REMOVED to show background transparent if needed, or keep. kept for consistency */
        background: #050505;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
        position: relative;
        z-index: 1000;
    }

    @media (min-width: 769px) {
        .desktop-slim-bar {
            display: flex;
        }
        .mobile-cockpit {
            display: none !important;
        }
    }

    .bar-group {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .bar-group.right {
        text-align: right;
    }

    .bar-center-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-family: "Orbitron", sans-serif;
        letter-spacing: 2px;
        pointer-events: none;
    }
    .title-main {
        color: #fff;
        font-weight: 900;
    }
    .title-sub {
        color: var(--color-accent-blue);
        font-weight: 400;
        opacity: 0.8;
    }

    .bar-item {
        display: flex;
        align-items: baseline;
        gap: 6px;
        white-space: nowrap;
    }

    .fixed-width-loc {
        min-width: 250px;
    }
    .fixed-width-time {
        min-width: 90px;
        justify-content: flex-end;
        font-variant-numeric: tabular-nums;
        display: flex;
        align-items: center;
        gap: 8px !important;
    }

    .bar-label {
        font-size: 10px;
        color: #666;
        font-weight: 700;
        letter-spacing: 1px;
    }
    .bar-value {
        font-size: 12px;
        color: #fff;
        font-weight: 600;
        letter-spacing: 1px;
        font-family: "Rajdhani", sans-serif;
    }
    .bar-sub-sep {
        color: #444;
        margin: 0 4px;
        font-size: 10px;
    }

    .bar-value.warning {
        color: var(--color-warning);
    }
    .bar-value.time {
        font-family: "Orbitron", sans-serif;
        letter-spacing: 2px;
        font-size: 14px;
    }

    .bar-sep {
        width: 1px;
        height: 12px;
        background: #333;
        transform: skewX(-20deg);
    }

    .bar-icon {
        width: 14px;
        height: 14px;
        color: var(--color-text-secondary);
        opacity: 0.8;
    }
    .bar-icon-planet,
    .bar-icon-city {
        width: 14px;
        height: 14px;
        color: var(--color-accent-blue);
        opacity: 0.9;
        position: relative;
        top: 2px;
    }

    .cycle-icon {
        color: var(--color-accent-blue);
        width: 16px;
        height: 16px;
        margin-right: 4px;
        transform: translateY(2px);
    }

    /* SIDEBAR BUTTONS */
    .tactical-sidebar {
        position: fixed;
        top: 56px;
        left: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 900;
    }

    .sidebar-btn {
        width: 42px;
        height: 42px;
        background: rgba(10, 10, 12, 0.9);
        border: 1px solid #333;
        color: #888;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }
    .sidebar-btn:hover {
        background: #151515;
        color: #fff;
        border-color: var(--color-accent-blue);
        transform: translateX(2px);
    }
    .sidebar-btn svg {
        width: 20px;
        height: 20px;
    }

    @media (max-width: 768px) {
        .tactical-sidebar {
            top: 119px; /* 3px down */
            left: 16px;
            gap: 16px;
        }
        .sidebar-btn {
            width: 52px;
            height: 52px;
        }
        .sidebar-btn svg {
            width: 24px;
            height: 24px;
        }
        .desktop-only {
            display: none !important;
        } /* Hide clutter on mobile header if any leaks */
    }

    /* MOBILE COCKPIT - FIXED LAYOUT */
    .mobile-cockpit {
        position: absolute;
        top: 10px;
        left: 2%;
        width: 96%;
        height: 48px;
        background: rgba(10, 10, 12, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        z-index: 1000;
        font-family: "Rajdhani", sans-serif;
        color: #fff;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        clip-path: polygon(0 0, 100% 0, 100% 75%, 95% 100%, 5% 100%, 0 75%);
    }
    .cockpit-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .data-block-fixed-left {
        width: auto; /* Changed from fixed 60px to auto to allow width growth if needed, but controlled by nowrap */
        min-width: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .time-readout-fixed {
        width: 70px;
        text-align: right;
    }

    .mobile-cockpit .label {
        font-size: 8px;
        color: #888;
        letter-spacing: 1px;
        display: block;
        line-height: 1;
        margin-bottom: 2px;
    }
    .mobile-cockpit .value {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    /* ADDED: Fix for line break issue */
    .nowrap-fix {
        white-space: nowrap;
    }

    .mobile-cockpit .value.prime {
        color: var(--color-accent-blue);
        text-shadow: 0 0 5px rgba(77, 184, 255, 0.4);
    }
    .mobile-cockpit .value.warning {
        color: var(--color-warning);
    }
    .mobile-cockpit .value.time {
        font-family: "Orbitron", sans-serif;
        font-size: 14px;
    }
    .mobile-cockpit .sep-line {
        width: 1px;
        height: 20px;
        background: #333;
        transform: skewX(-15deg);
    }
    .mobile-cockpit .icon-small {
        width: 14px;
        height: 14px;
        opacity: 0.8;
    }
</style>
