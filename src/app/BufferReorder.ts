import { Instruction } from './Instruction';

export class BufferReorder{
    private instruction = new Array<Instruction>();
    private size;

  constructor(size){
      this.size= size;
  }

  public isBusy(){
    if (this.instruction.length == this.size)
        return true;
    else 
        return false;
  }
  
  public addInstruc(i:Instruction){
      this.instruction.push(i);
  }
}