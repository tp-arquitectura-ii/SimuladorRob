import { Instruction } from './Instruction';

export class ReserveStation{
     instructions = new Array<Instruction>();
    private numReserveStation: number;

    constructor(numReserveStation){
        this.numReserveStation=numReserveStation;
    }

    isEmpty(){
        if (this.instructions.length == 0)
            return true; 
        else 
            return false;
    }
    
    isBusy(){
        if (this.instructions.length == this.numReserveStation)
            return true 
        else
            return false;
    }

    addInstruction(i:Instruction){
        this.instructions.push(i);
    }

    getInstruc(){
        return this.instructions.shift();
    }

    public getnumReserveStation(): number {
        return this.numReserveStation;
    }
    public setnumReserveStation(value: number) {
        this.numReserveStation = value;
    }
}