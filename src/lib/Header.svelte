<script>
    import { onMount, onDestroy } from "svelte";

    let time = "";
    // Removed millis to prevent jitter
    let date = "";
    let interval;

    onMount(() => {
        const updateTime = () => {
            const now = new Date();
            // Only HH:MM:SS needed
            time = now.toLocaleTimeString("en-US", { hour12: false });
            date = now
                .toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                .toUpperCase();
        };
        updateTime();
        interval = setInterval(updateTime, 1000); // 1s update to stop jitter
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<!-- DESKTOP SLIM TACTICAL BAR (PC ONLY) -->
<header class="desktop-slim-bar">
    <!-- Left: Status & Location -->
    <div class="bar-group">
        <div class="status-dot"></div>
        <div class="bar-item">
            <span class="bar-label">SYS:</span>
            <span class="bar-value success">ONLINE</span>
        </div>
        <div class="bar-sep"></div>
        <div class="bar-item fixed-width-loc">
            <span class="bar-label">LOC:</span>
            <!-- Planet Icon SVG (Minimal) -->
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
            <!-- City/Sector Icon SVG -->
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

    <!-- Center: Title Replacement -->
    <div class="bar-center-title">
        <span class="title-main">STAR WARS</span>
        <span class="title-sub">: SHADOW OF WARS</span>
    </div>

    <!-- Right: Telemetry & Time -->
    <div class="bar-group right">
        <div class="bar-item">
            <span class="bar-value warning">42°C</span>
            <span class="bar-label">WINDS.HIGH</span>
        </div>
        <div class="bar-sep"></div>
        <div class="bar-item fixed-width-time">
            <svg
                class="bar-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span class="bar-value time">{time}</span>
        </div>
    </div>
</header>

<!-- LEFT SIDEBAR BUTTONS (DESKTOP & MOBILE) -->
<div class="tactical-sidebar">
    <button class="sidebar-btn" aria-label="Profile">
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
    <button class="sidebar-btn" aria-label="Radio">
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

<!-- MOBILE COCKPIT (Visible on small screens - UNTOUCHED) -->
<div class="mobile-cockpit">
    <div class="cockpit-group left">
        <div class="data-block">
            <span class="label">TARGET</span>
            <span class="value prime">TATOOINE</span>
        </div>
        <div class="sep-line"></div>
        <div class="data-block">
            <span class="label">LOC</span>
            <span class="value">MOS EISLEY</span>
        </div>
    </div>

    <div class="cockpit-group right">
        <div class="env-readout">
            <span class="value warning">42°C</span>
            <svg
                class="icon-small"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2" /><path d="M12 21v2" />
                <path d="M4.22 4.22l1.42 1.42" /><path
                    d="M18.36 18.36l1.42 1.42"
                />
            </svg>
        </div>
        <div class="sep-line"></div>
        <div class="time-readout">
            <span class="value time">{time}</span>
        </div>
    </div>
</div>

<style>
    /* =========================================
     DESKTOP STYLES (Slim & Military)
     ========================================= */
    .desktop-slim-bar {
        display: none;
        width: 100%;
        height: 36px;
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

    /* Title Style */
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

    /* Elements */
    .status-dot {
        width: 6px;
        height: 6px;
        background: var(--color-success);
        border-radius: 50%;
        box-shadow: 0 0 6px var(--color-success);
        animation: blink-dot 2s infinite;
    }

    .bar-item {
        display: flex;
        align-items: baseline;
        gap: 6px;
        white-space: nowrap;
    } /* Prevent wrapping */

    .fixed-width-loc {
        min-width: 250px;
    }
    .fixed-width-time {
        min-width: 90px;
        justify-content: flex-end;
        font-variant-numeric: tabular-nums;
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

    .bar-value.success {
        color: var(--color-success);
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

    @keyframes blink-dot {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
    }

    /* =========================================
     SIDEBAR BUTTONS (NEW)
     ========================================= */
    .tactical-sidebar {
        position: fixed;
        top: 56px;
        left: 20px; /* Below Header */
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
            top: 70px;
            left: 16px;
            gap: 16px;
        }
        .sidebar-btn {
            width: 52px;
            height: 52px; /* Bigger on Mobile */
        }
        .sidebar-btn svg {
            width: 24px;
            height: 24px;
        }
    }

    /* MOBILE STYLES (PRESERVED) */
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
