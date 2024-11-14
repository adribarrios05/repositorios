import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { AnimationOptions, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { IonicModule } from '@ionic/angular';
import player, { AnimationItem } from 'lottie-web';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone:true,
  imports: [IonicModule, LottieComponent]
})
export class SplashPage implements OnInit {

  options: AnimationOptions = {
    path: '/assets/lotties/splash.json', // Ruta a tu archivo de animación
  };

  onAnimationCreated(animationItem: AnimationItem): void {
    console.log('Animación creada:', animationItem);
  }
  constructor(
    private router:Router,
    private authSvc:BaseAuthenticationService
  ) { }

  ngOnInit() {
    timer(5000).subscribe(_=>{
      this.router.navigate(['/home']);
    });
  }

}
