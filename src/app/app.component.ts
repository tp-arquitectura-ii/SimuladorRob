import { Component, OnInit } from '@angular/core';
import { identifierModuleUrl } from '@angular/compiler';
import { Instruccion } from './Instruccion';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  
  title = 'SimuladorRob';

  listInstrucciones = new Array<Instruccion>();

  tipoInstrucciones = [{ type: "ADD", ciclo: 1},
                        {type: "SUB", ciclo: 1},
                        {type:"MUL", ciclo:1},
                        {type:"DIV", ciclo:1},
                        {type:"ST", ciclo:1},
                        {type:"LD",ciclo: 1}];

  nombreRegistro:string[] = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10"];
  numOrden = 1;
  numEstacionReserva = 1;
  numMultifuncion =0;
  numAritmetica = 0;
  numMemoria = 0;
  idInstruccion = 0;
  btnDefaultIns = {
    type: "INSTRUCCION",
    dst: "DST",
    op1: "OP1",
    op2: "OP2"
  };

  
  constructor() { }

  ngOnInit() {
    let ins1 = new Instruccion("S1","ADD","R1","R2","R3");
    let ins2 = new Instruccion("S2","ADD","R1","R2","R3");
    this.listInstrucciones.push(ins1);
    this.listInstrucciones.push(ins2);
    this.idInstruccion = this.listInstrucciones.length;
    
  }
  
  cambiar(pos,name){
    this.btnDefaultIns[pos] = name;
    this.actualizarBotones();
  
  }

  actualizarBotones(){

    let btnAgr = document.getElementById("btn-agregar");
    let btnOp2 = document.getElementById("btn-op2");

    if (this.btnDefaultIns.type!="INSTRUCCION" && this.btnDefaultIns.dst!="DST" && this.btnDefaultIns.op1!="OP1" && this.btnDefaultIns.op2!="OP2"){
      btnAgr.removeAttribute("disabled");
    }
    if (this.btnDefaultIns.type=="ST" || this.btnDefaultIns.type == "LD"){
      btnOp2.setAttribute("disabled","");
      if (this.btnDefaultIns.dst!="DST" && this.btnDefaultIns.op1!="OP1")
        btnAgr.removeAttribute("disabled");    
    }
    else
        btnOp2.removeAttribute("disabled");  
  }

  agregarInstruccion(){ 
    this.idInstruccion++
    let instNueva = new Instruccion("S" +this.idInstruccion,this.btnDefaultIns.type,this.btnDefaultIns.dst,this.btnDefaultIns.op1,this.btnDefaultIns.op2);
    this.listInstrucciones.push(instNueva);

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
  
  cambiarER(num){
    this.numEstacionReserva=num;
  }

  cambiarUF(num){
    this.numMultifuncion = num;
  }

  cambiarAri(num){
    this.numAritmetica = num;
  }
  cambiarMem(num){
    this.numMemoria= num;
  }

  eliminarInstruccion(inst:Instruccion){
    let i = this.listInstrucciones.indexOf(inst);
    this.listInstrucciones.splice(i,1);
  }
}
