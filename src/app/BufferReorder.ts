import { Instruction } from './Instruction';
import { RobColum } from './RobColum';

export class BufferReorder{
    instruction = new Array<Instruction>();
    private size:number;
    private numGrade: number;
    private robC = new Array<RobColum>();
    private instComplete = new Array<Instruction> ();

  constructor(size,numGrade){
      this.size= size;
      this.numGrade = numGrade;
      for(let i = 0; i < size; i++)
            this.robC.push(new RobColum);

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

  public getSize(){
      return this.size;
  }

  public removeInstCompletes(){
    let i = 0;
    while (i<this.instruction.length)
        if (this.instruction[i].getStatus() == "F")
            this.instruction.splice(i,1);
        else
            i++;         
  }

}