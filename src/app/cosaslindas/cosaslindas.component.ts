import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { addDoc, collection, getDocs, setDoc, doc, updateDoc, DocumentData, QuerySnapshot } from 'firebase/firestore/lite';
import { Foto } from '../Entidades/foto';
import { FirestoreService } from '../Servicios/firestore.service';
import { PhotoService } from '../Servicios/photo.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-cosaslindas',
  templateUrl: './cosaslindas.component.html',
  styleUrls: ['./cosaslindas.component.scss'],
})

export class CosaslindasComponent implements OnInit, OnDestroy 
{
  publicacionesCosasLindas:any;
  private subscription: Subscription = new Subscription();

  @ViewChild(IonInfiniteScroll) infiniteScroll: CosaslindasComponent;

  constructor(private routerRecieved:Router, public photoSrv:PhotoService, public authSrv:FirestoreService ) {}


  spinnerMostrandose = true;

  async ngOnInit() 
  {
    //--------SPINNER----------------------------------------------
    setTimeout( ()=> { this.spinnerMostrandose = false}, 2000);
    //-

    this.publicacionesCosasLindas = await this.photoSrv.leerDBCosasLindas();

    this.photoSrv.observeCosasLindasChanges((snapshot: QuerySnapshot<DocumentData>) => {
      this.publicacionesCosasLindas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });

    console.log(this.publicacionesCosasLindas);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  flagLoadingPublicaciones = true;

  async subirFoto()
  {
    await this.photoSrv.addNewToGallery();  
    // this.refrescarFotos();
  }

  volver()
  {
    this.routerRecieved.navigate(['/loged']);   
  }

  // agregarVisualizacionFoto(fotoEntity:Foto)
  // {
  //   let ion_item = document.createElement("ion-item");
  //   ion_item.className = "itemloaded";
  //   ion_item.setAttribute("color","medium");

  //   let info_container = document.createElement("p");
  //   info_container.className = "info-container";

  //   ion_item.appendChild(info_container);

  //   let label_mail = document.createElement("label");
  //   label_mail.className = "mailloaded";
  //   label_mail.innerHTML = fotoEntity.emisor;

  //   info_container.appendChild(label_mail);

  //   let img = document.createElement("img");
  //   img.className = "imgloaded";
  //   img.setAttribute("src",fotoEntity.foto);

  //   info_container.appendChild(img);

  //   let ion_row = document.createElement("ion-row");

  //   info_container.appendChild(ion_row);

  //   let ion_button = document.createElement("ion-button");
  //   ion_button.className = "buttonloaded";
  //   ion_button.setAttribute("color","light");
  //   ion_button.innerHTML = "VOTAR";

  //   ion_row.appendChild(ion_button);

  //   document.getElementById("item-list").appendChild(ion_item);
  // }

  // refrescarFotos()
  // {
  //   console.log("refreshing");
  //   let arrayOfItems = document.querySelectorAll("ion-item");
  //   arrayOfItems.forEach( (element)=> { element.remove()})

  //   this.publicacionesCosasLindas.forEach(element => 
  //   {
  //     let nuevaFoto = new Foto(element.emisor,element.fecha,element.foto,element.hora,element.like);
  //     this.agregarVisualizacionFoto(nuevaFoto);
  //   });
  // }

  votarImagen(foto : any, dislike : any)
  {
 
    if(!dislike)
    {
      foto.likes.push(this.authSrv.userLogedmail);
    }
    else
    {
      foto.likes = foto.likes.filter((like : string)=>like != this.authSrv.userLogedmail);
    }

    console.log(foto);
    console.log(foto.id);
    this.photoSrv.modificarImagen(foto);

  }


}
