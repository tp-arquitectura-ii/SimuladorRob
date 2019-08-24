import { Instruction } from './Instruction';

export class Dispatch {
    instruction = new Array<Instruction>();
    grado=0;

    constructor(grado){
        this.grado=grado;
    }

    isEmpty(){
        if (this.instruction.length == this.grado)
            return true 
        else 
            return false;
    }
    HayLugar(){
        if (this.instruction.length == this.grado)
            return false 
        else
            return true;
    }

    addInstruction(i:Instruction){
        this.instruction.push(i);
    }

    getInstruc(){
        return this.instruction.shift();
    }
    getGrado(){
        return this.grado;
    }
}