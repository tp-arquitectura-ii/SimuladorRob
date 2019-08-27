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
        this.rob = new BufferReorder(robSize);

    }
    public addUF(numArithmetic,numMemory,numMultifunction){
        //set Functional Units
        for( let i=0; i<numArithmetic; i++)
            this.uf.push(new FunctionalUnit("ARITH"));
        for( let i=0; i<numMemory; i++)
            this.uf.push(new FunctionalUnit("MEM"));
        for( let i=0; i<numMultifunction; i++)
            this.uf.push(new FunctionalUnit("MULTIFUNCT"));
    }

    private getUF(type:String){
        //CHEKEARR, NO ESTA BIEN ASI. SI NO ENCUENTRA EL TIPO DE LA INSTRUCCINO, VERIFICAR LA MULTIFUNCION
        let i=0;
        while( i<this.uf.length && this.uf[i].getType() !=type )
            i++;
        if ( i < this.uf.length )
            return this.uf.slice(i,i);
        else
             return this.uf.slice(i,i); //ACA HABRIA QUE CHEQUEAR SI HAY UNA MULTIFUNCION 
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
            //AGREGO INSTRUCCIONES A LA ER Y ROB
            let sizeDispatch = this.dispatcher.getSize();
            for(let i = 0; i < sizeDispatch;i++){//MIRAR ESTO PORQUE SI SE LO RETIRA DE LA LISTA DECREMENTA EL GETSIZE
                if (!this.er.isBusy() && !this.rob.isBusy()){
                    let inst = this.dispatcher.getInstruc();
                    inst.setStatus("I");
                    this.er.addInstruction(inst);
                    this.rob.addInstruc(inst);
                }
            }

            //
            for(let i = 0 ; i<this.uf.length; i++){              
                if(this.uf[i].getInstruc()!=null){
                    if(this.uf[i].getInstruc().getCycle()==0){
                        this.uf[i].getInstruc().setStatus("F");
                        this.uf[i].removeInstruction();
                        this.uf[i].setBusy(false);
                    }
                }
            }
            // EJECUTO S1 SIEMPRE
            if(this.cycleCounter == 1){
                let inst = this.er.getInstruc();
                inst.setStatus("X");
                this.uf[0].addInstruc(inst);                
                this.uf[0].getInstruc().decrementCycle();
                this.uf[0].setBusy(true);
            }

            //AGREGO A UF
            let sizeER = this.er.instructions.length
            for(let i = 0; i < this.er.instructions.length; i++){  //mirar este for
                let index = this.getUFFree();
                if (index != -1){
                    let inst = this.er.instructions[i];
                    console.log("instruccion agarrada" + inst.getId());
                    if (!this.hayDependecies(inst)){
                        console.log("no hay dependecia");
                        this.uf[index].addInstruc(inst);
                        inst.setStatus("X");
                        this.uf[index].getInstruc().decrementCycle();
                        this.uf[index].setBusy(true);
                        this.er.getInstruc();                      
                    }
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

    hayDependecies(inst: Instruction) {
        for(let i = 0; i < this.uf.length;i++){
            console.log(this.uf[i].getInstruc());
            if(this.uf[i].getInstruc()!=null){
                if(this.uf[i].getInstruc().existDependency(inst))
                    return true;
            }
        }
        return false;
    }
    private getUFFree() {    
       for(let i = 0; i< this.uf.length;i++){
           if(!this.uf[i].isBusy())
            return i;
       }
       return -1;
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
            if (i<inst.length){
                td.appendChild(document.createTextNode(inst[i].getId()))
                td1.appendChild(document.createTextNode(inst[i].getStatus()));
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