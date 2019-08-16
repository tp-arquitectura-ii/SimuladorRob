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
  tipoInstrucciones:string[] = ["ADD","SUB","MUL","DIV","ST","LD"];
  nombreRegistro:string[] = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10"];
  botonInstruccion = "Instruccion";
  botonDST = "DST";

  btnDefaultIns = {
    type : "INSTRUCCION",
    dst: "DST",
    op1: "OP1",
    op2: "OP2"
  };

  constructor(public dataService: Instruccion) { }

  ngOnInit() {
    this.instrucciones = this.dataService.getInstrucciones();    
  }

  change(pos,name){
    this.btnDefaultIns[pos] = name;
  }

  agregarInstruccion(){ 
    let instruccion:{id,tipo,destino,op1,op2} = {id: 1, tipo: this.btnDefaultIns.type , destino: this.btnDefaultIns.dst, op1:this.btnDefaultIns.op1, op2:this.btnDefaultIns.op2};
    console.log(instruccion);
    this.dataService.crearInstrucciones(instruccion);
 
}

}
