import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  isBookable = false;
  placeId: string;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placeServices: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
    console.log(this.place);
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navController.navigateBack('/places/tab-places/discover');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      let fetchUserId: string;
      this.authService.userID.pipe(switchMap(userId => {
        if(!userId){
          throw new Error('Found No Users');
        }
        fetchUserId = userId;
        return this.placeServices.getPlacesId(paramMap.get('placeId'));
      })).subscribe(place1 =>{
        console.log(place1);
        this.place = place1;
        this.isBookable = place1.userID !== fetchUserId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An Error occured',
          message: 'Place could not be loaded.',
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.router.navigateByUrl('/places/tab-places/discover');
            }
          }]
        }).then(alertEle => {
          alertEle.present();
        });
      });;
      // this.place = this.placeServices.getPlacesId(paramMap.get('placeId'));
    });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  OnBookingPlace(){
    // this.navController.navigateBack('/places/tab-places/discover');
    this.actionSheetCtrl.create({
      header:'Choose an Action',
      buttons:[
        {
          text: 'Select Date',
          handler: () => this.onActionSheetCtrl('select')
        },
        {
          text: 'Random Date',
          handler: () => this.onActionSheetCtrl('random')
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    }).then(actionsheetEle => {
      actionsheetEle.present();
    });
  }

  onActionSheetCtrl(mode: 'select' | 'random'){
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps:{ selectedPlace: this.place, selectedMode: mode}
    }).then(modalEle => {
      console.log(mode);
      modalEle.present();
      return modalEle.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if(resultData.role === 'confirm'){
        this.loadingCtrl.create({
          message: 'Booking Place...'
        }).then(loadingEle => {
          loadingEle.present();
          const data = resultData.data.bookingData;
          console.log('data',data);
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageURL,
            data.firstName,
            data.lastName,
            data.guests,
            data.fromDate,
            data.toDate,
          ).subscribe(() => {
            loadingEle.dismiss();
          });
        });
        // console.log('booked');
      }
    });
    console.log(mode);
  }

  onShowFullMap(){
    console.log(this.place.location.lng, this.place.location.lat);
    this.modalCtrl.create({component: MapModalComponent,
      componentProps: {
        center: [this.place.location.lng, this.place.location.lat],
        selectable: false,
        title: this.place.location.address,
        closeButtonText: 'Cancel'
      }
    }).then((modalEle) => {
      modalEle.present();
    });
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}
