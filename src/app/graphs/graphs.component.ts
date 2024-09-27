import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { Chart, ChartDataset, ChartOptions, ChartType } from 'chart.js'
import { FirestoreService } from '../Servicios/firestore.service';
import { PhotoService } from '../Servicios/photo.service';
import { Subscription } from 'rxjs';
import { DocumentData, QuerySnapshot } from 'firebase/firestore/lite';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
})
export class GraphsComponent implements OnInit{
  publicacionesCosasLindas:any;
  publicacionesCosasFeas:any;
  private subscription: Subscription = new Subscription();

  constructor(private routerRecieved:Router, public srvFotos:PhotoService) {}

  spinnerMostrandose = true;
  //#region ---------------- GRAFICO DE BARRA --------------------------------------------------------------------

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartType: ChartType = 'bar';
  public barChartData: ChartDataset[] = [{ data: [3, 2] , backgroundColor: ["rgb(139, 65, 65)", "rgb(61, 58, 146)", "rgb(172, 150, 54)", "rgb(40, 122, 55)",],},];

  public barChartLabels: any = ['Cargando', 'Cargando','Cargando'];

  public barChartOptions = 
  {
    responsive: true,
  };
  //#endregion // --------------------------------------------------------------------------------------------------

  //#region  // ---------------- GRAFICO DE TARTA -----------------------------------------------------------------
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public pieChartType: ChartType  = 'pie';
  public pieChartData: ChartDataset[] =  [{ data: [4, 2], label: 'Las cosas más lindas' },];
  
  public pieChartLabels: any = ['Cargando', 'Cargando','Cargando'];

  public pieChartOptions =
  {
    responsive: true,
  };

  //#endregion --------------------------------------------------------------------------------------------------

  ngOnInit()
  {
    setTimeout( ()=> { this.spinnerMostrandose = false}, 2000);
    setTimeout( ()=>
    { 
      this.cargarData();

      let graphs = document.getElementById("graphs");
      graphs.removeAttribute("hidden");

    },2000);

    this.srvFotos.observeCosasLindasChanges((snapshot: QuerySnapshot<DocumentData>) => {
      this.publicacionesCosasLindas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
    this.srvFotos.observeCosasFeasChanges((snapshot: QuerySnapshot<DocumentData>) => {
      this.publicacionesCosasFeas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });

    console.log(this.publicacionesCosasLindas);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public async cargarData()
  {
    //BARRA PARA LAS COSAS MAS FEAS
    this.cargarDataBarChart();

    //TORTA PARA LAS COSAS MAS LINDAS
    this.cargarDataPieChart();
  }

  private async cargarDataPieChart()
  {
    console.log("DATA:");
    console.log(this.pieChartData[0].data);



    let result = await this.srvFotos.leerDBCosasLindas();

    this.publicacionesCosasLindas = result;
    console.log("COSAS LINDAS LEIDAS Y LISTAS:");
    console.log(this.publicacionesCosasLindas);

    //Limpio la data y los viejos labels del pieChart
    do {this.pieChartData[0].data.pop(); console.log("deleted");} while (this.pieChartData[0].data.length > 0);
    do {this.pieChartLabels.pop(); console.log("deleted");} while (this.pieChartLabels.length > 0);

    //Me traigo los elementos ordenados por la cantidad de likes
    let publicacionesCosasLindasMasLikeadas = this.publicacionesCosasLindas.sort( (a,b)=> 
    {
      if ( a.likes.length > b.likes.length) {return a} else {return b};
    });

    //Cargo los elementos al chart
    let contador = 0;
    publicacionesCosasLindasMasLikeadas.forEach(element => 
    {
      if (contador < 3)
      {
        this.pieChartData[0].data.push(element.likes.length);
        this.pieChartLabels.push(element.emisor);
        contador++;
      }
    });

    //Actualizo el pieChart
    let charts = Chart.instances;

    setTimeout( ()=>{charts[1].update();},1500)
  }

  private async cargarDataBarChart()
  {
    console.log("DATA:");
    console.log(this.barChartData[0].data);

    let publicacionesCosasFeas:any;

    let result = await this.srvFotos.leerDBCosasFeas();

    publicacionesCosasFeas = result;
    console.log("COSAS FEAS LEIDAS Y LISTAS:");
    console.log(publicacionesCosasFeas);

    //Limpio la data y los viejos labels del barChart
    do {this.barChartData[0].data.pop(); console.log("deleted");} while (this.barChartData[0].data.length > 0);
    do {this.barChartLabels.pop(); console.log("deleted");} while (this.barChartLabels.length > 0);

    //Me traigo los elementos ordenados por la cantidad de likes
    let publicacionesCosasFeasMasLikeadas = publicacionesCosasFeas.sort( (a,b)=> 
    {
      if ( a.likes.length > b.likes.length) {return a} else {return b};
    });

    //Cargo los elementos al chart
    let contador = 0;
    publicacionesCosasFeasMasLikeadas.forEach(element => 
    {
      if (contador < 3)
      {
        this.barChartData[0].data.push(element.likes.length);
        this.barChartLabels.push(element.emisor);
        contador++;
      }
    });

    //this.barChartData[0].label = "Las cosas más feas";

    //Actualizo el barChart
    let charts = Chart.instances;

    setTimeout( ()=>{charts[0].update();},1500)
    
  }

  public click(e:any)
  {
    console.log(e);
  }

  volver()
  {
    this.routerRecieved.navigate(['/loged']); 
  }
}
