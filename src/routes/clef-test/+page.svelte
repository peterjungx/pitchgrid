<script lang='ts'>
    import { browser } from '$app/environment';
    import { getSx } from '$lib/scalatrix';
    import { onMount } from 'svelte';

    let sx: any = null;
    let status = 'Loading scalatrix...';
    let clefs: Array<{name: string, svg: string, label: string}> = [];

    const SCALES = [
        // Top row - from factory presets
        { name: "Bohlen-Pierce", generator: 0.583, depth: 4, mode: 5, label: "5L+4s (n=9)" },
        { name: "Mavila 7L2s", generator: 0.583, depth: 4, mode: 1, label: "7L+2s (n=9)" },
        { name: "Dicoid 7L3s", generator: 0.583, depth: 4, mode: 4, label: "7L+3s (n=10)" },
        { name: "Orwell[9]", generator: 0.583, depth: 4, mode: 5, label: "5L+4s (n=9)" },
        // Bottom row
        { name: "Porcupine8", generator: 0.583, depth: 6, mode: 2, label: "1L+7s (n=8)" },
        { name: "Machine6", generator: 0.583, depth: 4, mode: 1, label: "1L+5s (n=6)" },
        { name: "Magic7", generator: 0.583, depth: 3, mode: 6, label: "4L+3s (n=7)" },
        // Western
        { name: "Western", generator: 7/12, depth: 3, mode: 1, label: "5L+2s (n=7)" },
    ];

    /**
     * Generate clef SVG following PitchGrid spec:
     * - linearFromTwoDots: lastNode → (0, n), v_gen → (±1, 0)
     * - Check L_vec.x to ensure large step goes right
     * - Note heads: 1.25:1 aspect ratio, 20° counterclockwise tilt
     */
    function generateClef(params: any, width = 150, height = 180): string {
        const { generator = 7/12, depth = 3, mode = 1, stretch = 1.0 } = params;
        const margin = 15;
        const noteHeadWidth = 10;  // rx
        const noteHeadHeight = noteHeadWidth / 1.25;  // ry - 1.25:1 aspect ratio
        const tiltAngle = -20;  // 20° counterclockwise from horizontal
        
        const mos = sx.MOS.fromG(depth, mode, generator, stretch, 1);
        const baseScale = mos.base_scale;
        const scaleNodes = baseScale.getNodes();
        const n = mos.n;
        const vGen = mos.v_gen;
        const lVec = mos.L_vec;
        
        // Extract nodes with their scale degree (index in base_scale)
        const nodes: Array<{x: number, y: number, sd: number}> = [];
        for (let i = 0; i < scaleNodes.size(); i++) {
            const node = scaleNodes.get(i);
            if (node) {
                nodes.push({ x: node.natural_coord.x, y: node.natural_coord.y, sd: i });
            }
        }
        
        const lastNode = nodes[nodes.length - 1];
        
        // Check L_vec.x: if 0, large step is on left, flip generator sign
        const genSign = lVec.x === 0 ? -1 : 1;
        
        // Linear transform: lastNode → (0, n), vGen → (genSign, 0)
        // Using linearFromTwoDots formula
        const det = lastNode.x * vGen.y - lastNode.y * vGen.x;
        if (Math.abs(det) < 1e-10) {
            scaleNodes.delete();
            mos.delete();
            return '<svg><text>Error: degenerate</text></svg>';
        }
        
        const invDet = 1 / det;
        // Inverse of [lastNode, vGen] matrix
        const inv = {
            a: vGen.y * invDet, b: -vGen.x * invDet,
            c: -lastNode.y * invDet, d: lastNode.x * invDet
        };
        // Target: lastNode → (0, n), vGen → (genSign, 0)
        // Transform = [target] * inv([source])
        const transform = {
            a: genSign * inv.c,  // maps to x' (generator coord)
            b: genSign * inv.d,
            c: n * inv.a,        // maps to y' (scale degree coord)
            d: n * inv.b
        };
        
        const transformedNodes = nodes.map(node => ({
            x: transform.a * node.x + transform.b * node.y,
            y: transform.c * node.x + transform.d * node.y,
            sd: node.sd
        }));
        
        const minX = Math.min(...transformedNodes.map(n => n.x));
        const maxX = Math.max(...transformedNodes.map(n => n.x));
        const minY = Math.min(...transformedNodes.map(n => n.y));
        const maxY = Math.max(...transformedNodes.map(n => n.y));
        
        const usableWidth = width - 2 * margin;
        const usableHeight = height - 2 * margin;
        const scaleX = usableWidth / (maxX - minX || 1);
        const scaleY = usableHeight / (maxY - minY || 1);
        const scale = Math.min(scaleX, scaleY);
        
        const offsetX = margin + (usableWidth - (maxX - minX) * scale) / 2;
        const offsetY = margin + (usableHeight - (maxY - minY) * scale) / 2;
        
        // Convert to SVG coords (y inverted so higher scale degree = higher on screen)
        const svgNodes = transformedNodes.map(node => ({
            x: offsetX + (node.x - minX) * scale,
            y: height - (offsetY + (node.y - minY) * scale),
            sd: node.sd
        }));
        
        // Sort by scale degree for drawing lines between neighbors
        const sortedBySd = [...svgNodes].sort((a, b) => a.sd - b.sd);
        
        let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect width="${width}" height="${height}" fill="white"/>`;
        
        // Draw lines between neighboring scale degrees
        for (let i = 0; i < sortedBySd.length - 1; i++) {
            svg += `<line x1="${sortedBySd[i].x}" y1="${sortedBySd[i].y}" x2="${sortedBySd[i+1].x}" y2="${sortedBySd[i+1].y}" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
        }
        
        // Draw note heads with tilt
        for (const node of svgNodes) {
            svg += `<ellipse cx="${node.x}" cy="${node.y}" rx="${noteHeadWidth}" ry="${noteHeadHeight}" fill="black" transform="rotate(${tiltAngle} ${node.x} ${node.y})"/>`;
        }
        
        svg += '</svg>';
        
        scaleNodes.delete();
        mos.delete();
        
        return svg;
    }

    onMount(async () => {
        if (!browser) return;
        
        try {
            sx = await getSx();
            status = 'Generating clefs...';
            
            for (const scale of SCALES) {
                const svg = generateClef(scale);
                clefs.push({ name: scale.name, svg, label: scale.label });
            }
            clefs = clefs; // trigger reactivity
            
            status = 'Done!';
        } catch (err: any) {
            status = 'Error: ' + err.message;
            console.error(err);
        }
    });
</script>

<style>
    .container {
        background: #1a1a2e;
        min-height: 100vh;
        padding: 20px;
    }
    .status {
        color: white;
        text-align: center;
        margin-bottom: 20px;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        max-width: 900px;
        margin: 0 auto;
    }
    .clef-card {
        background: #16213e;
        border-radius: 8px;
        padding: 10px;
        text-align: center;
    }
    .clef-card h3 {
        color: #FFAB00;
        margin: 0 0 8px 0;
        font-size: 13px;
    }
    .clef-card .svg-container {
        background: white;
        border-radius: 4px;
        min-height: 150px;
    }
    .clef-card .label {
        color: #888;
        font-size: 10px;
        margin-top: 5px;
    }
</style>

<div class="container">
    <div class="status">{status}</div>
    <div class="grid">
        {#each clefs as clef}
            <div class="clef-card">
                <h3>{clef.name}</h3>
                <div class="svg-container">
                    {@html clef.svg}
                </div>
                <div class="label">{clef.label}</div>
            </div>
        {/each}
    </div>
</div>
