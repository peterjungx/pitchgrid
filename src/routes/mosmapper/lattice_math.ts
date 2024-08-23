import { index_of } from '$lib//util';

export function angle(v1_x:number, v1_y:number, v2_x:number, v2_y:number):number {
    return Math.acos( (v1_x*v2_x + v1_y*v2_y) / Math.sqrt(v1_x**2+v1_y**2) / Math.sqrt(v2_x**2+v2_y**2) ) * 180 / Math.PI;
}

export type system = {
    a:number;
    b:number;
}
type nodecoord ={
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
export type node = {
    c:nodecoord;
    c_orig?:nodecoord;
    p:nodepos;
    col:string;
    text:string;
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

function node_pos(c:nodecoord, s:system, scale:number):nodepos{
    return {
        x:-s.a*scale/2+c.aa*scale, 
        y:s.b*scale/2-c.bb*scale
    };
}
export function node_at_coord(c:nodecoord, s:system, scale:number, col:string):node{
    return {c:c, 
        p:node_pos(c, s, scale), 
        col:col, 
        text:''};
}
export function edge_at_coords(c1:nodecoord, c2:nodecoord, s:system, scale:number, col:string):edge{
    return {c1:c1, c2:c2, 
        p1:node_pos(c1, s, scale), 
        p2:node_pos(c2, s, scale), 
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
    col:string
):rect{
    return {
        c1:c1, c2:c2, c3:c3, c4:c4, 
        p1:node_pos(c1, s, scale), 
        p2:node_pos(c2, s, scale), 
        p3:node_pos(c3, s, scale), 
        p4:node_pos(c4, s, scale),
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

export function apply_lattice_transform(elems:node[]|edge[]|rect[], from:system, to:system, scale:number, dual:boolean=false){
    let transform_sequence = get_transform_sequence(from, to, dual);
    for (let e of elems){
        if ('c' in e){
            if (!e.c_orig){
                e.c_orig = e.c;
            }
            e.c = apply_transform(e.c, transform_sequence);
            e.p = node_pos(e.c, to, scale);
        }else if ('c3' in e){
            e.c1 = apply_transform(e.c1, transform_sequence);
            e.c2 = apply_transform(e.c2, transform_sequence);
            e.c3 = apply_transform(e.c3, transform_sequence);
            e.c4 = apply_transform(e.c4, transform_sequence);
            e.p1 = node_pos(e.c1, to, scale);
            e.p2 = node_pos(e.c2, to, scale);
            e.p3 = node_pos(e.c3, to, scale);
            e.p4 = node_pos(e.c4, to, scale);
        }else {
            e.c1 = apply_transform(e.c1, transform_sequence);
            e.c2 = apply_transform(e.c2, transform_sequence);
            e.p1 = node_pos(e.c1, to, scale);
            e.p2 = node_pos(e.c2, to, scale);
        }
    }
}


export function prepare_default_lattice(s:system, edge_length:number, lattice_basecolor:string, lattice_rectcolor:string){
    let nodes:node[] = [];
    let edges:edge[] = [];
    let rects:rect[] = [];

    // nodes
    for (let aa = 0; aa <= s.a; aa++) {
        for (let bb = 0; bb <= s.b; bb++) {
            nodes.push(node_at_coord({aa,bb}, s, edge_length, lattice_basecolor));
        }
    }

    // edges
    for (let aa = 0; aa <= s.a; aa++) {
        for (let bb = 0; bb <= s.b; bb++) {
            if (aa < s.a) {
                edges.push(edge_at_coords({aa:aa,bb:bb}, {aa:aa+1,bb:bb}, s, edge_length, lattice_basecolor));
            }
            if (bb < s.b) {
                edges.push(edge_at_coords({aa:aa,bb:bb}, {aa:aa,bb:bb+1}, s, edge_length, lattice_basecolor));
            }
        }
    }

    // rects
    let aa = 0;
    for (let bb = 0; bb < s.b; bb++) {
        while ((aa+1)*s.b/s.a<bb+1){
            rects.push(rect_at_coords({aa,bb}, {aa:aa+1,bb}, {aa:aa+1,bb:bb+1}, {aa,bb:bb+1}, s, edge_length, lattice_rectcolor));
            aa++;
        }
        rects.push(rect_at_coords({aa,bb}, {aa:aa+1,bb}, {aa:aa+1,bb:bb+1}, {aa,bb:bb+1}, s, edge_length, lattice_rectcolor));
    }

    return {nodes, edges, rects};
}


export function calc_scale(s:system, mode:number):nodecoord[]{
    let scale:nodecoord[] = [{aa:0,bb:0}];
    let note = 1;
    let aa = 0;
    for (let bb = 0; bb < s.b; bb++) {
        while ((aa+1)*s.b/s.a<bb+1){
            scale.push({aa:aa+1,bb});
            aa++;
            note++;
        }
        scale.push({aa:aa+1,bb});
        note++;
    }
    scale.push({aa:s.a,bb:s.b});

    if (mode > s.a+s.b-1){
        mode = s.a+s.b-1;
    }
    for (let acc=0; acc<mode; acc++){
        // find note farthest from b/a line
        let max_dist = 0;
        let max_note = 0;
        for (let i=1; i<scale.length; i++){
            let note = scale[i];
            let dist = note.aa*s.b - note.bb*s.a;
            if (dist>max_dist){
                max_dist = dist;
                max_note = i;
            }
        }
        let note = scale[max_note];
        note.aa = note.aa-1;
        note.bb = note.bb+1;
    }
    return scale;
}

export function prepare_scale(scale:nodecoord[], s:system, edge_length:number, color:string, labels:string[]|undefined){
    let nodes:node[] = [];
    let edges:edge[] = [];

    nodes = scale.map((c:nodecoord, i:number) => {
        let label = labels ? labels[i] : `${i%(s.a+s.b)+1}`;
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