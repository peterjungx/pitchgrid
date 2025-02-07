import { index_of } from '$lib//util';

export function angle(v1_x:number, v1_y:number, v2_x:number, v2_y:number):number {
    return Math.acos( (v1_x*v2_x + v1_y*v2_y) / Math.sqrt(v1_x**2+v1_y**2) / Math.sqrt(v2_x**2+v2_y**2) );
}

export type system = {
    a:number;
    b:number;
}
export type nodecoord ={
    aa:number;
    bb:number;
}

const f = (s:nodecoord):nodecoord => {return {aa: s.aa, bb: s.aa+s.bb}};
const g = (s:nodecoord):nodecoord => {return {aa: s.bb, bb: s.aa+s.bb}};
const f_inv = (s:nodecoord):nodecoord => {return {aa: s.aa, bb: s.bb-s.aa}};
const g_inv = (s:nodecoord):nodecoord => {return {aa: s.bb-s.aa, bb: s.aa}};
const reflect = (s:nodecoord):nodecoord => {return {aa: s.bb, bb: s.aa}};

type nodepos = {
    x:number;
    y:number;
}
export type affine_transform = {
    m11:number;
    m12:number;
    m21:number;
    m22:number;
    dx:number;
    dy:number;
}
export function apply_affine(a:affine_transform, c:nodepos):nodepos{
    return {
        x: a.m11*c.x + a.m12*c.y + a.dx,
        y: a.m21*c.x + a.m22*c.y + a.dy
    };
}


export type node = {
    c:nodecoord;
    c_orig?:nodecoord;
    p:nodepos;
    col:string;
    text:string;
    alt_text?:string;
    on_scale?:boolean;
}
export type edge = {
    c1:nodecoord;
    c2:nodecoord;
    p1:nodepos;
    p2:nodepos;
    col:string;
}
export type rect = {
    c1:nodecoord;
    c2:nodecoord;
    c3:nodecoord;
    c4:nodecoord;
    p1:nodepos;
    p2:nodepos;
    p3:nodepos;
    p4:nodepos;
    col:string;
}

export type MappedScaleDisplayData = { 
    s: system,
    s_target: system,
    s_tune: system,
    tune_target: boolean,
    dual: boolean,
    edge_length: number,
}

function node_pos(c:nodecoord, s:system, scale:number, affine_coord_transform:affine_transform|undefined):nodepos{
    let n = {
        x:-s.a*scale/2+c.aa*scale, 
        y:s.b*scale/2-c.bb*scale
    };
    if (affine_coord_transform){
        n = apply_affine(affine_coord_transform, n);
    }
    return n;
}
export function node_at_coord(c:nodecoord, s:system, scale:number, col:string, affine_coord_transform:affine_transform|undefined):node{
    return {c:c, 
        p:node_pos(c, s, scale, affine_coord_transform), 
        col:col, 
        text:''};
}
export function edge_at_coords(c1:nodecoord, c2:nodecoord, s:system, scale:number, col:string, affine_coord_transform:affine_transform|undefined):edge{
    return {c1:c1, c2:c2, 
        p1:node_pos(c1, s, scale, affine_coord_transform), 
        p2:node_pos(c2, s, scale, affine_coord_transform), 
        col:col
    };
}
export function rect_at_coords(
    c1:nodecoord, 
    c2:nodecoord, 
    c3:nodecoord, 
    c4:nodecoord, 
    s:system, 
    scale:number,
    col:string,
    affine_coord_transform:affine_transform|undefined
):rect{
    return {
        c1:c1, c2:c2, c3:c3, c4:c4, 
        p1:node_pos(c1, s, scale, affine_coord_transform), 
        p2:node_pos(c2, s, scale, affine_coord_transform), 
        p3:node_pos(c3, s, scale, affine_coord_transform), 
        p4:node_pos(c4, s, scale, affine_coord_transform),
        col:col
    };
}

