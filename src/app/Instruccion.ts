import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class Instruccion {

    listInstrucciones = [
      {id: 1, tipo: "ADD", destino: "R2", op1: "R2",op2: "R2"},
      {id: 2, tipo: "ADD", destino: "R1", op1: "R2",op2: "R2"},
      {id: 3, tipo: "SUB", destino: "R3", op1: "R2",op2: "R2"},
      {id: 4, tipo: "MULD", destino: "R4", op1: "R2",op2: "R2"}
    ];
  
    constructor() { }
  
    public getInstrucciones():Array<{id, tipo, destino, op1 , op2}>{
      return this.listInstrucciones;
    }
    public crearInstrucciones(inst: {id, tipo, destino, op1,op2 }){
      this.listInstrucciones.push(inst);
    }
    public eliminarInstruccion(i){
      this.listInstrucciones.splice(i,1);
    }
  }