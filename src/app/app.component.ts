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
    let ins1 = new Instruccion("S1","ADD","R3","R0","R5");
    let ins2 = new Instruccion("S2","MUL","R2","R2","R5");
    let ins3 = new Instruccion("S3","DIV","R1","R5","R0");
    let ins4 = new Instruccion("S4","ST","R3","R1","");
    let ins5 = new Instruccion("S5","SUB","R6","R3","R2");
    let ins6 = new Instruccion("S6","LD","R9","R6","");
    let ins7 = new Instruccion("S7","SUB","R2","R6","R3");
    let ins8 = new Instruccion("S8","SUB","R10","R3","R1");


    this.listInstrucciones.push(ins1);
    this.listInstrucciones.push(ins2);
    this.listInstrucciones.push(ins3);
    this.listInstrucciones.push(ins4);
    this.listInstrucciones.push(ins5);
    this.listInstrucciones.push(ins6);
    this.listInstrucciones.push(ins7);
    this.listInstrucciones.push(ins8)


    this.idInstruccion = this.listInstrucciones.length;
    
  }
  
  cambiar(pos,name){
    this.btnDefaultIns[pos] = name;
    this.actualizarBotones();
    this.getDependenciasRAW();
    this.imprimirDependecias();
    
  }
  imprimirDependecias() {
    for (let index = 0; index < this.listInstrucciones.length; index++) {
      console.log(this.listInstrucciones[index].id + ":" )
      for (let j = 0; j < this.listInstrucciones[index].dependecias.length; j++) {
        console.log(this.listInstrucciones[index].dependecias[j])
        
      }
      
    }
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
    let instNueva;
    if (this.btnDefaultIns.type=="ST" || this.btnDefaultIns.type == "LD")
      instNueva = new Instruccion("S" +this.idInstruccion,this.btnDefaultIns.type,this.btnDefaultIns.dst,this.btnDefaultIns.op1,"");
    else  
      instNueva = new Instruccion("S" +this.idInstruccion,this.btnDefaultIns.type,this.btnDefaultIns.dst,this.btnDefaultIns.op1,this.btnDefaultIns.op2);  
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

  getDependenciasRAW(){
    let encontro = false;
    for (let i = 0; i < this.listInstrucciones.length -1; i++) {
      if(this.listInstrucciones[i].tipo!="ST")
       for (let j = i+1; j < this.listInstrucciones.length && !encontro; j++) {
         if(this.listInstrucciones[j].tipo!="ST"){
            if (this.listInstrucciones[i].destino == this.listInstrucciones[j].op1 || this.listInstrucciones[i].destino == this.listInstrucciones[j].op2 )  
              this.listInstrucciones[i].agregarDependecias(this.listInstrucciones[j].id);
            
            if(this.listInstrucciones[i].destino == this.listInstrucciones[j].destino){
              encontro=true;
            }
         }
          else{
            if(this.listInstrucciones[i].destino == this.listInstrucciones[j].destino || this.listInstrucciones[i].destino==this.listInstrucciones[j].op1)            
              this.listInstrucciones[i].agregarDependecias(this.listInstrucciones[j].id); 
            
          }
      }
      encontro = false;
    }
  }

}