const c2s = (c:nodecoord):system => {return {a:c.aa, b:c.bb}};
const s2c = (s:system):nodecoord => {return {aa:s.a, bb:s.b}};

function gen_coprime_tree(max_level:number):system[]{
    let tree:system[] = [{a:1, b:1}, {a:1, b:2}];
    let level = 1;
    while (level < max_level){
        let tree_length = tree.length;
        for (let i=tree_length/2; i<tree_length; i++){
            let t = s2c(tree[i]);
            tree.push(c2s(f(t)));
            tree.push(c2s(g(t)));
        }
        level++;
    }
    return tree;
}
export const coprime_tree = gen_coprime_tree(5);

export function get_transform_sequence(s:system, t:system, dual:boolean=false):any[]{
    let from = index_of(coprime_tree, s);
    let to = index_of(coprime_tree, t);
    // find common ancestor

    let from_path = [];
    while(from>0){
        from_path.unshift(from);
        from = from >> 1;
    }
    from_path.unshift(0);
    let to_path = [];
    while(to>0){
        to_path.unshift(to);
        to = to >> 1;
    }
    to_path.unshift(0);

    let common = 0;
    if (!dual){ 
        
        while (from_path[common+1] == to_path[common+1]){
            if (common>from_path.length || common>to_path.length){
                break;
            }
            common++;
        }
        //return common;
    }
    from_path = from_path.slice(common+1).reverse();
    to_path = to_path.slice(common+1);
    
    let sequence = [];
    for (let t of from_path){
        sequence.push(t%2 ? g_inv : f_inv);
    }
    if (dual){
        sequence.push(reflect);
    }
    for (let t of to_path){
        sequence.push(t%2 ? g : f);
    }
    return sequence;
}



export function apply_transform(c:nodecoord, transform_sequence:any[]){
    return transform_sequence.reduce((acc, f) => f(acc), c);
}

export function apply_lattice_transform(elems:node[]|edge[]|rect[], from:system, to:system, scale:number, dual:boolean=false, affine_coord_transform:affine_transform|undefined){
    let transform_sequence = get_transform_sequence(from, to, dual);
    for (let e of elems){
        if ('c' in e){
            if (!e.c_orig){
                e.c_orig = e.c;
            }
            e.c = apply_transform(e.c, transform_sequence);
            e.p = node_pos(e.c, to, scale, affine_coord_transform);
        }else if ('c3' in e){
            e.c1 = apply_transform(e.c1, transform_sequence);
            e.c2 = apply_transform(e.c2, transform_sequence);
            e.c3 = apply_transform(e.c3, transform_sequence);
            e.c4 = apply_transform(e.c4, transform_sequence);
            e.p1 = node_pos(e.c1, to, scale, affine_coord_transform);
            e.p2 = node_pos(e.c2, to, scale, affine_coord_transform);
            e.p3 = node_pos(e.c3, to, scale, affine_coord_transform);
            e.p4 = node_pos(e.c4, to, scale, affine_coord_transform);
        }else {
            e.c1 = apply_transform(e.c1, transform_sequence);
            e.c2 = apply_transform(e.c2, transform_sequence);
            e.p1 = node_pos(e.c1, to, scale, affine_coord_transform);
            e.p2 = node_pos(e.c2, to, scale, affine_coord_transform);
        }
    }
}


