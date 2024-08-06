
export class ConsistentTuning {
    da: number;
    sa: number;
    fa: number;
    db: number;
    sb: number;
    fb: number;
    za_s: number;
    za_d: number;
    zb_s: number;
    zb_d: number;
    constructor(Da: number, Sa: number, Fa: number, Db: number, Sb: number, Fb: number) {
        this.da = Da;
        this.sa = Sa;
        this.fa = Fa;
        this.db = Db;
        this.sb = Sb;
        this.fb = Fb;
        const det = Da * Sb - Db * Sa;
        this.za_s = -Db / det;
        this.za_d = Sb / det;
        this.zb_s = Da / det;
        this.zb_d = -Sa / det;
    }
    setup(Da: number, Sa: number, Fa: number, Db: number, Sb: number, Fb: number) {
        this.da = Da;
        this.sa = Sa;
        this.fa = Fa;
        this.db = Db;
        this.sb = Sb;
        this.fb = Fb;
        const det = Da * Sb - Db * Sa;
        this.za_s = -Db / det;
        this.za_d = Sb / det;
        this.zb_s = Da / det;
        this.zb_d = -Sa / det;
    }
    coord_to_freq(d: number, s: number): number {
        let za = this.za_s * s + this.za_d * d;
        let zb = this.zb_s * s + this.zb_d * d;
        let f = Math.pow(this.fa, za) * Math.pow(this.fb, zb);
        return f;
    }
    freq_to_coord(f: number): number[] {
        let Us = this.za_s * Math.log(this.fa) + this.zb_s * Math.log(this.fb);
        let s = Math.log(f) / Us;
        return [0, s];
    }
    direction_of_enharmonic_equivalence(){
        let Us = this.za_s * Math.log(this.fa) + this.zb_s * Math.log(this.fb);
        let Ud = this.za_d * Math.log(this.fa) + this.zb_d * Math.log(this.fb);
        let U = Math.atan2(Us, -Ud);
        return U;
    }


}

const halfsteps_major = [2,2,1,2,2,2,1]

export function coord_to_interval(d: number, s: number){
    // 0,0 -> 'P1'
    // 4,7 -> 'P5'
    // 7,12 -> 'P8'
   
    let decl = ''
    let sign = d<0 ? -1 : 1
    d = d*sign
    s = s*sign
    let dia =(d+1).toString() 
    let dia_s = 0
    for (let i=0; i<d; i++){
        dia_s += halfsteps_major[i%7]
    }
    if ([0,3,4].includes(d%7)) {
        decl = s - dia_s === 0 ? 'P' : (s - dia_s > 0 ? 'A'.repeat(s - dia_s) : 'd'.repeat(dia_s - s))
    }else{
        decl = s - dia_s === 0 ? 'M' : (s - dia_s === -1 ? 'm' : (s - dia_s > 0 ? 'A'.repeat(s - dia_s) : 'd'.repeat(dia_s - s - 1)))
    }
    return (sign==-1?'-':'') + decl + dia
}

export function interval_to_coord(interval: string){
    // 'P1' -> [0,0]
    // 'P5' -> [4,7]
    // 'P8' -> [7,12]
    let sign = interval[0] === '-' ? -1 : 1
    let decl = sign == -1 ? interval.slice(1) : interval

    // AA12 -> 12
    let d = parseInt(decl.match(/\d+/)[0])
    d = d>0 ? d-1 : d
    let s = 0
    for (let i=0; i<d; i++){
        s += halfsteps_major[i%7]
    }
    if (1) {
        if (decl[0] === 'm'){
            s -= 1
        }else if (decl[0] === 'A'){
            // for each A, add 1 (i.e. AAA23 -> +3)
            s += decl.match(/A+/g)[0].length
        }else if (decl[0] === 'd'){
            s -= decl.match(/d+/g)[0].length + ([0,3,4].includes(d%7) ? 0 : 1)
        }
    }
    return [sign*d, sign*s]
}

export function note_to_coord_C4_eq_00(note: string){
    // under the assumption that C4 is 0,0 calculate the coordinates of a given note
    // 'C4' -> [0,0]
    // 'Gbb4' -> [4,5]
    
    let diatonic = note.slice(0,1)
    let accidental = (note.match(/#+/g) || []).length - (note.match(/b+/g) || []).length
    let octave_shift = parseInt(note.slice(-1)) - 4
    let d = ['C','D','E','F','G','A','B'].indexOf(diatonic)
    let s = 0
    for (let i=0; i<d; i++){
        s += halfsteps_major[i%7]
    }
    s += accidental
    d += octave_shift*7
    s += octave_shift*12

    return [d,s]
}