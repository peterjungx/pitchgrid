/*

Send MIDI messages to a MIDI output device when keys are pressed on the keyboard.

*/

let piano_kbd_2_midi = new Map();
[['z',48], ['s',49], ['x',50], ['d',51], ['c',52], ['v',53], ['g',54], ['b',55], ['h',56], ['n',57], ['j',58], ['m',59], [',',60], ['l',61], ['.',62], [';',63], ['/',64], ['q',60], ['2',61], ['w',62], ['3',63], ['e',64], ['r',65], ['5',66], ['t',67], ['6',68], ['y',69], ['7',70], ['u',71], ['i',72], ['9',73], ['o',74], ['0',75], ['p',76], ['[',77], ['=',78], [']',79]].forEach(([k,v]) => {
    piano_kbd_2_midi.set(k, v)
})

export class KeyboardPiano {
    callback = (note: number, velocity: number) => {
        console.log(note, velocity);
    };
    playingNotes = new Set();

    constructor(callback: (note: number, velocity: number) => void){
        this.callback = callback;
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }
    onKeyDown(event: KeyboardEvent) {
        let key = event.key.toLowerCase();
        if (piano_kbd_2_midi.has(key)) {
            let note = piano_kbd_2_midi.get(key);
            if (this.playingNotes.has(note)) {
                return;
            }
            this.playingNotes.add(note);
            this.callback(note, 100);
        }
    }
    onKeyUp(event: KeyboardEvent) {
        let key = event.key.toLowerCase();
        if (piano_kbd_2_midi.has(key)) {
            let note = piano_kbd_2_midi.get(key);
            if (!this.playingNotes.has(note)) {
                return;
            }
            this.callback(note, 0);
            this.playingNotes.delete(note);
        }
    }
}