export function prepare_default_lattice(s:system, edge_length:number, lattice_basecolor:string, lattice_rectcolor:string, affine_coord_transform:affine_transform|undefined){
    let nodes:node[] = [];
    let edges:edge[] = [];
    let rects:rect[] = [];

    // nodes
    for (let aa = 0; aa <= s.a; aa++) {
        for (let bb = 0; bb <= s.b; bb++) {
            nodes.push(node_at_coord({aa,bb}, s, edge_length, lattice_basecolor, affine_coord_transform));
        }
    }

    // edges
    for (let aa = 0; aa <= s.a; aa++) {
        for (let bb = 0; bb <= s.b; bb++) {
            if (aa < s.a) {
                edges.push(edge_at_coords({aa:aa,bb:bb}, {aa:aa+1,bb:bb}, s, edge_length, lattice_basecolor, affine_coord_transform));
            }
            if (bb < s.b) {
                edges.push(edge_at_coords({aa:aa,bb:bb}, {aa:aa,bb:bb+1}, s, edge_length, lattice_basecolor, affine_coord_transform));
            }
        }
    }

    // rects
    let aa = 0;
    for (let bb = 0; bb < s.b; bb++) {
        while ((aa+1)*s.b/s.a<bb+1){
            rects.push(rect_at_coords({aa,bb}, {aa:aa+1,bb}, {aa:aa+1,bb:bb+1}, {aa,bb:bb+1}, s, edge_length, lattice_rectcolor, affine_coord_transform));
            aa++;
        }
        rects.push(rect_at_coords({aa,bb}, {aa:aa+1,bb}, {aa:aa+1,bb:bb+1}, {aa,bb:bb+1}, s, edge_length, lattice_rectcolor, affine_coord_transform
            
        ));
    }

    return {nodes, edges, rects};
}

export function prepare_full_lattice(s:system, edge_length:number, nodecolor:string, edgecolor:string, affine_t:affine_transform, xmin:number, xmax:number, ymin:number, ymax:number):{nodes:node[], edges:edge[]} {
    
    // determine lattice that covers the window in a coordinate system given by affine_t
    // strategy: 
    // 1. find inverse affine transform
    // 3. determine min/max x/y values for nodes
    let nodes:node[] = [];
    let edges:edge[] = [];


    let det = (affine_t.m11*affine_t.m22-affine_t.m12*affine_t.m21);
    let inverse_affine_t = {
        m11: affine_t.m22/det,
        m12: -affine_t.m12/det,
        m21: -affine_t.m21/det,
        m22: affine_t.m11/det,
        dx: -affine_t.dx*affine_t.m22/det + affine_t.dy*affine_t.m12/det,
        dy: affine_t.dx*affine_t.m21/det - affine_t.dy*affine_t.m11/det
    };

    //let test = {x:4.2346, y:3.2346};
    //console.log(test,  apply_affine(inverse_affine_t, apply_affine(affine_t, test)), apply_affine(affine_t, apply_affine(inverse_affine_t, test)));

    let zeronode = node_pos({aa:0, bb:0}, s, edge_length, affine_t)
    let ul = apply_affine(inverse_affine_t, {x:xmin - zeronode.x, y:ymin });
    let ur = apply_affine(inverse_affine_t, {x:xmin - zeronode.x, y:ymax });
    let ll = apply_affine(inverse_affine_t, {x:xmax - zeronode.x, y:ymin });
    let lr = apply_affine(inverse_affine_t, {x:xmax - zeronode.x, y:ymax });  
    
    let min_a = Math.ceil (Math.min(ul.x, ur.x, ll.x, lr.x)/edge_length );
    let max_a = Math.floor  (Math.max(ul.x, ur.x, ll.x, lr.x)/edge_length );
    let min_b = Math.ceil (Math.min(-ul.y, -ur.y, -ll.y, -lr.y)/edge_length );
    let max_b = Math.floor  (Math.max(-ul.y, -ur.y, -ll.y, -lr.y)/edge_length );



    console.log('coords', min_a, max_a, min_b, max_b);

    // nodes
    for (let aa = min_a; aa <= max_a; aa++) {
        for (let bb = min_b; bb <= max_b; bb++) {
            let mapped = node_pos({aa, bb}, s, edge_length, affine_t);
            if (mapped.x > xmin  && mapped.x < xmax  && mapped.y > ymin && mapped.y < ymax ){
                nodes.push(node_at_coord({aa,bb}, s, edge_length, nodecolor, affine_t));
            }
            
        }
    }
    
    // edges

    const map = new Map();
    nodes.forEach((n:node) => {map.set(`${n.c.aa},${n.c.bb}`, n)});

    nodes.forEach((n:node) => {
        if (map.has( `${n.c.aa-1},${n.c.bb}`)){
            edges.push(edge_at_coords({aa:n.c.aa,bb:n.c.bb}, {aa:n.c.aa-1,bb:n.c.bb}, s, edge_length, edgecolor, affine_t));
        }
        if (map.has( `${n.c.aa},${n.c.bb-1}`)){
            edges.push(edge_at_coords({aa:n.c.aa,bb:n.c.bb}, {aa:n.c.aa,bb:n.c.bb-1}, s, edge_length, edgecolor, affine_t));
        }
    });

    //for (let aa = min_x; aa <= max_x; aa++) {
    //    for (let bb = min_y; bb <= max_y; bb++) {
    //        if (aa < s.a) {
    //            edges.push(edge_at_coords({aa:aa,bb:bb}, {aa:aa+1,bb:bb}, s, edge_length, edgecolor, affine_t));
    //        }
    //        if (bb < s.b) {
    //            edges.push(edge_at_coords({aa:aa,bb:bb}, {aa:aa,bb:bb+1}, s, edge_length, edgecolor, affine_t));
    //        }
    //    }
    //}

    return {nodes, edges};
}


