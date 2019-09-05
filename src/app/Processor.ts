import { Dispatch } from './Dispatch';
import { Instruction } from './Instruction';
import { FunctionalUnit } from './FunctionalUnit';
import { ReserveStation } from './ReserveStation';
import { BufferReorder } from './BufferReorder';



export class Processor{
    private dispatcher:Dispatch
    private uf: Array<FunctionalUnit>;
    private er: ReserveStation;
    private rob: BufferReorder;
    private cycleCounter = 0;
    private listInstruction: Array<Instruction>;
    
    constructor(instrucciones:Array<Instruction>,numOrden,numReserveStation,robSize){
        this.listInstruction = instrucciones.slice(0);
        this.dispatcher = new Dispatch(numOrden);
        this.er = new ReserveStation(numReserveStation);
        this.uf=new Array<FunctionalUnit>();
        this.rob = new BufferReorder(robSize,numOrden,instrucciones);

    }
    public addUF(numArithmetic,numMemory,numMultifunction){
        for( let i=0; i<numMultifunction; i++)
            this.uf.push(new FunctionalUnit("MULTIFUNCT"));
        for( let i=0; i<numArithmetic; i++)
            this.uf.push(new FunctionalUnit("ARITH"));
        for( let i=0; i<numMemory; i++)
            this.uf.push(new FunctionalUnit("MEM"));
    }

    public nextCycle(){
        if(this.cycleCounter == 0){

            //AGREGO INSTRUCCIONES AL DISPATCH
            for(let i = 0; i < this.dispatcher.getGrade() && this.listInstruction.length != 0 ; i++){
                this.dispatcher.addInstruction(this.listInstruction.shift())
            }
            this.addRowCounter();
            this.addRow(this.dispatcher.instruction,"tablaDispatch",this.dispatcher.getGrade());
            this.addRow(this.er.instructions,"tablaER",this.er.getnumReserveStation());
            this.addRowUF();
            this.addRowROB(this.rob.instruction,"tablaROB",this.rob.getSize());
            this.cycleCounter++;
        }
        else
        {  

            //RETIRO DEL ROB
            this.rob.removeInstCompletes();
            //AGREGO INSTRUCCIONES A LA ER Y ROB
            let j = 0; 
            while(j < this.dispatcher.getSize()){
                if (!this.er.isBusy() && !this.rob.isBusy()){                   
                    let inst = this.dispatcher.getInstruc();
                    inst.setStatus("I");
                    this.er.addInstruction(inst);
                    this.rob.addInstruction(inst);
                }
                else
                    j++;
            }

            //DECREMENTO INSTRUCCIONES
            for(let i = 0; i<this.uf.length; i++){
                if (this.uf[i].getInstruc()!= null && this.uf[i].getInstruc().getCycle()!=0){
                    this.uf[i].getInstruc().decrementCycle();
                }
            }

            //remuevo instrucciones de la uf
            for(let i = 0 ; i<this.uf.length; i++){              
                if(this.uf[i].getInstruc()!=null){
                    if(this.uf[i].getInstruc().getCycle()==0){
                        this.uf[i].getInstruc().setStatus("F");
                        this.uf[i].removeInstruction();
                        this.uf[i].setBusy(false);
                    }
                }
            }


            //AGREGO A UF
            let i=0;
            while( i < this.er.instructions.length){  
                let index = this.getUFFree(this.er.instructions[i]);
                if (index != -1){
                    let inst = this.er.instructions[i];
                    if (!this.hasDependence(inst) && !this.hasDependeceER(inst)){
                        this.uf[index].addInstruc(inst);
                        inst.setStatus("X");
                        this.uf[index].setBusy(true);
                        this.er.removeInstruction(i);                     
                    }
                    else{
                        i++
                    }
                }else{
                i++;}
            }

            j = 0; 
            while(j < this.dispatcher.getSize()){
                if (!this.er.isBusy() && !this.rob.isBusy()){
                    
                    let inst = this.dispatcher.getInstruc();
                    inst.setStatus("I");
                    this.er.addInstruction(inst);
                    this.rob.addInstruction(inst);
                }
                else
                    j++;
            }

            //AGREGO A er Y ROB SI UNA INSTRUCCION ESTA FINALIZADA
           
            let sizeDispatch2 = this.dispatcher.getSize();
            let listAux = this.rob.getListInstructions();
            for(let i = 0; i < sizeDispatch2;i++){
                   
                    let index = this.rob.hasInstructionCompleted(i,listAux);
                    
                    if (!this.er.isBusy() &&  index != -1){
                        let inst = this.dispatcher.getInstruc();
                        listAux.shift()
                        inst.setStatus("I");
                        this.er.addInstruction(inst);
                        this.rob.getRobC()[index].addInstruction2(inst);
                    }
                }
              
            //actualizo dispatch
            for(let i = 0; i < this.dispatcher.getGrade() && this.listInstruction.length != 0 && !this.dispatcher.isBusy(); i++){
                this.dispatcher.addInstruction(this.listInstruction.shift());
            }
            
            this.addRowCounter();
            this.addRow(this.dispatcher.instruction,"tablaDispatch",this.dispatcher.getGrade());
            this.addRow(this.er.instructions,"tablaER",this.er.getnumReserveStation());
            this.addRowUF();
            this.addRowROB(this.rob.instruction,"tablaROB",this.rob.getSize());
            this.cycleCounter++;
        }
    }


