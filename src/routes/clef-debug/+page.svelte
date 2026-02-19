<script lang='ts'>
    import { browser } from '$app/environment';
    import { getSx } from '$lib/scalatrix';
    import { onMount } from 'svelte';

    let debugOutput = 'Loading scalatrix...';

    onMount(async () => {
        if (!browser) return;
        
        try {
            const sx = await getSx();
            
            const generator = 0.58;
            const depth = 3;
            const mode = 1;
            const stretch = 1.0;
            
            const mos = sx.MOS.fromG(depth, mode, generator, stretch, 1);
            const baseScale = mos.base_scale;
            const scaleNodes = baseScale.getNodes();
            
            let output = '=== CLEF DEBUG OUTPUT ===\n\n';
            output += `Parameters: gen=${generator}, depth=${depth}, mode=${mode}\n\n`;
            
            output += `mos.n = ${mos.n}\n\n`;
            
            output += `mos.v_gen:\n`;
            output += `  x = ${mos.v_gen.x}\n`;
            output += `  y = ${mos.v_gen.y}\n\n`;
            
            output += `mos.L_vec:\n`;
            output += `  x = ${mos.L_vec.x}\n`;
            output += `  y = ${mos.L_vec.y}\n\n`;
            
            output += `Nodes from mos.base_scale.getNodes():\n`;
            output += `Total nodes: ${scaleNodes.size()}\n\n`;
            
            const nodes: Array<{x: number, y: number, sd: number}> = [];
            for (let i = 0; i < scaleNodes.size(); i++) {
                const node = scaleNodes.get(i);
                if (node) {
                    nodes.push({ x: node.natural_coord.x, y: node.natural_coord.y, sd: i });
                    output += `Node ${i}: natural_coord.x = ${node.natural_coord.x}, natural_coord.y = ${node.natural_coord.y}\n`;
                }
            }
            
            const lastNode = nodes[nodes.length - 1];
            output += `\nLast node: x = ${lastNode.x}, y = ${lastNode.y}\n\n`;
            
            // Compute transform
            const n = mos.n;
            const vGen = mos.v_gen;
            const lVec = mos.L_vec;
            
            const genSign = lVec.x === 0 ? -1 : 1;
            output += `genSign (based on L_vec.x === 0): ${genSign}\n\n`;
            
            const det = lastNode.x * vGen.y - lastNode.y * vGen.x;
            output += `Determinant: ${det}\n\n`;
            
            const invDet = 1 / det;
            const inv = {
                a: vGen.y * invDet, b: -vGen.x * invDet,
                c: -lastNode.y * invDet, d: lastNode.x * invDet
            };
            output += `Inverse matrix:\n`;
            output += `  a = ${inv.a}, b = ${inv.b}\n`;
            output += `  c = ${inv.c}, d = ${inv.d}\n\n`;
            
            const transform = {
                a: genSign * inv.c,
                b: genSign * inv.d,
                c: n * inv.a,
                d: n * inv.b
            };
            output += `Transform matrix:\n`;
            output += `  a = ${transform.a}, b = ${transform.b}\n`;
            output += `  c = ${transform.c}, d = ${transform.d}\n\n`;
            
            output += `Transformed nodes:\n`;
            for (const node of nodes) {
                const tx = transform.a * node.x + transform.b * node.y;
                const ty = transform.c * node.x + transform.d * node.y;
                output += `Node ${node.sd}: (${node.x}, ${node.y}) -> (${tx.toFixed(4)}, ${ty.toFixed(4)})\n`;
            }
            
            // Analysis
            output += `\n=== ANALYSIS ===\n`;
            const transformedNodes = nodes.map(node => ({
                x: transform.a * node.x + transform.b * node.y,
                y: transform.c * node.x + transform.d * node.y,
                sd: node.sd
            }));
            
            // Check if x values are all the same (straight line)
            const xValues = transformedNodes.map(n => n.x);
            const allSameX = xValues.every(x => Math.abs(x - xValues[0]) < 0.001);
            output += `All X values same (straight line)? ${allSameX}\n`;
            output += `X values: ${xValues.map(x => x.toFixed(4)).join(', ')}\n`;
            
            // Check Y values vs expected scale degrees
            output += `\nY values (should be 0,1,2,3,4,5,6,7 for scale degrees):\n`;
            for (const node of transformedNodes) {
                output += `  sd=${node.sd}: y=${node.y.toFixed(4)} (expected: ${node.sd})\n`;
            }
            
            // Sort by Y and show
            const sortedByY = [...transformedNodes].sort((a, b) => a.y - b.y);
            output += `\nSorted by transformed Y:\n`;
            for (const node of sortedByY) {
                output += `  y=${node.y.toFixed(4)}, x=${node.x.toFixed(4)}, sd=${node.sd}\n`;
            }
            
            // The BUG: transformed Y doesn't equal scale degree!
            output += `\n=== BUG IDENTIFIED ===\n`;
            output += `The transform maps (lastNode → (0,n), v_gen → (1,0))\n`;
            output += `But this doesn't ensure y' = scale_degree!\n`;
            output += `The Y values cycle through octave equivalences, not scale degrees.\n`;
            output += `\nFor a zigzag clef, we need:\n`;
            output += `  - Y = scale degree (0, 1, 2, ..., n)\n`;
            output += `  - X = generator offset (alternates based on L/s step)\n`;
            output += `\nThe correct approach:\n`;
            output += `  - Map each node directly to (x=gen_offset, y=scale_degree)\n`;
            output += `  - Or use modular arithmetic: y' = y' mod n\n`;
            
            scaleNodes.delete();
            mos.delete();
            
            debugOutput = output;
            
        } catch (err: any) {
            debugOutput = 'Error: ' + err.message + '\n' + err.stack;
            console.error(err);
        }
    });
</script>

<style>
    .container {
        background: #1a1a2e;
        min-height: 100vh;
        padding: 20px;
        font-family: monospace;
    }
    pre {
        color: #00ff00;
        background: #0a0a1a;
        padding: 20px;
        border-radius: 8px;
        white-space: pre-wrap;
        font-size: 14px;
    }
</style>

<div class="container">
    <pre>{debugOutput}</pre>
</div>
