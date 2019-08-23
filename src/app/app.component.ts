import { Component, OnInit } from '@angular/core';
import { identifierModuleUrl } from '@angular/compiler';
import { Instruccion } from './Instruccion';
import { Dispatch } from './Dispatch';
import { Procesador } from './Procesador';


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

  cpu:Procesador
  
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
    document.getElementById("tablaCiclo").style.visibility = "hidden";

  }
  
  cambiar(pos,name){
    this.btnDefaultIns[pos] = name;
    this.actualizarBotones();
    this.getDependenciasRAW();
    this.imprimirDependencias();
    
  }
  imprimirDependencias() {
    for (let index = 0; index < this.listInstrucciones.length; index++) {
      console.log(this.listInstrucciones[index].id + ":" )
      for (let j = 0; j < this.listInstrucciones[index].dependencias.length; j++) {
        console.log(this.listInstrucciones[index].dependencias[j])
        
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

  cambiarUFmultifuncion(num){
    this.numMultifuncion = num;
  }

  cambiarUFAritmetica(num){
    this.numAritmetica = num;
  }
  cambiarUFMemoria(num){
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
              this.listInstrucciones[i].agregarDependencias(this.listInstrucciones[j].id);
            
            if(this.listInstrucciones[i].destino == this.listInstrucciones[j].destino){
              encontro=true;
            }
         }
          else{
            if(this.listInstrucciones[i].destino == this.listInstrucciones[j].destino || this.listInstrucciones[i].destino==this.listInstrucciones[j].op1)            
              this.listInstrucciones[i].agregarDependencias(this.listInstrucciones[j].id); 
            
          }
      }
      encontro = false;
    }
  }

  resetConfiguracion(){
    document.getElementById("btn-siguiente").setAttribute("hidden","");
    document.getElementById("btn-reset").setAttribute("disabled","");
    document.getElementById("btn-ejecutar").setAttribute("disabled","");
    document.getElementById("btn-guardar").removeAttribute("disabled");
    document.getElementById("btn-numMemoria").removeAttribute("disabled");
    document.getElementById("btn-numAritmetica").removeAttribute("disabled");
    document.getElementById("btn-numMultifuncion").removeAttribute("disabled");
    document.getElementById("btn-Inst-LD").removeAttribute("disabled");
    document.getElementById("btn-Inst-ST").removeAttribute("disabled");
    document.getElementById("btn-Inst-ADD").removeAttribute("disabled");
    document.getElementById("btn-Inst-MUL").removeAttribute("disabled");
    document.getElementById("btn-Inst-DIV").removeAttribute("disabled");
    document.getElementById("btn-Inst-SUB").removeAttribute("disabled");
    document.getElementById("btn-op1").removeAttribute("disabled");
    document.getElementById("btn-op2").removeAttribute("disabled");
    document.getElementById("btn-type").removeAttribute("disabled");
    document.getElementById("btn-dst").removeAttribute("disabled");
    document.getElementById("btn-Agregar").removeAttribute("disabled");
    document.getElementById("btn-GradoDispatch").removeAttribute("disabled");
    document.getElementById("btn-CantidadER").removeAttribute("disabled");
    document.getElementById("tablaCiclo").style.visibility = "hidden";
    document.getElementById("tablaDispatch").style.visibility = "hidden";
    document.getElementById("tablaER").style.visibility = "hidden";
    document.getElementById("tablaUF").style.visibility = "hidden";
    document.getElementById("tablaROB").style.visibility = "hidden";
  }

  guardarConfiguracion(){
    document.getElementById("btn-reset").removeAttribute("disabled");
    document.getElementById("btn-ejecutar").removeAttribute("disabled");
    document.getElementById("btn-guardar").setAttribute("disabled","");
    document.getElementById("btn-numMemoria").setAttribute("disabled","");
    document.getElementById("btn-numAritmetica").setAttribute("disabled","");
    document.getElementById("btn-numMultifuncion").setAttribute("disabled","");
    document.getElementById("btn-Inst-LD").setAttribute("disabled","");
    document.getElementById("btn-Inst-ST").setAttribute("disabled","");
    document.getElementById("btn-Inst-ADD").setAttribute("disabled","");
    document.getElementById("btn-Inst-MUL").setAttribute("disabled","");
    document.getElementById("btn-Inst-DIV").setAttribute("disabled","");
    document.getElementById("btn-Inst-SUB").setAttribute("disabled","");
    document.getElementById("btn-op1").setAttribute("disabled","");
    document.getElementById("btn-op2").setAttribute("disabled","");
    document.getElementById("btn-type").setAttribute("disabled","");
    document.getElementById("btn-dst").setAttribute("disabled","");
    document.getElementById("btn-Agregar").setAttribute("disabled","");
    document.getElementById("btn-GradoDispatch").setAttribute("disabled","");
    document.getElementById("btn-CantidadER").setAttribute("disabled","");
  }

  private crearTablaROB(){
    //Inicializa la tabla del ROB
    let tablaROB = document.getElementById("tablaROB");
    let tr = document.createElement("tr");
    let th,I,S,th1;

    //era + o * ? MODIFICAR
    let tamROB = this.numEstacionReserva* (this.numMultifuncion+this.numAritmetica +this.numAritmetica);
    for (let i = 0; i < tamROB; i++) {
       th = document.createElement("th");
       I = document.createTextNode("I");
       th1 = document.createElement("th1");
       S = document.createTextNode("S");
      th.appendChild(I);
      th1.appendChild(S);
      tr.appendChild(th);
      tr.appendChild(th1);

    }
    tablaROB.appendChild(tr);
  }

  private crearTabla(desc:string,num, tabla:string){
    let tr = document.createElement("tr");
    let th,d;
    for (let i = 0; i < num; i++) {
      th = document.createElement("th");
      d = document.createTextNode(desc + i);
      th.appendChild(d);
      tr.appendChild(th);
    }
    document.getElementById(tabla).appendChild(tr);
  }
  
  ejecutarRob(){
    document.getElementById("btn-siguiente").removeAttribute("hidden");
    document.getElementById("tablaCiclo").style.visibility = "visible";
    document.getElementById("tablaDispatch").style.visibility = "visible";
    document.getElementById("tablaER").style.visibility = "visible";
    document.getElementById("tablaUF").style.visibility = "visible";
    document.getElementById("tablaROB").style.visibility = "visible";
    document.getElementById("btn-ejecutar").setAttribute("disabled","");
    this.crearTabla("ER",this.numEstacionReserva,"tablaER");
    this.crearTabla("D",this.numOrden,"tablaDispatch");
    this.crearTabla("UF",this.numAritmetica+this.numMemoria+this.numMultifuncion,"tablaUF");
    this.crearTablaROB();
    this.cpu = new Procesador(this.listInstrucciones,this.numOrden);
  }


  sigInstruccion(){
    //testing 
    this.cpu.siguienteCiclo();

  }

}
