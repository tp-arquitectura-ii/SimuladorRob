import { Instruction } from './Instruction';

export class RobColum{
    private inst: Instruction//O LISTA DE STRING?
    private busy: boolean

    constructor(){
        this.inst = null;
        this.busy = false
    }


    public addInstruction(inst:Instruction ){
        this.inst = inst;
    }

    public isBusy(){
        return this.busy;
    }



    public getInstruction(){
        return this.inst;
    }

}