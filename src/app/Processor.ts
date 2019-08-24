import { Dispatch } from './Dispatch';
import { Instruction } from './Instruction';
import { FunctionalUnit } from './FunctionalUnit';
import { ReserveStation } from './ReserveStation';
import { BufferReorder } from './BufferReorder';


export class Processor{
    dispatcher:Dispatch
    uf: Array<FunctionalUnit>;
    er: ReserveStation;
    rob: BufferReorder;
    
    cycleCounter = 0;
    listInstruction: Array<Instruction>;
    constructor(instrucciones:Array<Instruction>,numOrden){
        this.listInstruction = instrucciones.slice(0);
        this.dispatcher = new Dispatch(numOrden);
    }

    public siguienteCiclo(){
        if(this.cycleCounter == 0){
            for(let i = 0; i < this.dispatcher.getGrado() && this.listInstruction.length != 0 ; i++){
                console.log(this.listInstruction[0].getId());
                this.dispatcher.addInstruction(this.listInstruction.shift())
            }
            this.cycleCounter++;
        }
        else
        {}
        
        
       
        
    }
    //MODIFICAR
    addRow() {
        
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(""+this.cycleCounter));
        tr.appendChild(td);
        document.getElementById("tablacycle").appendChild(tr);
        
        let tr1 = document.createElement("tr");
        
        for(let i = 0; i <this.dispatcher.getGrado() && !(this.dispatcher.isEmpty);i++){
            let td1 = document.createElement("td");
            td1.appendChild(document.createTextNode(this.dispatcher.getInstruc().getId()))
            tr1.appendChild(td1);
        }
        document.getElementById("tablaDispatch").appendChild(tr1);
        
    }



    
}