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
            for(let i = 0; i < this.dispatcher.getGrade() && this.listInstruction.length != 0 ; i++){
                console.log(this.listInstruction[0].getId()); //borrar
                this.dispatcher.addInstruction(this.listInstruction.shift())
            }
            this.cycleCounter++;
        }
        else
        {   
            let indexUnit,s;
            for(let i = 0; i < this.dispatcher.getSize(); i++){ //recorro instrucc cargadas en el dispatch
                if ( !this.er.isBusy() && !this.rob.isBusy() ){ //si hay lugar en las ER y en el ROB
                    s= this.dispatcher.getInstruc(); //agarro instruc de cola de dispatch
                    indexUnit= this.getUF(s.getUFType()); //obtengo indice de la uf con el tipo de la instruc o sino multifuncion
                    if ( !this.uf[indexUnit].isBusy() ){ // si esta libre y && no hay dependencias con las otras q se ejecutan
                        this.uf[indexUnit].addInstruc(s); //agrego a la uf 
                        this.er.addInstruction(s); //agrego a la er
                        s.setExecuting(true); // instruccion pasa a ejecutando
                        this.rob.addInstruc(s); //agrego al rob 
                        //aca deberia mostrar con el addRow
                    }
                }
            }
        }
    
    }
    //MODIFICAR
    addRow() {
        
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(""+this.cycleCounter));
        tr.appendChild(td);
        document.getElementById("tablacycle").appendChild(tr);
        
        let tr1 = document.createElement("tr");
        
        for(let i = 0; i <this.dispatcher.getGrade() && !(this.dispatcher.isEmpty);i++){
            let td1 = document.createElement("td");
            td1.appendChild(document.createTextNode(this.dispatcher.getInstruc().getId()))
            tr1.appendChild(td1);
        }
        document.getElementById("tablaDispatch").appendChild(tr1);
        
    }



    
}