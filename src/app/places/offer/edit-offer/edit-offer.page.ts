import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: Place;
  form: FormGroup;
  placeId: string;
  isLoading = false;
  private placeSub: Subscription;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private placeServices: PlacesService,
    private loadingCtrl: LoadingController,
    private  alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tab-places/offer');
        return;
      }
      this.placeId = paramMap.get('placeId');
      console.log(this.placeId);
      this.isLoading = true;
      // this.place = this.placeServices.getPlacesId(paramMap.get('placeId'));
      this.placeSub = this.placeServices.getPlacesId(paramMap.get('placeId')).subscribe(placeE => {
        console.log(this.place);
        this.place = placeE;
        console.log(this.place);
        console.log(this.placeId);
        // set edit form controla
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          })
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An Error occured',
          message: 'Place could not be fatched.Try Again later',
          buttons: [{
            text: 'Ok',
            handler : () => {
              this.router.navigateByUrl('/places/tab-places/offer');
            }
          }]
        }).then(alertEle => {
          alertEle.present();
        });
      });
    });
  }

  onEditOffer(){
    if(!this.form.valid){
      return;
    }
    // console.log(this.form);
    this.loadingCtrl.create(
      { message: 'Create Place...'}
    ).then(
      modalEle =>
      {
        modalEle.present();
        this.placeServices.updatePlaces(
          this.place.id,
          this.form.value.title,
          this.form.value.description,
          ).subscribe(() => {
          this.loadingCtrl.dismiss();
          this.form.reset();
          this.router.navigateByUrl('/places/tab-places/offer');
        });
      }
    );
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}
