<script>
    import { onMount, tick } from "svelte";
    import { fade, fly } from "svelte/transition";

    let messages = [
        {
            channel: "CITY",
            user: "Pilot_X2",
            text: "Sandstorm approaching via Sector 4.",
        },
        {
            channel: "FACTION",
            user: "Cmdr_Z",
            text: "Hold position. Reinforcements inbound.",
        },
        {
            channel: "CITY",
            user: "Trader_Joe",
            text: "Anyone selling hyperdrive parts?",
        },
        {
            channel: "FACTION",
            user: "Scout_01",
            text: "Enemy patrol spotted at coordinates 45.22.",
        },
    ];

    let currentChannel = "ALL";
    let inputMessage = "";
    let msgContainer;
    let isOpen = false;
    let hasUnread = true;

    const scrollToBottom = async () => {
        await tick();
        if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    };

    const filterMessages = () => {
        if (currentChannel === "ALL") return messages;
        return messages.filter((m) => m.channel === currentChannel);
    };

    const sendMessage = () => {
        if (!inputMessage.trim()) return;
        const channel = currentChannel === "ALL" ? "CITY" : currentChannel;
        messages = [...messages, { channel, user: "ME", text: inputMessage }];
        inputMessage = "";
        scrollToBottom();
    };

    const toggleChat = () => {
        isOpen = !isOpen;
        if (isOpen) {
            hasUnread = false;
            scrollToBottom();
        }
    };
</script>

