<script>
    export let buffs = [
        {
            name: "Hyper-Focus",
            desc: "+15% Precision",
            time: "12m",
            type: "buff",
        },
        { name: "Stim-Pack", desc: "Regen 2HP/s", time: "45s", type: "buff" },
        {
            name: "Rad. Poisoning",
            desc: "-5% HP/s",
            time: "2m",
            type: "debuff",
        },
    ];
</script>

<div class="buffs-container">
    <div class="section-title">ACTIVE EFFECTS</div>

    <div class="buffs-list">
        {#each buffs as buff}
            <div class="buff-item {buff.type}">
                <div class="buff-icon">
                    <!-- Placeholder Icon based on type -->
                    {#if buff.type === "buff"}
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"><path d="M12 2v20M2 12h20" /></svg
                        >
                    {:else}
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            ><path d="M18 6L6 18M6 6l12 12" /></svg
                        >
                    {/if}
                </div>
                <div class="buff-info">
                    <div class="buff-header">
                        <span class="buff-name">{buff.name}</span>
                        <span class="buff-time">{buff.time}</span>
                    </div>
                    <div class="buff-desc">{buff.desc}</div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .buffs-container {
        margin-top: 16px;
    }

    .section-title {
        font-family: "Orbitron", sans-serif;
        font-size: 10px;
        color: #94a3b8; /* Brighter slate */
        margin-bottom: 8px;
        letter-spacing: 1px;
    }

    .buffs-list {
        display: grid;
        grid-template-columns: 1fr 1fr; /* Two columns side-by-side */
        gap: 8px;
    }

    .buff-item {
        display: flex;
        align-items: center;
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(51, 65, 85, 0.5);
        padding: 6px;
        border-radius: 2px;
        gap: 8px;
        min-width: 0; /* Prevent flex overflow */
    }

    .buff-item.buff {
        border-left: 2px solid #35b868;
    }
    .buff-item.debuff {
        border-left: 2px solid #ff3e3e;
    }

    .buff-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 2px;
        color: #ccc;
    }
    .buff-item.buff .buff-icon {
        color: #35b868;
    }
    .buff-item.debuff .buff-icon {
        color: #ff3e3e;
    }

    .buff-icon svg {
        width: 12px;
        height: 12px;
    }

    .buff-info {
        flex: 1;
        min-width: 0;
    }

    .buff-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 4px;
    }

    .buff-name {
        font-family: "Rajdhani", sans-serif;
        font-weight: 700;
        font-size: 12px;
        color: #f1f5f9; /* Brighter white */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .buff-time {
        font-family: "Orbitron", sans-serif;
        font-size: 8px;
        color: #cbd5e1; /* Brighter grey */
        flex-shrink: 0;
    }

    .buff-desc {
        font-size: 10px;
        color: #94a3b8; /* Brighter desc */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
        .buffs-container {
            margin-top: 24px;
        }
        .section-title {
            font-size: 12px;
            margin-bottom: 12px;
        }

        .buffs-list {
            grid-template-columns: 1fr 1fr; /* Maintain side-by-side */
            gap: 12px;
        }

        .buff-item {
            padding: 12px;
            background: rgba(15, 23, 42, 0.6);
            flex-direction: column; /* Stack icon and text for better vertical fit if needed, or keep row. User said side by side buffs. */
            /* Actually, let's keep row layout but make it taller/bigger */
            flex-direction: row;
            align-items: flex-start;
        }

        .buff-icon {
            width: 32px;
            height: 32px;
            margin-right: 8px;
        }
        .buff-icon svg {
            width: 18px;
            height: 18px;
        }

        .buff-name {
            font-size: 14px;
        }
        .buff-time {
            font-size: 10px;
        }
        .buff-desc {
            font-size: 12px;
            white-space: normal;
        } /* Allow wrap on mobile */
    }
</style>
