import { Instruction } from './Instruction';

export class Dispatch {
    private instruction = new Array<Instruction>();
    private grade=0;

    constructor(grade){
        this.grade=grade;
    }

    getSize(){
        return this.instruction.length;
    }

    isEmpty(){
        if (this.instruction.length == 0)
            return true; 
        else 
            return false;
    }
    isBusy(){
        if (this.instruction.length == this.grade)
            return true 
        else
            return false;
    }

    addInstruction(i:Instruction){
        this.instruction.push(i);
    }

    getInstruc(){
        return this.instruction.shift();
    }
    getGrade(){
        return this.grade;
    }
}