<!-- FLOATING TOGGLE BUTTON (Closed State) -->
{#if !isOpen}
    <button
        class="tactical-toggle-btn {hasUnread ? 'alert-mode' : ''}"
        on:click={toggleChat}
        in:fade={{ duration: 150 }}
    >
        <div class="icon-frame">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                ></path>
            </svg>
        </div>
        {#if hasUnread}<div class="led-indicator"></div>{/if}
    </button>
{/if}

<!-- TACTICAL COMMS PANEL (Open State) -->
{#if isOpen}
    <div class="tactical-panel" transition:fly={{ y: 20, duration: 250 }}>
        <!-- Header -->
        <div class="panel-header">
            <div class="header-info">
                <span class="sys-label">SYS.COMMS</span>
                <span class="sys-id">ch.994-A</span>
            </div>

            <div class="top-controls">
                <div class="data-bars">
                    <div class="db active"></div>
                    <div class="db active"></div>
                    <div class="db"></div>
                </div>
                <!-- Close Button -->
                <button class="tac-close-btn" on:click={toggleChat}>
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
        </div>

        <!-- Mode Selector (Tabs) -->
        <div class="mode-select">
            <button
                class="mode-btn {currentChannel === 'ALL' ? 'active' : ''}"
                on:click={() => (currentChannel = "ALL")}
            >
                ALL
            </button>
            <button
                class="mode-btn {currentChannel === 'CITY' ? 'active' : ''}"
                on:click={() => (currentChannel = "CITY")}
            >
                CITY
            </button>
            <button
                class="mode-btn {currentChannel === 'FACTION' ? 'active' : ''}"
                on:click={() => (currentChannel = "FACTION")}
            >
                FACTION
            </button>
        </div>

        <!-- Data Stream -->
        <div class="data-stream" bind:this={msgContainer}>
            <!-- Scanline Overlay -->
            <div class="scanline"></div>

            {#each filterMessages() as msg}
                <div class="entry-row {msg.channel.toLowerCase()}">
                    <div class="entry-meta">
                        <span class="id-tag">{msg.user}</span>
                        <span class="src-tag">::{msg.channel}</span>
                    </div>
                    <div class="entry-content">{msg.text}</div>
                </div>
            {/each}
        </div>

        <!-- Input Command Line -->
        <div class="command-line">
            <span class="prompt">></span>
            <input
                class="cmd-input"
                type="text"
                placeholder="ENTER TRANSMISSION"
                bind:value={inputMessage}
                on:keydown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button class="exec-btn" on:click={sendMessage}> EXECUTE </button>
        </div>
    </div>

    <!-- Hard Backdrop for Mobile Focus -->
    <div
        class="tactical-backdrop"
        on:click={toggleChat}
        transition:fade={{ duration: 150 }}
    ></div>
{/if}

<style>
    /* =========================================
     VARS & THEME (Military / Low-Vis)
     ========================================= */
    :root {
        --tac-bg: #080808;
        --tac-border: #333333;
        --tac-text: #cccccc;
        --tac-primary: #ffffff;
        --tac-highlight: #ffb700; /* Amber Warning */
        --tac-alert: #ff3333;
        --tac-success: #00cc66;
    }

    /* =========================================
     FLOATING TACTICAL BUTTON
     ========================================= */
    .tactical-toggle-btn {
        position: fixed;
        bottom: 60px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--tac-bg);
        border: 1px solid var(--tac-border);
        color: var(--tac-text);
        z-index: 1000;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
    }
    .tactical-toggle-btn:hover {
        border-color: var(--tac-primary);
        color: var(--tac-primary);
    }

    .icon-frame {
        width: 28px;
        height: 28px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tactical-toggle-btn svg {
        width: 16px;
        height: 16px;
    }

    /* Alert State */
    .tactical-toggle-btn.alert-mode {
        border-color: var(--tac-highlight);
        color: var(--tac-highlight);
    }
    .led-indicator {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 4px;
        height: 4px;
        background: var(--tac-highlight);
        box-shadow: 0 0 5px var(--tac-highlight);
        animation: blink 1s steps(2, start) infinite;
    }

    /* =========================================
     MAIN PANEL
     ========================================= */
    .tactical-panel {
        position: fixed;
        bottom: 50px;
        right: 20px;
        width: 380px;
        height: 450px;
        background: var(--tac-bg);
        border: 1px solid var(--tac-border);
        display: flex;
        flex-direction: column;
        z-index: 1002;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9);
        font-family: "Rajdhani", monospace; /* Monospaced feel */
    }

    /* Header */
    .panel-header {
        height: 40px;
        background: #111;
        border-bottom: 1px solid var(--tac-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
    }
    .sys-label {
        font-size: 11px;
        font-weight: 700;
        color: #666;
        letter-spacing: 1px;
    }
    .sys-id {
        font-size: 11px;
        color: #444;
        margin-left: 8px;
        font-family: "Orbitron", sans-serif;
    }

    .top-controls {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .data-bars {
        display: flex;
        gap: 2px;
    }
    .db {
        width: 4px;
        height: 8px;
        background: #222;
    }
    .db.active {
        background: #555;
    }

    .tac-close-btn {
        background: transparent;
        border: none;
        color: #555;
        cursor: pointer;
        padding: 4px;
        transition: 0.2s;
    }
    .tac-close-btn:hover {
        color: #fff;
        background: #222;
    }
    .tac-close-btn svg {
        width: 18px;
        height: 18px;
    }

    /* Mode Select (Tabs) */
    .mode-select {
        display: flex;
        border-bottom: 1px solid var(--tac-border);
        background: #0c0c0c;
    }
    .mode-btn {
        flex: 1;
        background: transparent;
        border: none;
        color: #555;
        font-size: 12px;
        font-weight: 700;
        padding: 12px 0;
        cursor: pointer;
        letter-spacing: 1px;
        border-right: 1px solid #1a1a1a;
        transition: 0.2s;
    }
    .mode-btn:last-child {
        border-right: none;
    }
    .mode-btn:hover {
        background: #151515;
        color: #888;
    }
    .mode-btn.active {
        background: #222;
        color: #fff;
        border-bottom: 2px solid #555;
    }

    /* Data Stream (Messages) */
    .data-stream {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: #080808;
        position: relative;
        font-family: "Consolas", "Monaco", monospace; /* Terminal font */
    }
    .scanline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
                rgba(18, 16, 16, 0) 50%,
                rgba(0, 0, 0, 0.25) 50%
            ),
            linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.06),
                rgba(0, 255, 0, 0.02),
                rgba(0, 0, 255, 0.06)
            );
        background-size:
            100% 2px,
            3px 100%;
        pointer-events: none;
        opacity: 0.3;
    }

    .entry-row {
        padding: 6px 8px;
        border-left: 2px solid transparent;
        font-size: 12px;
        line-height: 1.4;
    }
    .entry-meta {
        display: flex;
        gap: 6px;
        margin-bottom: 2px;
        font-size: 10px;
        opacity: 0.6;
    }
    .id-tag {
        color: var(--tac-text);
        font-weight: 700;
    }
    .src-tag {
        color: #666;
        text-transform: uppercase;
    }
    .entry-content {
        color: #aaa;
    }

    /* Channel Specifics */
    .entry-row.city {
        border-left-color: #333;
    }
    .entry-row.faction {
        border-left-color: var(--tac-success);
        background: rgba(0, 255, 100, 0.02);
    }
    .entry-row.faction .entry-content {
        color: #cefcde;
    }

    /* Command Line (Input) */
    .command-line {
        height: 56px;
        background: #000;
        border-top: 1px solid var(--tac-border);
        display: flex;
        align-items: center;
        padding: 0 12px;
        gap: 8px;
    }
    .prompt {
        color: #444;
        font-weight: 700;
    }
    .cmd-input {
        flex: 1;
        height: 100%;
        background: transparent;
        border: none;
        color: #fff;
        font-family: "Consolas", monospace;
        font-size: 14px;
        outline: none;
        text-transform: uppercase;
    }
    .cmd-input::placeholder {
        color: #333;
    }

    .exec-btn {
        height: 36px;
        padding: 0 16px;
        background: #1a1a1a;
        border: 1px solid #333;
        color: #888;
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
        letter-spacing: 1px;
        transition: 0.2s;
    }
    .exec-btn:hover {
        background: #333;
        color: #fff;
        border-color: #555;
    }

    /* Backdrop */
    .tactical-backdrop {
        display: none;
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

    /* =========================================
     MOBILE RESPONSIVE (CENTERED & TACTILE)
     ========================================= */
    @media (max-width: 640px) {
        .tactical-backdrop {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            z-index: 1001;
        }

        .tactical-panel {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) !important;
            bottom: auto;
            right: auto;
            width: 95%;
            max-width: 400px;
            height: 60vh;
            border: 1px solid #444;
            box-shadow: 0 0 0 1px #000;
        }

        /* Mobile UX: Bigger Touch Targets */
        .panel-header {
            height: 50px;
            background: #111;
        }
        .sys-label {
            font-size: 12px;
        }

        .tac-close-btn {
            width: 40px;
            height: 40px;
            background: #1a1a1a;
            border: 1px solid #333;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .tac-close-btn:active {
            background: #333;
        }

        .mode-btn {
            padding: 16px 0;
            font-size: 14px;
        }

        .command-line {
            height: 70px;
            padding: 0 16px;
        }
        .cmd-input {
            font-size: 16px;
        } /* Prevent Zoom */

        .exec-btn {
            height: 44px;
            background: #222;
            color: #fff;
            border-color: #555;
        }
    }
</style>
