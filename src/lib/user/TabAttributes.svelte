<script>
    export let attributes = {
        strength: 10,
        intelligence: 10,
        resistance: 10,
        precision: 10,
    };
</script>

<div class="attrs-grid">
    <div class="attr-compact">
        <div class="attr-icon strength">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"><path d="M6 9l6 6 6-6" /></svg
            >
        </div>
        <div class="attr-val">{attributes.strength}</div>
        <div class="attr-label">STR</div>
    </div>

    <div class="attr-compact">
        <div class="attr-icon int">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path
                    d="M12 8h.01"
                /></svg
            >
        </div>
        <div class="attr-val">{attributes.intelligence}</div>
        <div class="attr-label">INT</div>
    </div>

    <div class="attr-compact">
        <div class="attr-icon res">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg
            >
        </div>
        <div class="attr-val">{attributes.resistance}</div>
        <div class="attr-label">RES</div>
    </div>

    <div class="attr-compact">
        <div class="attr-icon prec">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><circle cx="12" cy="12" r="10" /><circle
                    cx="12"
                    cy="12"
                    r="3"
                /><line x1="12" y1="2" x2="12" y2="22" /><line
                    x1="2"
                    y1="12"
                    x2="22"
                    y2="12"
                /></svg
            >
        </div>
        <div class="attr-val">{attributes.precision}</div>
        <div class="attr-label">PRE</div>
    </div>
</div>

<style>
    .attrs-grid {
        display: grid;
        grid-template-columns: repeat(
            4,
            1fr
        ); /* All in one row if possible, or 2x2 compact */
        gap: 8px;
        margin-bottom: 8px;
    }

    .attr-compact {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 8px 4px;
        border-radius: 2px;
    }

    .attr-icon {
        width: 14px;
        height: 14px;
        margin-bottom: 2px;
        opacity: 0.7;
    }

    .strength {
        color: #f87171;
    }
    .int {
        color: #60a5fa;
    }
    .res {
        color: #fbbf24;
    }
    .prec {
        color: #34d399;
    }

    .attr-val {
        font-family: "Orbitron", sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #e0e6ed;
    }

    .attr-label {
        font-family: "Rajdhani", sans-serif;
        font-size: 8px;
        font-weight: 600;
        letter-spacing: 1px;
        color: #556677;
        margin-top: 1px;
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
        .attrs-grid {
            grid-template-columns: 1fr 1fr; /* 2x2 Big Grid */
            gap: 12px;
        }

        .attr-compact {
            padding: 16px;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(51, 65, 85, 0.5);
        }

        .attr-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
        }

        .attr-val {
            font-size: 24px; /* Much larger number */
        }

        .attr-label {
            font-size: 12px;
            color: #94a3b8;
        }
    }
</style>