export function calc_scale(s:system, mode:number, oct_below:number = 0, oct_above:number = 0):nodecoord[]{
    let scale_base:nodecoord[] = [{aa:0,bb:0}];
    let aa = 0;
    for (let bb = 0; bb < s.b; bb++) {
        while ((aa+1)*s.b/s.a<bb+1){
            scale_base.push({aa:aa+1,bb});
            aa++;
        }
        scale_base.push({aa:aa+1,bb});
    }

    if (mode > s.a+s.b-1){
        mode = s.a+s.b-1;
    }
    for (let acc=0; acc<scale_base.length-mode-1; acc++){
        // find note farthest from b/a line
        let max_dist = 0;
        let max_note = 0;
        for (let i=1; i<scale_base.length; i++){
            let note = scale_base[i];
            let dist = (note.aa*s.b - note.bb*s.a);
            if (dist > max_dist){
                max_dist = dist;
                max_note = i;
            }
        }
        let note = scale_base[max_note];
        note.aa = note.aa-1;
        note.bb = note.bb+1;
    }

    let scale:nodecoord[] = [];
    for (let i=1; i<oct_below+1; i++){
        let scale_below = scale_base.map((c:nodecoord) => {return {aa:c.aa-s.a*i,bb:c.bb-s.b*i}});
        scale = scale_below.concat(scale);
    }
    scale = scale.concat(scale_base);
    for (let i=1; i<oct_above+1; i++){
        let scale_above = scale_base.map((c:nodecoord) => {return {aa:c.aa+s.a*i,bb:c.bb+s.b*i}});
        scale = scale.concat(scale_above);
    }
    scale.push({aa:s.a*(1 + oct_above),bb:s.b*(1 + oct_above)});
    return scale;
}

export function calc_scale_target_labels(scale_nodes:node[], s_target:system){
    let majorscale = calc_scale(s_target, 1);
    let labels = s_target.a==2 && s_target.b==5 ? ['C','D','E','F','G','A','B'] : [...Array(s_target.a+s_target.b).keys()].map(i => `${i+1}`);
    scale_nodes.forEach((n:node) => {
        let {aa, bb} = n.c;

        //let i = (aa==s_target.a && bb==s_target.b)?(aa+bb):(aa+bb + 5*(s_target.a + s_target.b)) % (s_target.a + s_target.b);
        //let i = (aa==s_target.a && bb==s_target.b)?(aa+bb):(aa+bb + 5*(s_target.a + s_target.b)) % (s_target.a + s_target.b);
        let i = (aa+bb + 5*(s_target.a + s_target.b)) % (s_target.a + s_target.b);
        let octave = Math.floor((aa+bb) / (s_target.a + s_target.b));
        let accidental = majorscale[i].aa - aa + s_target.a*octave;
        
        n.alt_text = `${labels[i]}` + `${accidental>0?'#'.repeat(accidental):accidental<0?'b'.repeat(-accidental):''}`;
    });
}

