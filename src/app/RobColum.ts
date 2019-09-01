import { Instruction } from './Instruction';

export class RobColum{
    private instruction: Array<Instruction> //O LISTA DE STRING?

    constructor(){
        this.instruction=new Array<Instruction> ();
    }


    public addInstruction(inst:Instruction ){
        this.instruction.push(inst);
    }

    public isBusy(){
        if (this.instruction.length == 1)
            return true;
        return false
    }
}