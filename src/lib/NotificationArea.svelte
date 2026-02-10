<script>
    import { onMount, onDestroy } from "svelte";
    import { fly } from "svelte/transition";

    const notifications = [
        {
            type: "FACTION",
            source: "CMDR. VAUGHN",
            text: "SECTOR 7G SECURED. HOLD POSITION.",
            critical: false,
        },
        {
            type: "SYSTEM",
            source: "GALACTIC NET",
            text: 'PLAYER "DARTH_V" (SITH) HAS LOGGED IN.',
            critical: true,
            icon: "S",
        },
        {
            type: "BOUNTY",
            source: "GUILD NETWORK",
            text: "NEW CONTRACT: HAN SOLO. 50,000 W-CREDITS.",
            critical: false,
        },
        {
            type: "SYSTEM",
            source: "GALACTIC NET",
            text: 'PLAYER "SKYWALKER" (JEDI) HAS LOGGED IN.',
            critical: true,
            icon: "J",
        },
        {
            type: "WARNING",
            source: "SENSOR ARRAY",
            text: "ION STORM DETECTED IN UPPER ATMOSPHERE.",
            critical: false,
        },
        {
            type: "FACTION",
            source: "REBEL INTEL",
            text: "IMPERIAL PROBE DROID SPOTTED NEAR OUTPOST.",
            critical: false,
        },
    ];

    let currentNotification = null;
    let interval;
    let visible = false;

    const showRandomNotification = () => {
        const random =
            notifications[Math.floor(Math.random() * notifications.length)];
        currentNotification = random;
        visible = true;

        // Hide after 6 seconds
        setTimeout(() => {
            visible = false;
        }, 6000);
    };

    onMount(() => {
        // Quick start
        setTimeout(showRandomNotification, 1000);
        // Cycle every 8 seconds
        interval = setInterval(showRandomNotification, 8000);
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

{#if visible && currentNotification}
    <div
        class="notification-hud {currentNotification.critical
            ? 'critical-alert'
            : ''}"
        transition:fly={{ y: -10, duration: 250 }}
    >
        <div class="content-frame">
            <!-- Left Signal Bar (Unified Style) -->
            <div class="signal-bar"></div>

            <div class="content-inner">
                <!-- Critical Icon (Unified Style) -->
                {#if currentNotification.critical && currentNotification.icon}
                    <div class="icon-frame">
                        <span class="c-icon">{currentNotification.icon}</span>
                    </div>
                {/if}

                <div class="text-group">
                    <div class="header-line">
                        <span class="type-badge {currentNotification.type}"
                            >{currentNotification.type}</span
                        >
                        <span class="source-text"
                            >// {currentNotification.source}</span
                        >
                    </div>

                    <div class="message-text">
                        {currentNotification.text}
                    </div>
                </div>
            </div>

            <!-- Right Signal Bar (Symmetry) -->
            <div class="signal-bar right"></div>
        </div>
    </div>
{/if}

<style>
    .notification-hud {
        position: absolute;
        top: 4px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000; /* Ensure it's above everything including map */
        display: flex;
        justify-content: center;
        width: auto;
        pointer-events: none;
    }

    .content-frame {
        background: rgba(8, 12, 20, 0.98); /* Solid dark blue-black */
        border: 1px solid rgba(30, 58, 138, 0.5); /* Blue border base */
        border-top: none;
        display: flex;
        border-radius: 0 0 4px 4px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        min-width: 320px;
    }

    .signal-bar {
        width: 4px;
        background: #1e3a8a; /* Blue base */
    }
    .signal-bar.right {
        background: #1e3a8a;
    }

    .content-inner {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        gap: 10px;
        flex: 1;
        justify-content: center;
    }

    /* CRITICAL STYLING (The "One Style" approach with internal variation) */
    .notification-hud.critical-alert .content-frame {
        border-color: rgba(251, 191, 36, 0.6); /* Gold border */
        background: rgba(20, 15, 10, 0.98); /* Slight amber tint base */
    }
    .notification-hud.critical-alert .signal-bar {
        background: #fbbf24; /* Gold bars */
    }

    /* Icon Frame */
    .icon-frame {
        width: 22px;
        height: 22px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px; /* Square with slight radius */
        background: rgba(255, 255, 255, 0.05);
    }
    .critical-alert .icon-frame {
        border-color: #fbbf24;
        color: #fbbf24;
    }
    .c-icon {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 11px;
    }

    /* Text Group */
    .text-group {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .header-line {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 2px;
    }

    .type-badge {
        font-family: "Rajdhani", sans-serif;
        font-weight: 800;
        font-size: 9px;
        letter-spacing: 1px;
        color: #64748b;
    }
    .critical-alert .type-badge {
        color: #fbbf24;
    } /* Gold text for critical type */

    .source-text {
        font-family: "Rajdhani", sans-serif;
        font-size: 9px;
        color: #475569;
        font-weight: 600;
        text-transform: uppercase;
    }

    .message-text {
        font-family: "Inter", sans-serif;
        font-size: 11px;
        color: #cbd5e1;
        font-weight: 500;
        letter-spacing: 0.2px;
        white-space: nowrap;
    }

    .critical-alert .message-text {
        color: #fff;
        font-weight: 600;
    }

    /* MOBILE ADJUSTMENTS */
    @media (max-width: 640px) {
        .notification-hud {
            top: 70px; /* Below Header */
            bottom: auto;
            width: 90%;
            max-width: none;
            z-index: 2100; /* Above Dock */
        }
        .content-frame {
            border: 1px solid rgba(30, 58, 138, 0.5); /* Full border */
            border-radius: 4px;
            min-width: 0;
            width: 100%;
        }
        .critical-alert .content-frame {
            border-color: rgba(251, 191, 36, 0.6);
        }
        .message-text {
            white-space: normal; /* Wrap text */
            font-size: 11px;
            line-height: 1.3;
            text-align: center;
        }
        .content-inner {
            flex-direction: column; /* Stack details on mobile */
            gap: 4px;
            padding: 8px 12px;
        }
        .header-line {
            justify-content: center;
        }
        /* Keep icon frame hidden or show it if space allows? User said centralized. keep hidden for cleaner mobile look */
        .icon-frame {
            display: none;
        }
    }
</style>