export function prepare_scale(scale:nodecoord[], s:system, edge_length:number, color:string, labels:string[]|undefined, oct_below:number = 0, oct_above:number = 0):{nodes:node[], edges:edge[]}{
    let nodes:node[] = [];
    let edges:edge[] = [];

    let majorscale = calc_scale(s, 1, oct_below, oct_above);

    nodes = scale.map((c:nodecoord, i:number) => {
        let accidental = majorscale[i].aa - c.aa;
        let label = (labels ? labels[i] : `${i%(s.a+s.b)+1}`) + `${accidental>0?'#'.repeat(accidental):accidental<0?'b'.repeat(-accidental):''}`;
        return {
            c:c, 
            p:{
                x:-s.a*edge_length/2+c.aa*edge_length, 
                y:s.b*edge_length/2-c.bb*edge_length
            }, 
            col:color, 
            text:label
        };
    });
    
    edges = [];
    for (let i = 0; i < nodes.length-1; i++) {
        let n1=nodes[i];
        let n2=nodes[i+1];
        edges.push({
            c1:n1.c, c2:n2.c,
            p1:n1.p, p2:n2.p,
            col:color
        });
    }
    return {nodes, edges};
}


export function calc_generator_coord(s:system):nodecoord{
    let a = s.a;
    let b = s.b;
    let transform_invs = [];
    while (a!=1 || b!=1){
        if (a>b){
            a=a-b;
            transform_invs.push('g');
        }else{
            b=b-a;
            transform_invs.push('f');
        }
    }
    a=0;
    b=1;
    while(transform_invs.length>0){
        let t = transform_invs.pop();
        if (t=='g'){
            a=a+b;
        }else{
            b=a+b;
        }
    }
    return {aa:a, bb:b};
}

import {ConsistentTuning} from '$lib/consistent_tuning';
export function get_nodes_for_midi_in_strip(s:system, tuning:ConsistentTuning, min_det:number=-5, max_det:number=6, midi_offset:number=60){
    let generator_node = calc_generator_coord(s);
    let representants = [];
    let base_f = tuning.coord_to_freq(0,0);
    let oct_f = tuning.coord_to_freq(s.a, s.b);

    for (let det = min_det; det <= max_det; det++){
        let c = {aa:generator_node.aa*det, bb:generator_node.bb*det};
        while (tuning.coord_to_freq(c.aa, c.bb) <= base_f){
            c.aa += s.a;
            c.bb += s.b;
        }
        while (tuning.coord_to_freq(c.aa, c.bb) > oct_f){
            c.aa -= s.a;
            c.bb -= s.b;
        }
        representants.push(c);
    }
    // sort representants by pitch. Pitch is given by x coordinate of transformed value

    representants = representants.map(c => {return {c:c, f: tuning.coord_to_freq(c.aa, c.bb)}});
    representants.sort((a,b) => a.f - b.f);
    
    let nodes:any[] = [];
    let index_of_zero = representants.findIndex(r => r.c.aa==0 && r.c.bb==0);
    for (let midi=0; midi<128; midi++){
        let index = (index_of_zero + midi - midi_offset + 128*representants.length) % representants.length;
        let octave = Math.floor((index_of_zero + midi - midi_offset)/representants.length);
        let c = representants[index].c;
        let n = {
            aa: c.aa + octave * s.a,
            bb: c.bb + octave * s.b
        }
        nodes.push({c:n, f:tuning.coord_to_freq(n.aa, n.bb), midi:midi});
    }
    return nodes;

}