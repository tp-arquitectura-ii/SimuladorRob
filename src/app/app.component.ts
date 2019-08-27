import { Component, OnInit } from '@angular/core';
import { Instruction } from './Instruction';
import { Processor } from './Processor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  
  title = 'Simulador ROB';

  listInstructions = new Array<Instruction>();

  typeInstruction = [{ type: "ADD", cycle: 1},
                        {type: "SUB", cycle: 1},
                        {type:"MUL", cycle:1},
                        {type:"DIV", cycle:1},
                        {type:"ST", cycle:1},
                        {type:"LD",cycle: 1}];

  registers:string[] = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10"];
  numOrder = 1;
  numReserveStation = 1;
  numMultifunction =0;
  numArithmetic = 0;
  numMemory = 0;
  idInstruction = 0;
  btnDefaultIns = {
    type: "INSTRUCCION",
    dst: "DST",
    op1: "OP1",
    op2: "OP2"
  };

  cpu:Processor
  
  constructor() { }


  ngOnInit() {
    let ins1 = new Instruction("S1","ADD","R3","R0","R5","ARITH");
    let ins2 = new Instruction("S2","MUL","R2","R3","R5","ARITH");
    let ins3 = new Instruction("S3","DIV","R1","R2","R0","ARITH");
    let ins4 = new Instruction("S4","ST","R3","R1","","MEM");
    let ins5 = new Instruction("S5","SUB","R6","R3","R2","ARITH");
    let ins6 = new Instruction("S6","LD","R9","R6","","MEM");
    let ins7 = new Instruction("S7","SUB","R2","R6","R3","ARITH");
    let ins8 = new Instruction("S8","SUB","R10","R3","R1","ARITH");


    this.listInstructions.push(ins1);
    this.listInstructions.push(ins2);
    this.listInstructions.push(ins3);
    this.listInstructions.push(ins4);
    this.listInstructions.push(ins5);
    this.listInstructions.push(ins6);
    this.listInstructions.push(ins7);
    this.listInstructions.push(ins8)


    this.idInstruction = this.listInstructions.length;
    document.getElementById("tablacycle").style.visibility = "hidden";

  }
  
  change(pos,name){
    this.btnDefaultIns[pos] = name;
    this.updateButton();
    
  }

  imprimirDependencias() {
    for (let index = 0; index < this.listInstructions.length; index++) {
      console.log(this.listInstructions[index].getId() + ":" )
      for (let j = 0; j < this.listInstructions[index].dependecies.length; j++) {
        console.log(this.listInstructions[index].dependecies[j])
        
      }
      
    }
  }

  updateButton(){

    let btnAgr = document.getElementById("btn-Agregar");
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

  addInstruction(){ 
    this.idInstruction++
    let instNueva;
    if (this.btnDefaultIns.type=="ST" || this.btnDefaultIns.type == "LD")
      instNueva = new Instruction("S" +this.idInstruction,this.btnDefaultIns.type,this.btnDefaultIns.dst,this.btnDefaultIns.op1,"","MEM");
    else  
      instNueva = new Instruction("S" +this.idInstruction,this.btnDefaultIns.type,this.btnDefaultIns.dst,this.btnDefaultIns.op1,this.btnDefaultIns.op2,"ARITH");  
      this.listInstructions.push(instNueva);

}
  changeOrder(num){
      this.numOrder = num;
  }
  changeCycle(pos,numcycle){
    for (let tipoIns of this.typeInstruction) {
        if (tipoIns.type == pos )
          tipoIns.cycle = numcycle;
    }
  }
  
  changeER(num){
    this.numReserveStation=num;
  }

  changeUFmultifunction(num){
    this.numMultifunction= num;
  }

  changeUFArithmetic(num){
    this.numArithmetic = num;
  }
  changeUFMemory(num){
    this.numMemory= num;
  }

  deleteInstruction(inst:Instruction){
    let i = this.listInstructions.indexOf(inst);
    this.listInstructions.splice(i,1);
  }

  getDependenciasRAW(){
    let encontro = false;
    for (let i = 0; i < this.listInstructions.length -1; i++) {
      if(this.listInstructions[i].getType()!="ST")
       for (let j = i+1; j < this.listInstructions.length && !encontro; j++) {
         if(this.listInstructions[j].getType()!="ST"){
            if (this.listInstructions[i].getDestination() == this.listInstructions[j].getOp1() || this.listInstructions[i].getDestination() == this.listInstructions[j].getOp2() )  
              this.listInstructions[i].addDependency(this.listInstructions[j].getId());
            
            if(this.listInstructions[i].getDestination() == this.listInstructions[j].getDestination()){
              encontro=true;
            }
         }
          else{
            if(this.listInstructions[i].getDestination() == this.listInstructions[j].getDestination() || this.listInstructions[i].getDestination()==this.listInstructions[j].getOp1())            
              this.listInstructions[i].addDependency(this.listInstructions[j].getId()); 
            
          }
      }
      encontro = false;
    }
  }

  resetConfiguration(){
    document.getElementById("btn-next").setAttribute("hidden","");
    document.getElementById("btn-reset").setAttribute("disabled","");
    document.getElementById("btn-execute").setAttribute("disabled","");
    document.getElementById("btn-save").removeAttribute("disabled");
    document.getElementById("btn-numMemory").removeAttribute("disabled");
    document.getElementById("btn-numArithmeti").removeAttribute("disabled");
    document.getElementById("btn-numMultifunction").removeAttribute("disabled");
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
    document.getElementById("tablacycle").style.visibility = "hidden";
    document.getElementById("tablaDispatch").style.visibility = "hidden";
    document.getElementById("tablaER").style.visibility = "hidden";
    document.getElementById("tablaUF").style.visibility = "hidden";
    document.getElementById("tablaROB").style.visibility = "hidden";
  }

  saveConfiguration(){
    document.getElementById("btn-reset").removeAttribute("disabled");
    document.getElementById("btn-execute").removeAttribute("disabled");
    document.getElementById("btn-save").setAttribute("disabled","");
    document.getElementById("btn-numMemory").setAttribute("disabled","");
    document.getElementById("btn-numArithmetic").setAttribute("disabled","");
    document.getElementById("btn-numMultifunction").setAttribute("disabled","");
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
    this.setCycles();

  }

  private setCycles(){
    for(let i=0 ; i< this.listInstructions.length; i++){
      for (let j =0 ; j < this.typeInstruction.length; j++)
        if (this.listInstructions[i].getType() == this.typeInstruction[j].type){
          this.listInstructions[i].setCycles(this.typeInstruction[j].cycle);
        }    
      }

  }
  private createTableHeadROB(){
    //Inicializa la tabla del ROB
    let tablaROB = document.getElementById("tablaROB");
    let tr = document.createElement("tr");
    let th,I,S,th1;

    let tamROB = this.numReserveStation+ (this.numMultifunction+this.numArithmetic +this.numMemory);
    for (let i = 0; i < tamROB; i++) {
       th = document.createElement("th");
       I = document.createTextNode("I");
       th1 = document.createElement("th");
       S = document.createTextNode("S");
      th.appendChild(I);
      th1.appendChild(S);
      tr.appendChild(th);
      tr.appendChild(th1);

    }
    tablaROB.appendChild(tr);
  }

  private createTableHead(desc:string,num, tabla:string){
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
  
  public executeRob(){
    document.getElementById("btn-next").removeAttribute("hidden");
    document.getElementById("tablacycle").style.visibility = "visible";
    document.getElementById("tablaDispatch").style.visibility = "visible";
    document.getElementById("tablaER").style.visibility = "visible";
    document.getElementById("tablaUF").style.visibility = "visible";
    document.getElementById("tablaROB").style.visibility = "visible";
    document.getElementById("btn-execute").setAttribute("disabled","");
    this.createTableHead("ER",this.numReserveStation,"tablaER");
    this.createTableHead("D",this.numOrder,"tablaDispatch");
    this.createTableHead("UF",this.numArithmetic+this.numMemory+this.numMultifunction,"tablaUF");
    this.createTableHeadROB();
    let sizeROB = this.numReserveStation+ (this.numMultifunction+this.numArithmetic +this.numMemory);
    console.log("entro");
    this.getDependenciasRAW();
    this.cpu = new Processor(this.listInstructions,this.numOrder,this.numReserveStation,sizeROB);
    this.cpu.addUF(this.numArithmetic,this.numMemory,this.numMultifunction);
  }


  nextInstruction(){
    //testing 
    this.cpu.nextCycle();

  }

}
