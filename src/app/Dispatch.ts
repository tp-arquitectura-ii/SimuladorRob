import { Instruccion } from './Instruccion';

export class Dispatch {
    instrucciones = new Array<Instruccion>();
    grado=0;

    constructor(grado){
        this.grado=grado;
    }

    EstaVacio(){
        if (this.instrucciones.length == this.grado)
            return true 
        else 
            return false;
    }
    HayLugar(){
        if (this.instrucciones.length == this.grado)
            return false 
        else
            return true;
    }

    addInstruction(i:Instruccion){
        this.instrucciones.push(i);
    }

    getInstruc(){
        return this.instrucciones.shift();
    }
    getGrado(){
        return this.grado;
    }
}