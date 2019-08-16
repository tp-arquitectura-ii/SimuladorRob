import { Component, OnInit } from '@angular/core';
import { Instruccion } from '../app/Instruccion';
import { identifierModuleUrl } from '@angular/compiler';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  
  title = 'SimuladorRob';
  instrucciones;
  tipoInstrucciones = [{ type: "ADD", ciclo: 1},
                        {type: "SUB", ciclo: 1},
                        {type:"MUL", ciclo:1},
                        {type:"DIV", ciclo:1},
                        {type:"ST", ciclo:1},
                        {type:"LD",ciclo: 1}];
  nombreRegistro:string[] = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10"];
  numOrden = 1;
  idInstruccion = 0;
  btnDefaultIns = {
    type : "INSTRUCCION",
    dst: "DST",
    op1: "OP1",
    op2: "OP2"
  }; 
 
  
  constructor(public dataInstruccion: Instruccion) { }

  ngOnInit() {
    this.instrucciones = this.dataInstruccion.getInstrucciones();
    this.idInstruccion = this.dataInstruccion.getInstrucciones().length; 
  }
  
  cambiar(pos,name){
    this.btnDefaultIns[pos] = name;
  }

  agregarInstruccion(){ 
    this.idInstruccion++;
    let instruccion:{id,tipo,destino,op1,op2} = {id: this.idInstruccion, tipo: this.btnDefaultIns.type , destino: this.btnDefaultIns.dst, op1:this.btnDefaultIns.op1, op2:this.btnDefaultIns.op2};
    this.dataInstruccion.crearInstrucciones(instruccion);

}
  cambiarOrden(num){
      this.numOrden = num;
  }
  cambiarCiclo(pos,numCiclo){
    for (let tipoIns of this.tipoInstrucciones) {
        if (tipoIns.type == pos )
          tipoIns.ciclo = numCiclo;
    }
  }

}