    hasDependeceER(inst: Instruction) {
        for(let i = 0; i < this.er.instructions.length;i++){
            if(this.er.instructions[i].getId() != inst.getId())
                if(this.er.instructions[i].existDependency(inst))
                    return true;
        }
        return false;
    }

    hasDependence(inst: Instruction) {
        for(let i = 0; i < this.uf.length;i++){
            if(this.uf[i].getInstruc()!=null){
                if(this.uf[i].getInstruc().existDependency(inst))
                    return true;
            }
        }
        return false;
    }
    private getUFFree(inst:Instruction) {    
       for(let i = 0; i< this.uf.length;i++){
            if(!this.uf[i].isBusy() && this.uf[i].getType() == inst.getUFType())
                return i;
            else
                if ((!this.uf[i].isBusy() && this.uf[i].getType() == "MULTIFUNCT"))
                    return i;
       }
       return -1;
    }

    public isFinished(){
        return this.rob.isComplete();
    }





    
    addRow(inst:Array<Instruction>, id:string, cantidad:Number ){
        let tr = document.createElement("tr");
        for(let i = 0; i < cantidad;i++){
            let td = document.createElement("td");
            if (i<inst.length){
                td.appendChild(document.createTextNode(inst[i].getId()));
                tr.appendChild(td);
            }
            else{
                td.appendChild(document.createTextNode("-"));
                tr.appendChild(td);
            }
        }
        document.getElementById(id).appendChild(tr);
    }

    addRowUF(){
        let tr = document.createElement("tr");
        for(let i = 0; i < this.uf.length;i++){
            let td = document.createElement("td");
            if (this.uf[i].getInstruc()!= null){
                td.appendChild(document.createTextNode(this.uf[i].getInstruc().getId()));
                tr.appendChild(td);
            }
            else
            {
                td.appendChild(document.createTextNode("-"));
                tr.appendChild(td);
            }
            
        }
        document.getElementById("tablaUF").appendChild(tr);
    }
    addRowROB(inst:Array<Instruction>, id:string,cantidad:Number){
        let tr = document.createElement("tr");
        for (let i = 0; i < cantidad; i++){
            let td = document.createElement("td");
            let td1 = document.createElement("td");
            if (this.rob.getRobC()[i].getInstruction()!=null){
                if (this.rob.getRobC()[i].getInstruction2()==null){
                    td.appendChild(document.createTextNode(this.rob.getRobC()[i].getInstruction().getId()))
                    td1.appendChild(document.createTextNode(this.rob.getRobC()[i].getInstruction().getStatus()));  
                }
                else{
                    td.appendChild(document.createTextNode(this.rob.getRobC()[i].getInstruction().getId()+ "/" +this.rob.getRobC()[i].getInstruction2().getId() ))
                    td1.appendChild(document.createTextNode(this.rob.getRobC()[i].getInstruction().getStatus()+"/"+ this.rob.getRobC()[i].getInstruction2().getStatus()));
                }
                tr.appendChild(td);
                tr.appendChild(td1);
            }
            else{
                td.appendChild(document.createTextNode("-"))
                td1.appendChild(document.createTextNode("-"));
                tr.appendChild(td);
                tr.appendChild(td1);
            }
        }
        document.getElementById(id).appendChild(tr);
    }

    addRowCounter() {
    
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(""+this.cycleCounter));
        tr.appendChild(td);
        document.getElementById("tablacycle").appendChild(tr);
    
    }



    
}