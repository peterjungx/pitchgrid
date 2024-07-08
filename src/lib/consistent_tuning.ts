
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