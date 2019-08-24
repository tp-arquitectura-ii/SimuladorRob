import { Dispatch } from './Dispatch';
import { Instruction } from './Instruction';


export class Processor{
    dispatcher:Dispatch
    contadorCiclos = 0;
    listInstrucciones: Array<Instruction>;
    constructor(instrucciones:Array<Instruction>,numOrden){
        this.listInstrucciones = instrucciones.slice(0);
        this.dispatcher = new Dispatch(numOrden);
    }

    public siguienteCiclo(){
        for(let i = 0; i < this.dispatcher.getGrado(); i++){
            this.dispatcher.addInstruction(this.listInstrucciones.shift())
        }
        this.addRow();
        this.contadorCiclos++;
    }
    //MODIFICAR
    addRow() {
        
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(""+this.contadorCiclos));
        tr.appendChild(td);
        document.getElementById("tablaCiclo").appendChild(tr);
        
        let tr1 = document.createElement("tr");
        
        for(let i = 0; i <this.dispatcher.getGrado();i++){
            let td1 = document.createElement("td");
            td1.appendChild(document.createTextNode(this.dispatcher.getInstruc().getId()))
            tr1.appendChild(td1);
        }
        document.getElementById("tablaDispatch").appendChild(tr1);
        
    }



    
}